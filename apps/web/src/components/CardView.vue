<script setup lang="ts">
import type { CardMemento } from "@core/domain/cards";

// Hent alle PNG'er i mappen som URL'er (bundles af Vite)
const raw = import.meta.glob("@/assets/uno_cards/*.png", {
  eager: true,
  as: "url",
}) as Record<string, string>;

// Lav et map: filnavn -> url (robust mod forskellige path-prefixes)
const byName = new Map<string, string>();
for (const [p, url] of Object.entries(raw)) {
  const name = p.split("/").pop()!; // fx "blue_0.png"
  byName.set(name, url);
}

const props = defineProps<{ card: CardMemento; disabled?: boolean }>();
const emit = defineEmits<{ (e: "click"): void }>();

function fileName(c: CardMemento): string {
  const k = (c as any).kind as string;
  // Dine faktiske filnavne:
  // blue_0.png ... blue_9.png
  // blue_skip.png, blue_reverse.png, blue_draw_two.png
  // wild.png, wild_draw_four.png
  if (k === "Number") return `${(c as any).color.toLowerCase()}_${(c as any).value}.png`;
  if (k === "Skip") return `${(c as any).color.toLowerCase()}_skip.png`;
  if (k === "Reverse") return `${(c as any).color.toLowerCase()}_reverse.png`;
  if (k === "DrawTwo") return `${(c as any).color.toLowerCase()}_draw_two.png`;
  if (k === "Wild") return `wild.png`;
  if (k === "WildDrawFour") return `wild_draw_four.png`;
  return `wild.png`;
}

function srcFor(c: CardMemento) {
  const name = fileName(c);
  const url = byName.get(name);
  if (!url) {
    console.warn(`Mangler billede for: ${name}`);
    return byName.get("wild.png"); // fallback
  }
  return url;
}
</script>

<template>
  <button class="card-btn" :disabled="disabled" @click="emit('click')">
    <img class="card-img" :src="srcFor(card)" :alt="(card as any).kind" />
  </button>
</template>

<style scoped>
.card-btn {
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  margin: 6px;
  transition: transform 0.08s ease, filter 0.08s ease;
}
.card-btn:disabled {
  cursor: default;
  filter: grayscale(0.35) opacity(0.75);
}
.card-btn:not(:disabled):hover {
  transform: translateY(-2px);
}

.card-img {
  width: 86px;
  height: 128px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2), 0 6px 12px rgba(0, 0, 0, 0.25);
}
</style>
