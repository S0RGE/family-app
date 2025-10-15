import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

export interface Expense {
  id?: string
  amount: number
  category: string
  description: string
  familyMember: string
  date: Date
}

export interface Saving {
  id?: string
  amount: number
  source: string
  description: string
  date: Date
}

export interface PurchasePlan {
  id?: string
  name: string
  targetAmount: number
  currentSaved: number
  targetDate: Date
  priority: string
  status: string
}

export const expenseApi = {
  getAll: () => api.get<Expense[]>('/expenses'),
  create: (expense: Expense) => api.post('/expenses', expense),
  uploadPdf: (file: File, familyMember: string) => {
    const formData = new FormData()
    formData.append('pdf', file)
    formData.append('familyMember', familyMember)
    return api.post('/expenses/upload-pdf', formData)
  }
}

export const savingsApi = {
  getAll: () => api.get<Saving[]>('/savings'),
  create: (saving: Saving) => api.post('/savings', saving),
  getTotal: () => api.get<{ total: number }>('/savings/total')
}

export const planningApi = {
  getAll: () => api.get<PurchasePlan[]>('/planning'),
  create: (plan: PurchasePlan) => api.post('/planning', plan),
  updateProgress: (id: string, amount: number) => 
    api.put(`/planning/${id}/progress`, { amount })
}

export const aiApi = {
  getRecommendations: () => api.post('/ai/recommendations'),
  getAnalysis: () => api.get('/ai/analysis')
}
