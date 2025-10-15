import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import expenseRoutes from './routes/expenses';
import savingsRoutes from './routes/savings';
import planningRoutes from './routes/planning';
import aiRoutes from './routes/ai';
import telegramBot from './services/telegram';

dotenv.config();

// Initialize Firebase Admin
const serviceAccount = require('../firebase-service-account.json');
initializeApp({
  credential: cert(serviceAccount)
});

export const db = getFirestore();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/planning', planningRoutes);
app.use('/api/ai', aiRoutes);

// Initialize Telegram Bot
telegramBot.init();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
