const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = process.env.PORT || 5000;

// 中間件
app.use(cors());
app.use(express.json());

// 設置 SQLite 數據庫
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: console.log,
  dialectOptions: {
    mode: require('sqlite3').OPEN_READWRITE | require('sqlite3').OPEN_CREATE
  }
});

// 定義表單數據模型
const FormData = sequelize.define('FormData', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  analysis: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// 初始化數據庫
(async () => {
  try {
    await sequelize.authenticate();
    console.log('數據庫連接成功。');
    await sequelize.sync();
    console.log('數據表已同步。');
  } catch (error) {
    console.error('無法連接到數據庫:', error);
  }
})();

// API 路由
app.post('/api/submit-form', async (req, res) => {
  try {
    const { formData } = req.body;
    
    // 簡單的數據分析
    const analysis = `收到的表單數據分析：
    - 名稱長度：${formData.name.length} 個字符
    - 郵件域名：${formData.email.split('@')[1]}
    - 訊息長度：${formData.message.length} 個字符
    - 提交時間：${new Date().toLocaleString()}`;

    // 保存到數據庫
    const result = await FormData.create({
      name: formData.name,
      email: formData.email,
      message: formData.message,
      analysis: analysis
    });

    res.json({
      success: true,
      analysis: analysis,
      id: result.id
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 獲取所有表單數據
app.get('/api/form-data', async (req, res) => {
  try {
    const allData = await FormData.findAll();
    res.json(allData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`服務器運行在端口 ${port}`);
}); 