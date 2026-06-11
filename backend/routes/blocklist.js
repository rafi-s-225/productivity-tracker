const router = require('express').Router();
const Blocklist = require('../models/Blocklist');

// Add a site to blocklist
router.post('/', async (req, res) => {
  try {
    const { userId, domain, reason } = req.body;

    const existing = await Blocklist.findOne({ userId, domain });
    if (existing) return res.status(400).json({ error: 'Domain already blocked' });

    const entry = new Blocklist({ userId, domain, reason });
    await entry.save();
    res.json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all blocked sites for a user
router.get('/:userId', async (req, res) => {
  try {
    const blocklist = await Blocklist.find({ userId: req.params.userId });
    res.json(blocklist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a site from blocklist
router.delete('/:userId/:domain', async (req, res) => {
  try {
    await Blocklist.findOneAndDelete({
      userId: req.params.userId,
      domain: req.params.domain
    });
    res.json({ success: true, message: 'Domain unblocked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;