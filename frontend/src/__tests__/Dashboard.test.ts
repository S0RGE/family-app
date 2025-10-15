import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock Chart.js completely
vi.mock('chart.js', () => ({
  Chart: class MockChart {
    static register = vi.fn()
    constructor() {}
  },
  registerables: []
}))

// Mock API services
vi.mock('../services/api', () => ({
  savingsApi: {
    getTotal: vi.fn().mockResolvedValue({ data: { total: 1000 } })
  },
  planningApi: {
    getAll: vi.fn().mockResolvedValue({ 
      data: [
        { id: '1', status: 'active', name: 'Car' },
        { id: '2', status: 'completed', name: 'Phone' }
      ]
    })
  },
  expenseApi: {
    getAll: vi.fn().mockResolvedValue({
      data: [
        { amount: 50, date: new Date().toISOString() },
        { amount: 30, date: new Date().toISOString() }
      ]
    })
  },
  aiApi: {
    getRecommendations: vi.fn().mockResolvedValue({
      data: { recommendations: ['Save more', 'Spend less'] }
    }),
    getAnalysis: vi.fn().mockResolvedValue({
      data: { categoryTotals: { Food: 100, Transport: 50 } }
    })
  }
}))

import Dashboard from '../views/Dashboard.vue'

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dashboard title', () => {
    const wrapper = mount(Dashboard)
    expect(wrapper.find('h2').text()).toBe('📊 Financial Dashboard')
  })

  it('displays stats cards', () => {
    const wrapper = mount(Dashboard)
    const statCards = wrapper.findAll('.stat-card')
    expect(statCards.length).toBe(3)
  })
})
