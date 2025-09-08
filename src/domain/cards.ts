export type Color = "Red" | "Yellow" | "Green" | "Blue";
export type Direction = "CW" | "CCW";

export type CardKind =
  | "Number"
  | "Skip"
  | "Reverse"
  | "DrawTwo"
  | "Wild"
  | "WildDrawFour";

export type NumberValue = 0|1|2|3|4|5|6|7|8|9;

export type NumberCard = { kind: "Number"; color: Color; value: NumberValue };
export type ActionCard = { kind: "Skip" | "Reverse" | "DrawTwo"; color: Color };
export type WildCard = { kind: "Wild" | "WildDrawFour"; chosenColor?: Color };

export type Card = NumberCard | ActionCard | WildCard;

// Utility: få kun kort af en given type
export type TypedCard<K extends CardKind> = Extract<Card, { kind: K }>;

export const isWild = (c: Card): c is WildCard =>
  c.kind === "Wild" || c.kind === "WildDrawFour";

// Må card spilles på top givet aktiv farve?
export function canPlayOn(card: Card, top: Card, activeColor?: Color): boolean {
  // Wild er altid lovligt (Wild+4 tjekkes særskilt i Round)
  if (card.kind === "Wild" || card.kind === "WildDrawFour") return true;

  // Farvematch (hvis top var Wild -> brug valgt farve)
  const colorToMatch = isWild(top) ? activeColor : ("color" in top ? top.color : undefined);
  if ("color" in card && colorToMatch && card.color === colorToMatch) return true;

  // Type/nummer-match
  if (card.kind === "Number" && top.kind === "Number" && card.value === top.value) return true;
  if (card.kind !== "Number" && top.kind === card.kind) return true;

  return false;
}

/** JSON-venlige mementos (uden metoder) */
export type CardMemento =
  | { kind: "Number"; color: Color; value: NumberValue }
  | { kind: "Skip" | "Reverse" | "DrawTwo"; color: Color }
  | { kind: "Wild" | "WildDrawFour"; chosenColor?: Color };

export function toCardMemento(c: Card): CardMemento {
  return { ...c } as CardMemento;
}

export function fromCardMemento(m: CardMemento): Card {
  return { ...m } as Card;
}
export type Type = CardKind;


