const connectDB = require('./lib/db');
const Visit     = require('./lib/Visit');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { name, sharedBy } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const visit = await Visit.create({
      name:      name.trim(),
      sharedBy:  sharedBy || null,
      userAgent: req.headers['user-agent'],
    });
    res.status(200).json({ success: true, id: visit._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
