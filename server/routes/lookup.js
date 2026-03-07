const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// GET /api/categories
router.get('/categories', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.query('SELECT id, name FROM Categories ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/categories error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/business-units
router.get('/business-units', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.query('SELECT id, name FROM BusinessUnits ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/business-units error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
