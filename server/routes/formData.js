const express = require('express');
const router = express.Router();
const FormData = require('../models/FormData');

// 獲取所有表單數據
router.get('/', async (req, res) => {
  try {
    const formDataList = await FormData.find().sort({ createdAt: -1 });
    console.log('獲取歷史記錄:', formDataList.length, '條記錄');
    res.json(formDataList);
  } catch (err) {
    console.error('獲取歷史記錄錯誤:', err);
    res.status(500).json({ message: err.message });
  }
});

// 提交新的表單數據
router.post('/', async (req, res) => {
  console.log('收到表單提交:', req.body);  // 添加日誌

  try {
    // 驗證必要字段
    const requiredFields = ['name', 'email', 'childAge', 'venue', 'message'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw new Error(`缺少必要字段: ${field}`);
      }
    }

    const formData = new FormData({
      name: req.body.name,
      email: req.body.email,
      childAge: req.body.childAge,
      venue: req.body.venue,
      message: req.body.message
    });

    const newFormData = await formData.save();
    console.log('表單數據已保存:', newFormData._id);  // 添加日誌
    
    // 生成分析結果
    const analysis = `已收到 ${formData.name} 的教案需求，將為 ${formData.childAge} 歲的孩子在 ${formData.venue} 設計適合的教案。`;
    
    newFormData.analysis = analysis;
    await newFormData.save();

    res.status(201).json({ 
      message: '表單提交成功',
      analysis: analysis,
      formData: newFormData
    });
  } catch (err) {
    console.error('表單提交錯誤:', err);  // 添加錯誤日誌
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 