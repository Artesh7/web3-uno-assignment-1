Set-Content -Path .\src\views\SetupView.vue -Value @'
<script setup lang="ts">
import { reactive } from "vue";
import { useGameStore } from "@/stores/game";
import type { RulesConfig } from "@core/domain/rules";
import { DefaultRules } from "@core/domain/rules";

const store = useGameStore();

const model = reactive({
  count: 2,
  names: ["Spiller 1", "Spiller 2", "Spiller 3", "Spiller 4"] as string[],
  rules: { ...DefaultRules } as RulesConfig
});

function start() {
  const players = model.names.slice(0, model.count).map(n => n.trim()).filter(Boolean);
  if (players.length < 2) return;
  store.startGame(players, model.rules);
}
</script>

<template>
  <main class="wrap">
    <h1>UNO – Setup</h1>

    <section>
      <label>Spillere: {{ model.count }}</label>
      <input type="range" min="2" max="4" v-model.number="model.count" />
      <div class="grid">
        <div v-for="i in model.count" :key="i">
          <input v-model="model.names[i-1]" />
        </div>
      </div>
    </section>

    <section>
      <h3>Regler</h3>
      <label><input type="checkbox" v-model="model.rules.twoPlayerReverseActsAsSkip" /> 2-spiller Reverse fungerer som Skip</label>
      <label><input type="checkbox" v-model="model.rules.allowStacking" /> Tillad stacking (husregel)</label>
      <label><input type="checkbox" v-model="model.rules.drawUntilPlayable" /> Træk indtil spilbart (husregel)</label>
      <label><input type="checkbox" v-model="model.rules.canPlayDrawnCardImmediately" /> Må spille trukket kort med det samme</label>
      <label><input type="checkbox" v-model="model.rules.wildDraw4ChallengeEnabled" /> Håndhæv Wild+4-challenge</label>
      <label>
        UNO-straf
        <select v-model.number="(model.rules.unoPenaltyCards as number)">
          <option :value="2">2</option>
          <option :value="4">4</option>
        </select>
      </label>
    </section>

    <button class="primary" @click="start">Start</button>
  </main>
</template>

<style scoped>
.wrap { max-width: 760px; margin: 32px auto; padding: 0 16px; }
.grid { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }
input[type="text"], input:not([type]) { width:100%; padding:8px; }
section { margin: 16px 0; display:flex; flex-direction:column; gap:8px; }
.primary { padding:10px 14px; font-weight:600; }
label { display:flex; align-items:center; gap:8px; }
</style>
'@
