const router = require('express').Router();
const Session = require('../models/Session');

// Save a session (called by extension)
router.post('/', async (req, res) => {
  try {
    const { userId, domain, duration, date, isProductive } = req.body;
    const session = new Session({ userId, domain, duration, date, isProductive });
    await session.save();
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all sessions for a user on a specific date
router.get('/:userId/:date', async (req, res) => {
  try {
    const sessions = await Session.find({
      userId: req.params.userId,
      date: req.params.date
    }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all sessions for a user (all time)
router.get('/:userId', async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;