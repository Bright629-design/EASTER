const connectDB = require('./lib/db');
const Visit     = require('./lib/Visit');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const visits = await Visit.find().sort({ visitedAt: -1 }).limit(100);
    res.status(200).json(visits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
