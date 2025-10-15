<template>
  <div class="planning">
    <h2>🎯 Purchase Planning</h2>
    
    <div class="add-plan">
      <h3>Create New Purchase Plan</h3>
      <form @submit.prevent="addPlan" class="plan-form">
        <input v-model="newPlan.name" placeholder="Purchase Name" required>
        <input v-model="newPlan.targetAmount" type="number" step="0.01" placeholder="Target Amount" required>
        <input v-model="newPlan.currentSaved" type="number" step="0.01" placeholder="Current Saved" value="0">
        <input v-model="newPlan.targetDate" type="date" required>
        <select v-model="newPlan.priority" required>
          <option value="">Select Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button type="submit" class="btn">Create Plan</button>
      </form>
    </div>

    <div class="plans-list">
      <h3>Active Purchase Plans</h3>
      <div class="plan-item" v-for="plan in plans" :key="plan.id">
        <div class="plan-header">
          <h4>{{ plan.name }}</h4>
          <span class="priority" :class="plan.priority">{{ plan.priority }}</span>
        </div>
        
        <div class="plan-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: getProgressPercentage(plan) + '%' }"></div>
          </div>
          <span class="progress-text">
            ${{ plan.currentSaved.toFixed(2) }} / ${{ plan.targetAmount.toFixed(2) }}
            ({{ getProgressPercentage(plan).toFixed(1) }}%)
          </span>
        </div>

        <div class="plan-details">
          <span>Target Date: {{ formatDate(plan.targetDate) }}</span>
          <span>Remaining: ${{ (plan.targetAmount - plan.currentSaved).toFixed(2) }}</span>
        </div>

        <div class="plan-actions">
          <input 
            v-model="progressAmounts[plan.id!]" 
            type="number" 
            step="0.01" 
            placeholder="Add amount"
            class="progress-input"
          >
          <button @click="updateProgress(plan.id!, progressAmounts[plan.id!])" class="btn btn-small">
            Add Progress
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { planningApi, type PurchasePlan } from '../services/api'

const plans = ref<PurchasePlan[]>([])
const progressAmounts = reactive<Record<string, number>>({})

const newPlan = ref<PurchasePlan>({
  name: '',
  targetAmount: 0,
  currentSaved: 0,
  targetDate: new Date(),
  priority: 'medium',
  status: 'active'
})

onMounted(() => {
  loadPlans()
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  newPlan.value.targetDate = tomorrow
})

const loadPlans = async () => {
  try {
    const response = await planningApi.getAll()
    plans.value = response.data.filter(p => p.status === 'active')
    
    // Initialize progress amounts
    plans.value.forEach(plan => {
      if (plan.id) {
        progressAmounts[plan.id] = 0
      }
    })
  } catch (error) {
    console.error('Failed to load plans:', error)
  }
}

const addPlan = async () => {
  try {
    await planningApi.create(newPlan.value)
    await loadPlans()
    
    // Reset form
    newPlan.value = {
      name: '',
      targetAmount: 0,
      currentSaved: 0,
      targetDate: new Date(),
      priority: 'medium',
      status: 'active'
    }
  } catch (error) {
    console.error('Failed to add plan:', error)
  }
}

const updateProgress = async (planId: string, amount: number) => {
  if (!amount || amount <= 0) return
  
  try {
    await planningApi.updateProgress(planId, amount)
    await loadPlans()
    progressAmounts[planId] = 0
  } catch (error) {
    console.error('Failed to update progress:', error)
  }
}

const getProgressPercentage = (plan: PurchasePlan) => {
  return Math.min((plan.currentSaved / plan.targetAmount) * 100, 100)
}

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.add-plan, .plans-list {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin: 1rem 0;
}

.plan-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  align-items: end;
}

.plan-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.plan-header h4 {
  margin: 0;
  color: #2c3e50;
}

.priority {
  padding: 0.2rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.priority.high {
  background: #e74c3c;
  color: white;
}

.priority.medium {
  background: #f39c12;
  color: white;
}

.priority.low {
  background: #95a5a6;
  color: white;
}

.plan-progress {
  margin: 1rem 0;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: #ecf0f1;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  transition: width 0.3s ease;
}

.progress-text {
  font-weight: bold;
  color: #2c3e50;
}

.plan-details {
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.plan-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.progress-input {
  flex: 1;
  max-width: 150px;
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

.btn-small {
  padding: 0.3rem 0.8rem;
  font-size: 0.9rem;
}
</style>
