<template>
  <div class="expenses">
    <h2>💸 Expense Tracking</h2>
    
    <div class="add-expense">
      <h3>Add New Expense</h3>
      <form @submit.prevent="addExpense" class="expense-form">
        <input v-model="newExpense.amount" type="number" step="0.01" placeholder="Amount" required>
        <select v-model="newExpense.category" required>
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Other">Other</option>
        </select>
        <input v-model="newExpense.description" placeholder="Description" required>
        <input v-model="newExpense.familyMember" placeholder="Family Member" required>
        <input v-model="newExpense.date" type="date" required>
        <button type="submit" class="btn">Add Expense</button>
      </form>
    </div>

    <div class="pdf-upload">
      <h3>Upload Receipt (PDF)</h3>
      <div class="upload-form">
        <input type="file" @change="handleFileSelect" accept=".pdf" ref="fileInput">
        <input v-model="pdfFamilyMember" placeholder="Family Member" required>
        <button @click="uploadPdf" :disabled="!selectedFile" class="btn">Upload PDF</button>
      </div>
    </div>

    <div class="expenses-list">
      <h3>Recent Expenses</h3>
      <div class="expense-item" v-for="expense in expenses" :key="expense.id">
        <div class="expense-info">
          <span class="amount">${{ expense.amount.toFixed(2) }}</span>
          <span class="category">{{ expense.category }}</span>
          <span class="description">{{ expense.description }}</span>
          <span class="member">{{ expense.familyMember }}</span>
          <span class="date">{{ formatDate(expense.date) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { expenseApi, type Expense } from '../services/api'

const expenses = ref<Expense[]>([])
const selectedFile = ref<File | null>(null)
const pdfFamilyMember = ref('')
const fileInput = ref<HTMLInputElement>()

const newExpense = ref<Expense>({
  amount: 0,
  category: '',
  description: '',
  familyMember: '',
  date: new Date()
})

onMounted(() => {
  loadExpenses()
  newExpense.value.date = new Date()
})

const loadExpenses = async () => {
  try {
    const response = await expenseApi.getAll()
    expenses.value = response.data
  } catch (error) {
    console.error('Failed to load expenses:', error)
  }
}

const addExpense = async () => {
  try {
    await expenseApi.create(newExpense.value)
    await loadExpenses()
    
    // Reset form
    newExpense.value = {
      amount: 0,
      category: '',
      description: '',
      familyMember: '',
      date: new Date()
    }
  } catch (error) {
    console.error('Failed to add expense:', error)
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
}

const uploadPdf = async () => {
  if (!selectedFile.value || !pdfFamilyMember.value) return
  
  try {
    await expenseApi.uploadPdf(selectedFile.value, pdfFamilyMember.value)
    await loadExpenses()
    
    // Reset
    selectedFile.value = null
    pdfFamilyMember.value = ''
    if (fileInput.value) fileInput.value.value = ''
  } catch (error) {
    console.error('Failed to upload PDF:', error)
  }
}

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.add-expense, .pdf-upload, .expenses-list {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin: 1rem 0;
}

.expense-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  align-items: end;
}

.upload-form {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.expense-item {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1rem;
  margin: 0.5rem 0;
}

.expense-info {
  display: grid;
  grid-template-columns: 80px 100px 1fr 120px 100px;
  gap: 1rem;
  align-items: center;
}

.amount {
  font-weight: bold;
  color: #e74c3c;
}

.category {
  background: #3498db;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  text-align: center;
}

input, select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background: #2980b9;
}

.btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}
</style>
