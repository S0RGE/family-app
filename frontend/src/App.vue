<template>
  <div id="app">
    <nav class="navbar">
      <h1>💰 Family Money Monitor</h1>
      <div class="nav-links">
        <router-link to="/">Dashboard</router-link>
        <router-link to="/expenses">Expenses</router-link>
        <router-link to="/savings">Savings</router-link>
        <router-link to="/planning">Planning</router-link>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.navbar {
  background: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background: #34495e;
}

main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
