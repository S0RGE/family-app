import express from 'express';
import { db } from '../index';

const router = express.Router();

// Add savings
router.post('/', async (req, res) => {
  try {
    const { amount, source, description, date } = req.body;
    
    const saving = {
      amount: parseFloat(amount),
      source,
      description,
      date: new Date(date),
      createdAt: new Date()
    };

    const docRef = await db.collection('savings').add(saving);
    res.json({ id: docRef.id, ...saving });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add savings' });
  }
});

// Get total savings
router.get('/total', async (req, res) => {
  try {
    const snapshot = await db.collection('savings').get();
    const total = snapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate total savings' });
  }
});

// Get all savings
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('savings').orderBy('date', 'desc').get();
    const savings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(savings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch savings' });
  }
});

export default router;
