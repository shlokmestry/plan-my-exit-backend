const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST: Save a new plan
router.post('/', async (req, res) => {
  const { user_id, monthly_expenses, runway_months, buffer } = req.body;
  console.log("📥 Incoming data:", req.body);

  try {
    const quit_number = (monthly_expenses * runway_months) + buffer;

    const result = await pool.query(
      `INSERT INTO plans (user_id, monthly_expenses, runway_months, buffer, quit_number)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, monthly_expenses, runway_months, buffer, quit_number]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("🔥 FULL ERROR:", err.stack);
    res.status(500).json({ error: err.message });
  }
});

// GET: Retrieve latest plan by user_id
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM plans WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('🔥 FULL ERROR:', err.stack);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
