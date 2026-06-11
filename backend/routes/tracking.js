const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({ message: 'Tracking route working' });
});

module.exports = router;