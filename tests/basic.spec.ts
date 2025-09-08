import { UnoDeck } from "../src/domain/deck";
import { adapters } from "../src/adapters";
import { DefaultRules } from "../src/domain/rules";

describe("UNO must-have basics", () => {
  test("Full UNO deck has 108 cards", () => {
    const d = UnoDeck.full();
    let count = 0;
    while (d.draw()) count++;
    expect(count).toBe(108);
  });

  test("A round can start with 2 players and has a top card", () => {
    const round = adapters.startRound(["A", "B"], DefaultRules);
    expect(["A", "B"]).toContain(round.currentPlayerId());
    expect(round.topCard()).toBeDefined();
  });
});
