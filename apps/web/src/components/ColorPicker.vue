Set-Content -Path .\src\components\ColorPicker.vue -Value @'
<script setup lang="ts">
import type { Color } from "@core/domain/cards";

const props = defineProps<{ show: boolean }>();
const emit = defineEmits<{ (e: "pick", color: Color): void; (e: "close"): void }>();
const colors: Color[] = ["Red", "Yellow", "Green", "Blue"];
</script>

<template>
  <div v-if="show" class="overlay" @click.self="emit('close')">
    <div class="dialog">
      <h3>Vælg farve</h3>
      <div class="row">
        <button v-for="c in colors" :key="c" class="chip" :data-c="c.toLowerCase()" @click="emit('pick', c)">{{ c }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; }
.dialog { background:#fff; padding:16px; border-radius:10px; min-width:260px; }
.row { display:flex; gap:8px; margin-top:12px; }
.chip { padding:8px 10px; border-radius:999px; border:1px solid #333; cursor:pointer; }
.chip[data-c="red"]{ background:#ffccc7; }
.chip[data-c="yellow"]{ background:#fff1b8; }
.chip[data-c="green"]{ background:#d9f7be; }
.chip[data-c="blue"]{ background:#bae7ff; }
</style>
'@
