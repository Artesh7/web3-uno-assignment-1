import { Card, canPlayOn, CardMemento, toCardMemento, Color } from "./cards";

export type HandMemento = { cards: CardMemento[] };

export interface Hand {
  size(): number;
  cards(): ReadonlyArray<Card>;
  add(card: Card): void;
  removeAt(index: number): Card;
  playableAgainst(top: Card, currentColor?: Color): number[]; // indices
  toMemento(): HandMemento;
}

export class PlayerHand implements Hand {
  private _cards: Card[] = [];

  size() { return this._cards.length; }
  cards() { return this._cards; }
  add(c: Card) { this._cards.push(c); }

  removeAt(index: number): Card {
    if (index < 0 || index >= this._cards.length) throw new Error("bad index");
    return this._cards.splice(index, 1)[0];
  }

  playableAgainst(top: Card, currentColor?: Color): number[] {
    return this._cards
      .map((c, i) => ({ c, i }))
      .filter(({ c }) => canPlayOn(c, top, currentColor))
      .map(({ i }) => i);
  }

  toMemento(): HandMemento {
    return { cards: this._cards.map(toCardMemento) };
  }
}
