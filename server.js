require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const path      = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── MongoDB connection ──────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ── Schema & Model ──────────────────────────────────
const visitSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  sharedBy:  { type: String, default: null },
  visitedAt: { type: Date, default: Date.now },
  userAgent: { type: String },
});

const Visit = mongoose.model('Visit', visitSchema);

// ── Routes ──────────────────────────────────────────

// Log a visit / name entry
app.post('/api/visit', async (req, res) => {
  try {
    const { name, sharedBy } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const visit = await Visit.create({
      name:      name.trim(),
      sharedBy:  sharedBy || null,
      userAgent: req.headers['user-agent'],
    });
    res.json({ success: true, id: visit._id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all visits (optional admin view)
app.get('/api/visits', async (req, res) => {
  try {
    const visits = await Visit.find().sort({ visitedAt: -1 }).limit(100);
    res.json(visits);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get share stats for a name
app.get('/api/stats/:name', async (req, res) => {
  try {
    const name  = req.params.name;
    const count = await Visit.countDocuments({ sharedBy: name });
    res.json({ name, friendsGreeted: count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🐣 Easter server running at http://localhost:${PORT}`);
});