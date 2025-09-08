import { UnoDeck } from "./domain/deck";
import { UnoRound } from "./domain/round";
import { DefaultRules } from "./domain/rules";

const deck = UnoDeck.full();
const round = UnoRound.start(["Alice","Bob"], deck, { ...DefaultRules, unoPenaltyCards: 4 });

console.log("Current:", round.currentPlayerId());
console.log("Top:", round.topCard(), "ActiveColor:", round.currentColor());

const drawn = round.draw();
console.log("Drew:", drawn);
