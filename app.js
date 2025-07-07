const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();

// 数据库连接配置
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_baH7oZMR3KJS@ep-mute-sun-a1mz1kfb-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

// 设置 ejs 作为模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 查询 tvlist 表并渲染
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tvlist');
    res.render('tvlist', { rows: result.rows, columns: result.fields.map(f => f.name) });
  } catch (err) {
    res.status(500).send('数据库查询失败: ' + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务已启动，端口：${PORT}`);
});
