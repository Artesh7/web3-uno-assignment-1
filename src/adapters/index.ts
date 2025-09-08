import { UnoDeck } from "../domain/deck";
import { UnoRound } from "../domain/round";
import { DefaultRules, RulesConfig } from "../domain/rules";

export const adapters = {
  newDeck: () => UnoDeck.full(),
  startRound: (players: string[], cfg: RulesConfig = DefaultRules) =>
    UnoRound.start(players, undefined, cfg),
};
