require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const lessonPlansRouter = require('./routes/lessonPlans');
const formDataRouter = require('./routes/formData');

const app = express();
const port = process.env.PORT || 5000;

// 中間件
app.use(cors({
  origin: 'http://localhost:3006',
  credentials: true
}));
app.use(express.json());

// MongoDB 連接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lesson-plans')
  .then(() => console.log('MongoDB 連接成功'))
  .catch((err) => console.error('MongoDB 連接錯誤:', err));

// 路由
app.use('/api/lesson-plans', lessonPlansRouter);
app.use('/api/form-data', formDataRouter);

// 基本路由
app.get('/', (req, res) => {
  res.json({ message: '歡迎使用教案分析系統 API' });
});

// 啟動服務器
app.listen(port, () => {
  console.log(`服務器運行在端口 ${port}`);
}); 