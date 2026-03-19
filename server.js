const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

// الاتصال بقاعدة البيانات
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// اختبار السيرفر
app.get("/", (req, res) => {
  res.send("Zayed backend is running");
});

// اختبار قاعدة البيانات
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      time: result.rows[0],
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
});
// تشغيل السير});
  try {
    const result = await pool.query(
      'INSERT INTO users (name, phone) VALUES ($1, $2) RETURNING *',
      ['test', '0790000000']
    );

    res.json({ message: 'User created', user: result.rows[0] });

  } catch (err) {
    console.error(err);
    res.json({ error: err.message });
  }
});
app.post('/users/register', async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const result = await pool.query(
      'INSERT INTO users (name, phone) VALUES ($1, $2) RETURNING *',
      [name, phone]
    );

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
// تشغيل السيرفر
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
