const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// الاتصال بقاعدة البيانات
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// test server
app.get('/', (req, res) => {
  res.send('Zayed backend is running');
});

// test database
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
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

// register user
app.post('/users/register', async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        error: 'Name and phone are required',
      });
    }

    const result = await pool.query(
      'INSERT INTO users (name, phone) VALUES ($1, $2) RETURNING *',
      [name, phone]
    );

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
