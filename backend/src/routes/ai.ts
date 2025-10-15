import express from 'express';
import OpenAI from 'openai';
import { db } from '../index';

const router = express.Router();

function getOpenRouter() {
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'placeholder_key') {
    throw new Error('OpenRouter API key not configured');
  }
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });
}

// Get AI recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const openrouter = getOpenRouter();
    
    // Fetch recent data
    const expensesSnapshot = await db.collection('expenses').orderBy('date', 'desc').limit(50).get();
    const savingsSnapshot = await db.collection('savings').get();
    const plansSnapshot = await db.collection('purchasePlans').get();

    const expenses = expensesSnapshot.docs.map(doc => doc.data());
    const totalSavings = savingsSnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
    const plans = plansSnapshot.docs.map(doc => doc.data());

    const prompt = `
    Based on this family financial data, provide recommendations:
    
    Recent expenses: ${JSON.stringify(expenses.slice(0, 10))}
    Total savings: $${totalSavings}
    Purchase plans: ${JSON.stringify(plans)}
    
    Provide 3-5 specific recommendations for:
    1. Reducing wasteful spending
    2. Optimizing savings strategy
    3. Achieving purchase goals
    
    Format as JSON with recommendations array.
    `;

    const completion = await openrouter.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500
    });

    const recommendations = JSON.parse(completion.choices[0].message.content || '{"recommendations": []}');
    res.json(recommendations);
  } catch (error) {
    if (error instanceof Error && error.message === 'OpenRouter API key not configured') {
      res.status(503).json({ error: 'AI service not configured' });
    } else {
      res.status(500).json({ error: 'Failed to get AI recommendations' });
    }
  }
});

// Analyze spending patterns
router.get('/analysis', async (req, res) => {
  try {
    const snapshot = await db.collection('expenses').get();
    const expenses = snapshot.docs.map(doc => doc.data());

    const categoryTotals = expenses.reduce((acc: any, expense: any) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const monthlySpending = expenses.reduce((acc: any, expense: any) => {
      const month = new Date(expense.date.seconds * 1000).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {});

    res.json({
      categoryTotals,
      monthlySpending,
      totalSpent: expenses.reduce((sum, exp) => sum + exp.amount, 0)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze spending' });
  }
});

export default router;
