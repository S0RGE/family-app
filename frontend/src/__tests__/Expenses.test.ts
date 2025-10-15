import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Expenses from '../views/Expenses.vue'

vi.mock('../services/api', () => ({
  expenseApi: {
    getAll: vi.fn().mockResolvedValue({
      data: [
        { 
          id: '1', 
          amount: 25.50, 
          category: 'Food', 
          description: 'Lunch',
          familyMember: 'John',
          date: '2024-01-01'
        }
      ]
    }),
    create: vi.fn().mockResolvedValue({ data: { id: 'new-id' } }),
    uploadPdf: vi.fn().mockResolvedValue({ data: { id: 'pdf-id' } })
  }
}))

describe('Expenses', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders expenses page', () => {
    const wrapper = mount(Expenses)
    expect(wrapper.find('h2').text()).toBe('💸 Expense Tracking')
  })

  it('displays expense form', () => {
    const wrapper = mount(Expenses)
    const form = wrapper.find('.expense-form')
    expect(form.exists()).toBe(true)
    
    const inputs = form.findAll('input')
    expect(inputs.length).toBeGreaterThan(0)
  })

  it('shows add expense button', () => {
    const wrapper = mount(Expenses)
    const button = wrapper.find('button[type="submit"]')
    expect(button.text()).toBe('Add Expense')
  })

  it('displays PDF upload section', () => {
    const wrapper = mount(Expenses)
    const uploadSection = wrapper.find('.pdf-upload')
    expect(uploadSection.exists()).toBe(true)
    expect(uploadSection.text()).toContain('Upload Receipt (PDF)')
  })
})
