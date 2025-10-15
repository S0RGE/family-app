import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock axios before importing the API
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn()
    }))
  }
}))

import { expenseApi, savingsApi, planningApi } from '../services/api'

describe('API Services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('expenseApi', () => {
    it('should have getAll method', () => {
      expect(typeof expenseApi.getAll).toBe('function')
    })

    it('should have create method', () => {
      expect(typeof expenseApi.create).toBe('function')
    })

    it('should have uploadPdf method', () => {
      expect(typeof expenseApi.uploadPdf).toBe('function')
    })
  })

  describe('savingsApi', () => {
    it('should have getTotal method', () => {
      expect(typeof savingsApi.getTotal).toBe('function')
    })

    it('should have create method', () => {
      expect(typeof savingsApi.create).toBe('function')
    })
  })

  describe('planningApi', () => {
    it('should have create method', () => {
      expect(typeof planningApi.create).toBe('function')
    })

    it('should have updateProgress method', () => {
      expect(typeof planningApi.updateProgress).toBe('function')
    })
  })
})
