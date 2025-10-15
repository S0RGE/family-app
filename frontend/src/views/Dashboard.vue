<template>
  <div class="dashboard">
    <h2>📊 Financial Dashboard</h2>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>💰 Total Savings</h3>
        <p class="amount">${{ totalSavings.toFixed(2) }}</p>
      </div>
      <div class="stat-card">
        <h3>💸 Monthly Expenses</h3>
        <p class="amount">${{ monthlyExpenses.toFixed(2) }}</p>
      </div>
      <div class="stat-card">
        <h3>🎯 Active Plans</h3>
        <p class="amount">{{ activePlans }}</p>
      </div>
    </div>

    <div class="recommendations" v-if="recommendations.length">
      <h3>🤖 AI Recommendations</h3>
      <div class="recommendation-list">
        <div v-for="rec in recommendations" :key="rec" class="recommendation">
          {{ rec }}
        </div>
      </div>
      <button @click="getRecommendations" class="btn">Refresh Recommendations</button>
    </div>

    <div class="chart-container" v-if="chartData">
      <h3>📈 Spending by Category</h3>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { savingsApi, planningApi, aiApi, expenseApi } from '../services/api'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const totalSavings = ref(0)
const monthlyExpenses = ref(0)
const activePlans = ref(0)
const recommendations = ref<string[]>([])
const chartData = ref(null)
const chartCanvas = ref<HTMLCanvasElement>()

onMounted(async () => {
  await loadDashboardData()
  await getRecommendations()
  await loadChart()
})

const loadDashboardData = async () => {
  try {
    const [savingsRes, plansRes, expensesRes] = await Promise.all([
      savingsApi.getTotal(),
      planningApi.getAll(),
      expenseApi.getAll()
    ])
    
    totalSavings.value = savingsRes.data.total
    activePlans.value = plansRes.data.filter(p => p.status === 'active').length
    
    const currentMonth = new Date().toISOString().slice(0, 7)
    monthlyExpenses.value = expensesRes.data
      .filter(e => new Date(e.date).toISOString().slice(0, 7) === currentMonth)
      .reduce((sum, e) => sum + e.amount, 0)
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
}

const getRecommendations = async () => {
  try {
    const response = await aiApi.getRecommendations()
    recommendations.value = response.data.recommendations || []
  } catch (error) {
    console.error('Failed to get recommendations:', error)
  }
}

const loadChart = async () => {
  try {
    const response = await aiApi.getAnalysis()
    const { categoryTotals } = response.data
    
    if (chartCanvas.value) {
      new Chart(chartCanvas.value, {
        type: 'doughnut',
        data: {
          labels: Object.keys(categoryTotals),
          datasets: [{
            data: Object.values(categoryTotals),
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })
    }
  } catch (error) {
    console.error('Failed to load chart:', error)
  }
}
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.amount {
  font-size: 2rem;
  font-weight: bold;
  color: #27ae60;
  margin: 0.5rem 0;
}

.recommendations {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin: 2rem 0;
}

.recommendation-list {
  margin: 1rem 0;
}

.recommendation {
  padding: 0.5rem;
  margin: 0.5rem 0;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #3498db;
}

.chart-container {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: 400px;
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
</style>
