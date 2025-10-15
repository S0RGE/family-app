import request from 'supertest';
import express from 'express';
import expenseRoutes from '../routes/expenses';

// Mock Firebase
jest.mock('../index', () => ({
  db: {
    collection: jest.fn(() => ({
      add: jest.fn(() => Promise.resolve({ id: 'test-id' })),
      get: jest.fn(() => Promise.resolve({
        docs: [
          { id: '1', data: () => ({ amount: 50, category: 'Food', description: 'Test' }) }
        ]
      })),
      orderBy: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({
          docs: [
            { id: '1', data: () => ({ amount: 50, category: 'Food', description: 'Test' }) }
          ]
        }))
      }))
    }))
  }
}));

const app = express();
app.use(express.json());
app.use('/expenses', expenseRoutes);

describe('Expense Routes', () => {
  test('POST /expenses should create expense', async () => {
    const expense = {
      amount: 25.50,
      category: 'Food',
      description: 'Lunch',
      familyMember: 'John',
      date: '2024-01-01'
    };

    const response = await request(app)
      .post('/expenses')
      .send(expense)
      .expect(200);

    expect(response.body.id).toBe('test-id');
    expect(response.body.amount).toBe(25.50);
  });

  test('GET /expenses should return expenses', async () => {
    const response = await request(app)
      .get('/expenses')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].amount).toBe(50);
  });
});
