
import { defineStore } from "pinia";
import router from "@/router";
import type { RulesConfig } from "@core/domain/rules";
import { DefaultRules } from "@core/domain/rules";
import type { RoundMemento } from "@core/domain/round";
import { UnoRound } from "@core/domain/round";
import type { CardMemento, Color } from "@core/domain/cards";

export const useGameStore = defineStore("game", {
  state: () => ({
    players: [] as string[],
    rules: { ...DefaultRules } as RulesConfig,
    round: null as UnoRound | null,
    snap: null as RoundMemento | null,
    winner: null as string | null,
    unoIntent: false as boolean
  }),

  getters: {
    currentPlayerId: (s): string | undefined =>
      s.snap?.playerOrder[s.snap.activePlayerIndex],
    currentHand(): CardMemento[] {
      const p = this.currentPlayerId;
      if (!p || !this.snap) return [];
      return this.snap.hands[p]?.cards ?? [];
    },
    topCardText(): string {
      if (!this.round) return "";
      const c: any = this.round.topCard();
      if (c.kind === "Number") return `${c.color} ${c.value}`;
      if (c.kind === "Wild" || c.kind === "WildDrawFour") return c.kind;
      return `${c.color} ${c.kind}`;
    },
    activeColor(): Color | undefined {
      return this.snap?.currentColor;
    },
    direction(): "CW" | "CCW" | undefined {
      return this.snap?.direction;
    }
  },

  actions: {
    refresh() {
      if (this.round) this.snap = this.round.toMemento();
    },

    startGame(players: string[], rules: RulesConfig) {
      this.players = players;
      this.rules = rules;
      this.round = UnoRound.start(players, undefined, rules);
      this.winner = null;
      this.unoIntent = false;
      this.refresh();
      router.push({ name: "play" });
    },

    canPlayIndex(i: number): boolean {
      return !!this.round?.canPlay(i);
    },

    async playIndex(i: number, chooseColor?: Color) {
      if (!this.round) return;
      const willUno = this.unoIntent;
      try {
        // domænet ignorerer evt. ukendte options-keys, så declareUno er fremtidssikret
        this.round.play(i, { chooseColor, declareUno: willUno } as any);
        this.unoIntent = false;
      } catch (e) {
        console.warn(e);
      }
      this.refresh();
      if (this.round.isOver()) {
        this.winner = this.round.winnerId() ?? null;
        router.push({ name: "gameover" });
      }
    },

    drawOne() {
      if (!this.round) return;
      this.round.draw();
      this.refresh();
    },

    endTurn() {
      if (!this.round) return;
      // Kald endTurn() hvis den findes i din UnoRound (patch anbefalet).
      // Ellers gør ingenting (brugeren kan altid spille/trykke Træk).
      (this.round as any).endTurn?.();
      this.unoIntent = false;
      this.refresh();
    }
  }
});

