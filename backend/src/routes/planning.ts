import express from 'express';
import { db } from '../index';

const router = express.Router();

// Create purchase plan
router.post('/', async (req, res) => {
  try {
    const { name, targetAmount, currentSaved, targetDate, priority } = req.body;
    
    const plan = {
      name,
      targetAmount: parseFloat(targetAmount),
      currentSaved: parseFloat(currentSaved) || 0,
      targetDate: new Date(targetDate),
      priority: priority || 'medium',
      status: 'active',
      createdAt: new Date()
    };

    const docRef = await db.collection('purchasePlans').add(plan);
    res.json({ id: docRef.id, ...plan });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create purchase plan' });
  }
});

// Update plan progress
router.put('/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    
    const docRef = db.collection('purchasePlans').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const currentSaved = doc.data()!.currentSaved + parseFloat(amount);
    await docRef.update({ currentSaved });
    
    res.json({ success: true, currentSaved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Get all plans
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('purchasePlans').orderBy('priority').get();
    const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

export default router;
