const express = require('express');
const router = express.Router();
const LessonPlan = require('../models/LessonPlan');

// 獲取所有教案
router.get('/', async (req, res) => {
  try {
    const lessonPlans = await LessonPlan.find();
    res.json(lessonPlans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 創建新教案
router.post('/', async (req, res) => {
  const lessonPlan = new LessonPlan({
    title: req.body.title,
    content: req.body.content,
    grade: req.body.grade,
    subject: req.body.subject
  });

  try {
    const newLessonPlan = await lessonPlan.save();
    res.status(201).json(newLessonPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 獲取特定教案
router.get('/:id', getLessonPlan, (req, res) => {
  res.json(res.lessonPlan);
});

// 更新教案
router.patch('/:id', getLessonPlan, async (req, res) => {
  if (req.body.title != null) {
    res.lessonPlan.title = req.body.title;
  }
  if (req.body.content != null) {
    res.lessonPlan.content = req.body.content;
  }
  if (req.body.grade != null) {
    res.lessonPlan.grade = req.body.grade;
  }
  if (req.body.subject != null) {
    res.lessonPlan.subject = req.body.subject;
  }
  res.lessonPlan.updatedAt = Date.now();

  try {
    const updatedLessonPlan = await res.lessonPlan.save();
    res.json(updatedLessonPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 刪除教案
router.delete('/:id', getLessonPlan, async (req, res) => {
  try {
    await res.lessonPlan.deleteOne();
    res.json({ message: '教案已刪除' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 中間件函數
async function getLessonPlan(req, res, next) {
  let lessonPlan;
  try {
    lessonPlan = await LessonPlan.findById(req.params.id);
    if (lessonPlan == null) {
      return res.status(404).json({ message: '找不到教案' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.lessonPlan = lessonPlan;
  next();
}

module.exports = router; 