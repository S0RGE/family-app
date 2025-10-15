import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Expenses from '../views/Expenses.vue'
import Savings from '../views/Savings.vue'
import Planning from '../views/Planning.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/expenses', component: Expenses },
  { path: '/savings', component: Savings },
  { path: '/planning', component: Planning }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
