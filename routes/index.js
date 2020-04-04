const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('index', { name: req.user.userName }));

module.exports = router;