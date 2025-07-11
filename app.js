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
    const result = await pool.query("SELECT * FROM tvlist WHERE status = 'opened'");
    res.render('tvlist', { rows: result.rows, columns: result.fields.map(f => f.name) });
  } catch (err) {
    res.status(500).send('数据库查询失败: ' + err.message);
  }
});

// 输出 tvlist.txt 格式的数据
app.get('/tvlist.txt', async (req, res) => {
  try {
    // 按分类查询数据
    const result = await pool.query(`
      SELECT id, category, set_name, url 
      FROM tvlist 
      ORDER BY category, set_name
    `);
    
    // 按分类分组
    const categories = {};
    result.rows.forEach(row => {
      const category = row.category;
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({
        id: row.id,
        set_name: row.set_name,
        url: row.url
      });
    });
    
    // 生成输出格式
    let output = '';
    for (const [category, channels] of Object.entries(categories)) {
      // 分类行：category,#genre#
      output += `${category},#genre#\n`;
      // 该分类下的频道行：set_name(ID),url
      channels.forEach(channel => {
        output += `${channel.set_name},${channel.url}\n`;
      });
    }
    
    // 设置响应头
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(output);
    
  } catch (err) {
    res.status(500).send('数据库查询失败: ' + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务已启动，端口：${PORT}`);
});
