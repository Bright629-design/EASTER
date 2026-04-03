const connectDB = require('./lib/db');
const Visit     = require('./lib/Visit');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const name  = req.query.name;
    const count = await Visit.countDocuments({ sharedBy: name });
    res.status(200).json({ name, friendsGreeted: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
