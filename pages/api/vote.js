import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // ── GET — return current totals ──────────────────────────────────────
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('votes')
      .select('choice, count')
      .in('choice', ['keep', 'sack']);

    if (error) {
      console.error('Supabase GET error:', error);
      return res.status(500).json({ error: 'Failed to fetch votes' });
    }

    // Sum up rows: each row is one vote record; count distinct rows per choice
    const { data: counts, error: countErr } = await supabase
      .from('votes')
      .select('choice')
      .in('choice', ['keep', 'sack']);

    if (countErr) {
      return res.status(500).json({ error: 'Failed to count votes' });
    }

    const keep = counts.filter((r) => r.choice === 'keep').length;
    const sack = counts.filter((r) => r.choice === 'sack').length;

    return res.status(200).json({ keep, sack });
  }

  // ── POST — cast a vote ───────────────────────────────────────────────
  if (req.method === 'POST') {
    const { choice, voterId } = req.body;

    if (!choice || !['keep', 'sack'].includes(choice)) {
      return res.status(400).json({ error: 'Invalid choice' });
    }
    if (!voterId) {
      return res.status(400).json({ error: 'Missing voter ID' });
    }

    // Check if this voter already exists
    const { data: existing, error: checkErr } = await supabase
      .from('votes')
      .select('id, choice')
      .eq('voter_id', voterId)
      .single();

    if (checkErr && checkErr.code !== 'PGRST116') {
      // PGRST116 = row not found — that\'s fine, means not voted yet
      console.error('Supabase check error:', checkErr);
      return res.status(500).json({ error: 'Database error' });
    }

    // Get current totals helper
    async function getTotals() {
      const { data: all } = await supabase
        .from('votes')
        .select('choice')
        .in('choice', ['keep', 'sack']);
      const keep = all.filter((r) => r.choice === 'keep').length;
      const sack = all.filter((r) => r.choice === 'sack').length;
      return { keep, sack };
    }

    if (existing) {
      // Already voted — return current totals with 409
      const totals = await getTotals();
      return res.status(409).json({ error: 'Already voted', ...totals });
    }

    // Insert the new vote
    const { error: insertErr } = await supabase
      .from('votes')
      .insert({ voter_id: voterId, choice });

    if (insertErr) {
      // Handle unique constraint violation (race condition)
      if (insertErr.code === '23505') {
        const totals = await getTotals();
        return res.status(409).json({ error: 'Already voted', ...totals });
      }
      console.error('Supabase insert error:', insertErr);
      return res.status(500).json({ error: 'Failed to record vote' });
    }

    const totals = await getTotals();
    return res.status(200).json({ success: true, ...totals });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
