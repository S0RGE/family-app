import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { db } from '../index';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Add expense manually
router.post('/', async (req, res) => {
  try {
    const { amount, category, description, familyMember, date } = req.body;
    
    const expense = {
      amount: parseFloat(amount),
      category,
      description,
      familyMember,
      date: new Date(date),
      createdAt: new Date()
    };

    const docRef = await db.collection('expenses').add(expense);
    res.json({ id: docRef.id, ...expense });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Upload PDF receipt
router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;
    
    // Simple extraction logic - you can enhance this
    const amountMatch = text.match(/\$?(\d+\.?\d*)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;

    const expense = {
      amount,
      category: 'Receipt',
      description: `PDF Receipt: ${req.file.originalname}`,
      familyMember: req.body.familyMember || 'Unknown',
      date: new Date(),
      createdAt: new Date(),
      pdfText: text
    };

    const docRef = await db.collection('expenses').add(expense);
    res.json({ id: docRef.id, ...expense });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process PDF' });
  }
});

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('expenses').orderBy('date', 'desc').get();
    const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

export default router;
