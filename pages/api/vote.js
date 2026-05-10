import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'votes.json');

function readVotes() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = {
        keep: 0,
        sack: 0,
        voters: [],
      };

      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));

      return initial;
    }

    const file = fs.readFileSync(DATA_FILE, 'utf8');

    return JSON.parse(file);
  } catch (err) {
    console.error('READ ERROR:', err);

    return {
      keep: 0,
      sack: 0,
      voters: [],
    };
  }
}

function writeVotes(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('WRITE ERROR:', err);
    return false;
  }
}

export default function handler(req, res) {
  try {
    // ─── GET ────────────────────────────────────────────
    if (req.method === 'GET') {
      const votes = readVotes();

      return res.status(200).json({
        keep: votes.keep,
        sack: votes.sack,
      });
    }

    // ─── POST ───────────────────────────────────────────
    if (req.method === 'POST') {
      const { choice, voterId } = req.body;

      if (!choice || !['keep', 'sack'].includes(choice)) {
        return res.status(400).json({
          error: 'Invalid choice',
        });
      }

      if (!voterId) {
        return res.status(400).json({
          error: 'Missing voter ID',
        });
      }

      const votes = readVotes();

      // prevent duplicate votes
      if (votes.voters.includes(voterId)) {
        return res.status(409).json({
          error: 'Already voted',
          keep: votes.keep,
          sack: votes.sack,
        });
      }

      votes[choice]++;
      votes.voters.push(voterId);

      const saved = writeVotes(votes);

      if (!saved) {
        return res.status(500).json({
          error: 'Failed to save vote',
        });
      }

      return res.status(200).json({
        success: true,
        keep: votes.keep,
        sack: votes.sack,
      });
    }

    return res.status(405).json({
      error: 'Method not allowed',
    });
  } catch (err) {
    console.error('API ERROR:', err);

    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}