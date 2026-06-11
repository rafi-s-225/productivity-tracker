const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({ message: 'Blocklist route working' });
});

module.exports = router;