import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// helper: get totals
async function getTotals() {
  const { data, error } = await supabase
    .from('votes')
    .select('choice');

  if (error) throw error;

  const keep = data.filter(v => v.choice === 'keep').length;
  const sack = data.filter(v => v.choice === 'sack').length;

  return { keep, sack };
}

export default async function handler(req, res) {
  // ── GET: return totals ─────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const totals = await getTotals();
      return res.status(200).json(totals);
    } catch (error) {
      console.error('Supabase GET error:', error);
      return res.status(500).json({ error: 'Failed to fetch votes' });
    }
  }

  // ── POST: cast vote ────────────────────────────────────────────────
  if (req.method === 'POST') {
    const { choice, voterId } = req.body;

    if (!choice || !['keep', 'sack'].includes(choice)) {
      return res.status(400).json({ error: 'Invalid choice' });
    }

    if (!voterId) {
      return res.status(400).json({ error: 'Missing voter ID' });
    }

    // check existing vote safely
    const { data: existing, error: checkErr } = await supabase
      .from('votes')
      .select('id')
      .eq('voter_id', voterId)
      .maybeSingle();

    if (checkErr) {
      console.error('Supabase check error:', checkErr);
      return res.status(500).json({ error: 'Database error' });
    }

    // already voted
    if (existing) {
      const totals = await getTotals();
      return res.status(409).json({
        error: 'Already voted',
        ...totals
      });
    }

    // insert vote
    const { error: insertErr } = await supabase
      .from('votes')
      .insert({ voter_id: voterId, choice });

    if (insertErr) {
      // handle race condition (unique constraint)
      if (insertErr.code === '23505') {
        const totals = await getTotals();
        return res.status(409).json({
          error: 'Already voted',
          ...totals
        });
      }

      console.error('Supabase insert error:', insertErr);
      return res.status(500).json({ error: 'Failed to record vote' });
    }

    const totals = await getTotals();
    return res.status(200).json({
      success: true,
      ...totals
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}