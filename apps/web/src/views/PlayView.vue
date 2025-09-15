Set-Content -Path .\src\views\PlayView.vue -Value @'
<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "@/stores/game";
import PlayerHand from "@/components/PlayerHand.vue";

const store = useGameStore();
const canSayUno = computed(() => store.currentHand.length === 2);
</script>

<template>
  <main class="wrap">
    <header class="bar">
      <div>
        <div><strong>Tur:</strong> {{ store.currentPlayerId }}</div>
        <div><strong>Retning:</strong> {{ store.direction }}</div>
      </div>
      <div>
        <div><strong>Top:</strong> {{ store.topCardText }}</div>
        <div><strong>Aktiv farve:</strong> {{ store.activeColor ?? "—" }}</div>
      </div>
    </header>

    <section class="controls">
      <label v-if="canSayUno" class="uno">
        <input type="checkbox" v-model="store.unoIntent" /> Sig UNO ved spil
      </label>
      <button @click="store.drawOne">Træk</button>
      <button @click="store.endTurn">Afslut tur</button>
    </section>

    <h3>Din hånd</h3>
    <PlayerHand />
  </main>
</template>

<style scoped>
.wrap { max-width: 960px; margin: 24px auto; padding: 0 16px; }
.bar { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #ddd; margin-bottom:12px; }
.controls { display:flex; align-items:center; gap:12px; margin: 12px 0; }
.uno { display:flex; align-items:center; gap:6px; padding:6px 10px; border:1px dashed #999; border-radius:6px; }
</style>
'@
