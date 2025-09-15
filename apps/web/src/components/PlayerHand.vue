Set-Content -Path .\src\components\PlayerHand.vue -Value @'
<script setup lang="ts">
import { computed, ref } from "vue";
import CardView from "@/components/CardView.vue";
import ColorPicker from "@/components/ColorPicker.vue";
import { useGameStore } from "@/stores/game";
import type { CardMemento, Color } from "@core/domain/cards";

const store = useGameStore();
const showColor = ref(false);
const pendingIndex = ref<number | null>(null);

const hand = computed<CardMemento[]>(() => store.currentHand);
const playable = computed<boolean[]>(() => hand.value.map((_, i) => store.canPlayIndex(i)));

function onCardClick(i: number) {
  const c = hand.value[i];
  if (!playable.value[i]) return;
  if (c.kind === "Wild" || c.kind === "WildDrawFour") {
    pendingIndex.value = i;
    showColor.value = true;
  } else {
    store.playIndex(i);
  }
}
function pickColor(color: Color) {
  if (pendingIndex.value == null) return;
  store.playIndex(pendingIndex.value, color);
  pendingIndex.value = null;
  showColor.value = false;
}
</script>

<template>
  <div class="hand">
    <CardView
      v-for="(c,i) in hand"
      :key="i"
      :card="c"
      :disabled="!playable[i]"
      @click="onCardClick(i)"
    />
  </div>
  <ColorPicker :show="showColor" @pick="pickColor" @close="showColor=false" />
</template>

<style scoped>
.hand { display:flex; flex-wrap:wrap; }
</style>
'@
