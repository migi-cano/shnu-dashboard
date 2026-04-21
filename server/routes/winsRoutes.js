const express = require('express');
const router = express.Router();
const { getWins, saveWins } = require('../controllers/winsController');

router.get('/', getWins);
router.post('/', saveWins);

module.exports = router;