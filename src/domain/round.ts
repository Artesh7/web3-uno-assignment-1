import { Card, isWild, Color } from "./cards";
import { PlayerHand, HandMemento } from "./hand";
import { Deck, UnoDeck, DeckMemento } from "./deck";
import { DefaultRules, RulesConfig } from "./rules";

export type RoundMemento = {
  playerOrder: string[];
  activePlayerIndex: number;
  direction: "CW" | "CCW";
  deck: DeckMemento;
  hands: Record<string, HandMemento>;
  currentColor?: Color;
  pendingDraw: number;
};

export interface Round {
  currentPlayerId(): string;
  currentColor(): Color | undefined;
  topCard(): Card;
  canPlay(indexInHand: number): boolean;
  play(indexInHand: number, options?: { chooseColor?: Color; declareUno?: boolean }): void;
  draw(): Card | undefined;
  isOver(): boolean;
  winnerId(): string | undefined;
  toMemento(): RoundMemento;
}

type PlayerState = { id: string; hand: PlayerHand };

export class UnoRound implements Round {
  private readonly cfg: RulesConfig;
  private readonly players: PlayerState[];
  private activeIndex = 0;
  private dir: "CW" | "CCW" = "CW";
  private deck: Deck;
  private _currentColor?: Color;
  private pendingDraw = 0;

  static start(playerIds: string[], deck?: Deck, cfg: RulesConfig = DefaultRules): UnoRound {
    if (playerIds.length < 2) throw new Error("Need 2+ players");
    const r = new UnoRound(playerIds, deck ?? UnoDeck.full(), cfg);
    r.deal();
    r.startDiscard();
    return r;
  }

  private constructor(playerIds: string[], deck: Deck, cfg: RulesConfig) {
    this.cfg = cfg;
    this.players = playerIds.map((id) => ({ id, hand: new PlayerHand() }));
    this.deck = deck;
  }

  private deal() {
    for (let i = 0; i < 7; i++) {
      for (const p of this.players) p.hand.add(this.deck.draw()!);
    }
  }

  private startDiscard() {
    let first = this.deck.draw()!;
    // Wild+4 må ikke starte
    while (first.kind === "WildDrawFour") {
      this.deck.discard(first);
      first = this.deck.draw()!;
    }
    this.deck.discard(first);

    if (first.kind === "Wild") {
      this._currentColor = undefined; // vælges af første spiller via farvet kort eller Wild-valg
    } else if ("color" in first) {
      this._currentColor = first.color;
    }

    // startkort-effekt
    if (first.kind === "Skip") this.advanceTurn();
    if (first.kind === "Reverse") {
      this.flipDirection();
      if (this.players.length === 2 && this.cfg.twoPlayerReverseActsAsSkip) this.advanceTurn();
    }
    if (first.kind === "DrawTwo") {
      this.pendingDraw += 2;
      this.applyPendingDrawAndSkip();
    }
  }

  currentPlayerId() {
    return this.players[this.activeIndex].id;
  }
  currentColor() {
    return this._currentColor;
  }
  topCard() {
    return this.deck.topOfDiscard()!;
  }

  private hasCardInActiveColor(p: PlayerState): boolean {
    const activeColor =
      this._currentColor ?? (!isWild(this.topCard()) ? (this.topCard() as any).color : undefined);
    if (!activeColor) return false;
    return p.hand.cards().some((c) => "color" in c && c.color === activeColor);
  }

  canPlay(indexInHand: number): boolean {
    const p = this.players[this.activeIndex];
    const card = p.hand.cards()[indexInHand];
    if (!card) return false;

    // Wild+4 må kun spilles hvis man ikke har kort i aktiv farve (når challenge-reglen er slået til)
    if (card.kind === "WildDrawFour" && this.cfg.wildDraw4ChallengeEnabled) {
      return !this.hasCardInActiveColor(p);
    }

    // Ellers: brug håndens playableAgainst (Wild er altid lovligt der)
    const playableIdx = p.hand.playableAgainst(this.topCard(), this._currentColor);
    return playableIdx.includes(indexInHand) || card.kind === "Wild";
  }

  play(indexInHand: number, options?: { chooseColor?: Color; declareUno?: boolean }): void {
    const p = this.players[this.activeIndex];

    if (!this.canPlay(indexInHand)) throw new Error("Illegal play");

    const card = p.hand.removeAt(indexInHand);
    this.deck.discard(card);

    // Sæt aktiv farve
    if (card.kind === "Wild" || card.kind === "WildDrawFour") {
      if (!options?.chooseColor) throw new Error("Choose a color for Wild");
      this._currentColor = options.chooseColor;
    } else if ("color" in card) {
      this._currentColor = card.color;
    }

    // Effekter
    switch (card.kind) {
      case "Skip":
        this.advanceTurn();
        break;
      case "Reverse":
        this.flipDirection();
        if (this.players.length === 2 && this.cfg.twoPlayerReverseActsAsSkip) this.advanceTurn();
        break;
      case "DrawTwo":
        this.pendingDraw += 2;
        this.applyPendingDrawAndSkip();
        break;
      case "WildDrawFour":
        this.pendingDraw += 4;
        this.applyPendingDrawAndSkip();
        break;
    }

    // --- UNO-regel ---
    // Hvis spilleren står tilbage med 1 kort og IKKE har erklæret UNO,
    // gives straf med det samme (cfg.unoPenaltyCards)
    if (p.hand.size() === 1) {
      if (!options?.declareUno) {
        this.deck.drawMany(this.cfg.unoPenaltyCards).forEach((c) => p.hand.add(c));
      }
    }

    // Vandt spilleren runden?
    if (p.hand.size() === 0) return;

    // Normal turfremskridt (hvis ikke allerede sket via effekter)
    if (!["Skip", "Reverse", "DrawTwo", "WildDrawFour"].includes(card.kind)) {
      this.advanceTurn();
    }
  }

  draw(): Card | undefined {
    if (this.pendingDraw > 0) return undefined; // straf håndteres i applyPending...

    const p = this.players[this.activeIndex];
    const c = this.deck.draw();
    if (c) p.hand.add(c);

    if (!this.cfg.canPlayDrawnCardImmediately) {
      this.advanceTurn();
    }
    return c;
  }

  isOver(): boolean {
    return this.players.some((p) => p.hand.size() === 0);
  }

  winnerId(): string | undefined {
    const w = this.players.find((p) => p.hand.size() === 0);
    return w?.id;
  }

  toMemento(): RoundMemento {
    return {
      playerOrder: this.players.map((p) => p.id),
      activePlayerIndex: this.activeIndex,
      direction: this.dir,
      deck: this.deck.toMemento(),
      hands: Object.fromEntries(this.players.map((p) => [p.id, p.hand.toMemento()])),
      currentColor: this._currentColor,
      pendingDraw: this.pendingDraw,
    };
  }

  // ----- helpers -----
  private advanceTurn() {
    const step = this.dir === "CW" ? 1 : -1;
    const n = this.players.length;
    this.activeIndex = (this.activeIndex + n + step) % n;
  }

  private flipDirection() {
    this.dir = this.dir === "CW" ? "CCW" : "CW";
  }

  private applyPendingDrawAndSkip() {
    // Næste spiller trækker pending og mister turen
    this.advanceTurn();
    const victim = this.players[this.activeIndex];
    this.deck.drawMany(this.pendingDraw).forEach((c) => victim.hand.add(c));
    this.pendingDraw = 0;
    this.advanceTurn();
  }




  
}
