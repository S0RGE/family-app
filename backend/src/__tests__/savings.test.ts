import request from 'supertest';
import express from 'express';
import savingsRoutes from '../routes/savings';

jest.mock('../index', () => ({
  db: {
    collection: jest.fn(() => ({
      add: jest.fn(() => Promise.resolve({ id: 'savings-id' })),
      get: jest.fn(() => Promise.resolve({
        docs: [
          { data: () => ({ amount: 100 }) },
          { data: () => ({ amount: 200 }) }
        ]
      })),
      orderBy: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({
          docs: [
            { id: '1', data: () => ({ amount: 100, source: 'Salary' }) }
          ]
        }))
      }))
    }))
  }
}));

const app = express();
app.use(express.json());
app.use('/savings', savingsRoutes);

describe('Savings Routes', () => {
  test('POST /savings should create saving', async () => {
    const saving = {
      amount: 500,
      source: 'Salary',
      description: 'Monthly savings',
      date: '2024-01-01'
    };

    const response = await request(app)
      .post('/savings')
      .send(saving)
      .expect(200);

    expect(response.body.id).toBe('savings-id');
    expect(response.body.amount).toBe(500);
  });

  test('GET /savings/total should return total', async () => {
    const response = await request(app)
      .get('/savings/total')
      .expect(200);

    expect(response.body.total).toBe(300);
  });
});
