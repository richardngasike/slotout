import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'votes.json');

function readVotes() {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = { keep: 0, sack: 0, voters: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeVotes(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    const votes = readVotes();
    return res.status(200).json({ keep: votes.keep, sack: votes.sack });
  }

  if (req.method === 'POST') {
    const { choice, voterId } = req.body;

    if (!choice || !['keep', 'sack'].includes(choice)) {
      return res.status(400).json({ error: 'Invalid choice' });
    }
    if (!voterId) {
      return res.status(400).json({ error: 'Missing voter ID' });
    }

    const votes = readVotes();

    // Check if already voted
    if (votes.voters.includes(voterId)) {
      return res.status(409).json({ error: 'Already voted', keep: votes.keep, sack: votes.sack });
    }

    votes[choice]++;
    votes.voters.push(voterId);
    writeVotes(votes);

    return res.status(200).json({ success: true, keep: votes.keep, sack: votes.sack });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
