export type RulesConfig = {
  twoPlayerReverseActsAsSkip: boolean; // officielt: true
  allowStacking: boolean;              // officielt: false
  drawUntilPlayable: boolean;          // officielt: false
  canPlayDrawnCardImmediately: boolean;// officielt: true
  wildDraw4ChallengeEnabled: boolean;  // officielt: true (kan droppes)
  unoPenaltyCards: 2 | 4;              // officiel: 2, opgave: 4
};

export const DefaultRules: RulesConfig = {
  twoPlayerReverseActsAsSkip: true,
  allowStacking: false,
  drawUntilPlayable: false,
  canPlayDrawnCardImmediately: true,
  wildDraw4ChallengeEnabled: true,
  unoPenaltyCards: 2
};
