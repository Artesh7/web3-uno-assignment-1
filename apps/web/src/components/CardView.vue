Set-Content -Path .\src\components\CardView.vue -Value @'
<script setup lang="ts">
import type { CardMemento } from "@core/domain/cards";

const props = defineProps<{ card: CardMemento; disabled?: boolean }>();
const emit = defineEmits<{ (e: "click"): void }>();

function bgForCard(c: CardMemento) {
  if ("color" in c) return c.color.toLowerCase();
  return "wild";
}
function label(c: CardMemento) {
  if (c.kind === "Number") return `${c.color} ${c.value}`;
  if (c.kind === "Wild" || c.kind === "WildDrawFour") return c.kind;
  return `${c.color} ${c.kind}`;
}
</script>

<template>
  <button
    class="card"
    :data-bg="bgForCard(card)"
    :disabled="disabled"
    @click="emit('click')"
  >
    <span>{{ label(card) }}</span>
  </button>
</template>

<style scoped>
.card {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  height: 120px;
  margin: 6px;
  border-radius: 10px;
  border: 2px solid #222;
  font-weight: 700;
  cursor: pointer;
}
.card[disabled] { opacity: 0.5; cursor: default; }
.card[data-bg="red"] { background: #ff4d4f; color: #fff; }
.card[data-bg="yellow"] { background: #fff566; color: #222; }
.card[data-bg="green"] { background: #95de64; color: #222; }
.card[data-bg="blue"] { background: #69c0ff; color: #222; }
.card[data-bg="wild"] { background: #111; color: #fff; }
</style>
'@
