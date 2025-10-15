<template>
  <div class="savings">
    <h2>💰 Savings Tracker</h2>
    
    <div class="savings-summary">
      <div class="total-savings">
        <h3>Total Savings</h3>
        <p class="amount">${{ totalSavings.toFixed(2) }}</p>
      </div>
    </div>

    <div class="add-savings">
      <h3>Add Savings</h3>
      <form @submit.prevent="addSavings" class="savings-form">
        <input v-model="newSaving.amount" type="number" step="0.01" placeholder="Amount" required>
        <select v-model="newSaving.source" required>
          <option value="">Select Source</option>
          <option value="Salary">Salary</option>
          <option value="Bonus">Bonus</option>
          <option value="Gift">Gift</option>
          <option value="Investment">Investment</option>
          <option value="Other">Other</option>
        </select>
        <input v-model="newSaving.description" placeholder="Description" required>
        <input v-model="newSaving.date" type="date" required>
        <button type="submit" class="btn">Add Savings</button>
      </form>
    </div>

    <div class="savings-list">
      <h3>Savings History</h3>
      <div class="saving-item" v-for="saving in savings" :key="saving.id">
        <div class="saving-info">
          <span class="amount">+${{ saving.amount.toFixed(2) }}</span>
          <span class="source">{{ saving.source }}</span>
          <span class="description">{{ saving.description }}</span>
          <span class="date">{{ formatDate(saving.date) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { savingsApi, type Saving } from '../services/api'

const savings = ref<Saving[]>([])
const totalSavings = ref(0)

const newSaving = ref<Saving>({
  amount: 0,
  source: '',
  description: '',
  date: new Date()
})

onMounted(() => {
  loadSavings()
  loadTotal()
  newSaving.value.date = new Date()
})

const loadSavings = async () => {
  try {
    const response = await savingsApi.getAll()
    savings.value = response.data
  } catch (error) {
    console.error('Failed to load savings:', error)
  }
}

const loadTotal = async () => {
  try {
    const response = await savingsApi.getTotal()
    totalSavings.value = response.data.total
  } catch (error) {
    console.error('Failed to load total:', error)
  }
}

const addSavings = async () => {
  try {
    await savingsApi.create(newSaving.value)
    await loadSavings()
    await loadTotal()
    
    // Reset form
    newSaving.value = {
      amount: 0,
      source: '',
      description: '',
      date: new Date()
    }
  } catch (error) {
    console.error('Failed to add savings:', error)
  }
}

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.savings-summary {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  margin: 1rem 0;
}

.total-savings .amount {
  font-size: 3rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.add-savings, .savings-list {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin: 1rem 0;
}

.savings-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  align-items: end;
}

.saving-item {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1rem;
  margin: 0.5rem 0;
  border-left: 4px solid #27ae60;
}

.saving-info {
  display: grid;
  grid-template-columns: 100px 100px 1fr 100px;
  gap: 1rem;
  align-items: center;
}

.amount {
  font-weight: bold;
  color: #27ae60;
}

.source {
  background: #27ae60;
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
  background: #27ae60;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background: #229954;
}
</style>
