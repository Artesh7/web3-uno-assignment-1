<script setup lang="ts">
import router from "@/router";
import { useGameStore } from "@/stores/game";
const store = useGameStore();
</script>

<template>
  <main class="wrap">
    <h1>Spillet er slut</h1>
    <p v-if="store.winner">Vinder: <strong>{{ store.winner }}</strong></p>
    <button @click="router.push({ name: 'setup' })">Tilbage til Setup</button>
  </main>
</template>

<style scoped>
.wrap { max-width: 760px; margin: 32px auto; padding: 0 16px; }
</style>
