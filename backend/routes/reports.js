const router = require('express').Router();
const Session = require('../models/Session');
const Report = require('../models/Report');

// Generate and save daily report for a user
router.post('/generate', async (req, res) => {
  try {
    const { userId, date } = req.body;

    const sessions = await Session.find({ userId, date });

    const totalTimeSeconds    = sessions.reduce((sum, s) => sum + s.duration, 0);
    const productiveSeconds   = sessions.filter(s => s.isProductive).reduce((sum, s) => sum + s.duration, 0);
    const unproductiveSeconds = sessions.filter(s => !s.isProductive).reduce((sum, s) => sum + s.duration, 0);

    // Calculate top sites
    const siteMap = {};
    sessions.forEach(s => {
      siteMap[s.domain] = (siteMap[s.domain] || 0) + s.duration;
    });
    const topSites = Object.entries(siteMap)
      .map(([domain, duration]) => ({ domain, duration }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);

    const report = await Report.findOneAndUpdate(
      { userId, date },
      { totalTimeSeconds, productiveSeconds, unproductiveSeconds, topSites },
      { upsert: true, new: true }
    );

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get report for a specific date
router.get('/:userId/:date', async (req, res) => {
  try {
    const report = await Report.findOne({
      userId: req.params.userId,
      date: req.params.date
    });
    if (!report) return res.status(404).json({ error: 'No report found for this date' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get last 7 days reports
router.get('/:userId', async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .limit(7);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;