import request from 'supertest';
import express from 'express';
import planningRoutes from '../routes/planning';

jest.mock('../index', () => ({
  db: {
    collection: jest.fn(() => ({
      add: jest.fn(() => Promise.resolve({ id: 'plan-id' })),
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({
          exists: true,
          data: () => ({ currentSaved: 100 })
        })),
        update: jest.fn(() => Promise.resolve())
      })),
      orderBy: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({
          docs: [
            { id: '1', data: () => ({ name: 'Car', targetAmount: 5000, status: 'active' }) }
          ]
        }))
      }))
    }))
  }
}));

const app = express();
app.use(express.json());
app.use('/planning', planningRoutes);

describe('Planning Routes', () => {
  test('POST /planning should create plan', async () => {
    const plan = {
      name: 'New Car',
      targetAmount: 10000,
      currentSaved: 0,
      targetDate: '2024-12-31',
      priority: 'high'
    };

    const response = await request(app)
      .post('/planning')
      .send(plan)
      .expect(200);

    expect(response.body.id).toBe('plan-id');
    expect(response.body.name).toBe('New Car');
  });

  test('PUT /planning/:id/progress should update progress', async () => {
    const response = await request(app)
      .put('/planning/plan-id/progress')
      .send({ amount: 50 })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.currentSaved).toBe(150);
  });
});
