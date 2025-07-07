const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

// 数据库连接配置
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_baH7oZMR3KJS@ep-mute-sun-a1mz1kfb-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

// 允许所有来源跨域访问
app.use(cors());

// 提供 tvlist 数据的 API
app.get('/api/tvlist', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tvlist');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务已启动，端口：${PORT}`);
});
