import { Card, CardMemento, Color, toCardMemento } from "./cards";

export type DeckMemento = {
  drawPile: CardMemento[];
  discardPile: CardMemento[];
};

export interface Deck {
  draw(): Card | undefined;
  drawMany(n: number): Card[];
  discard(card: Card): void;
  topOfDiscard(): Card | undefined;
  cardsRemaining(): number;
  ensureStock(): void; // reshuffle når draw er tom
  toMemento(): DeckMemento;
}

export class UnoDeck implements Deck {
  private drawPile: Card[] = [];
  private discardPile: Card[] = [];

  static full(shuffle: (arr: Card[]) => void = shuffleInPlace): UnoDeck {
    const d = new UnoDeck();
    d.drawPile = buildFullUnoSet();
    shuffle(d.drawPile);
    return d;
  }

  draw(): Card | undefined {
    if (this.drawPile.length === 0) this.ensureStock();
    return this.drawPile.pop();
  }

  drawMany(n: number): Card[] {
    const out: Card[] = [];
    for (let i = 0; i < n; i++) {
      const c = this.draw();
      if (!c) break;
      out.push(c);
    }
    return out;
  }

  discard(card: Card): void {
    this.discardPile.push(card);
  }

  topOfDiscard(): Card | undefined {
    return this.discardPile[this.discardPile.length - 1];
  }

  cardsRemaining(): number {
    return this.drawPile.length;
  }

  ensureStock(): void {
    if (this.drawPile.length > 0) return;
    const top = this.discardPile.pop();
    if (!top) return;
    const buffer = this.discardPile.splice(0);
    shuffleInPlace(buffer);
    this.drawPile = buffer;
    this.discardPile.push(top);
  }

  toMemento(): DeckMemento {
    return {
      drawPile: this.drawPile.map(toCardMemento),
      discardPile: this.discardPile.map(toCardMemento),
    };
  }
}

// ---------- helpers ----------
function buildFullUnoSet(): Card[] {
  const colors: Color[] = ["Red", "Yellow", "Green", "Blue"];
  const cards: Card[] = [];

  for (const color of colors) {
    // 1×0
    cards.push({ kind: "Number", color, value: 0 });
    // 2×(1..9)
    for (let v = 1; v <= 9; v++) {
      cards.push({ kind: "Number", color, value: v as any });
      cards.push({ kind: "Number", color, value: v as any });
    }
    // 2× action
    (["Skip", "Reverse", "DrawTwo"] as const).forEach(k => {
      cards.push({ kind: k, color });
      cards.push({ kind: k, color });
    });
  }
  // 4×Wild, 4×Wild+4
  for (let i = 0; i < 4; i++) cards.push({ kind: "Wild" });
  for (let i = 0; i < 4; i++) cards.push({ kind: "WildDrawFour" });

  return cards;
}

function shuffleInPlace<T>(a: T[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}
