import { Workout } from "../models/workout.model";

export const DEFAULT_WORKOUT: Workout = {
  roundsCount: 3,
  basesCount: [
  ],
  lastSignalSelected: [true, true, true],
  lastSignalSeconds: [60, 30, 20],
  workWarning: 5,
  relaxWarning: 3,
  lastRelax: true,
  useFirstRound: false,
  useFirstBase: false,
  delay: 10,
  relaxes: [
  ],
  rounds: [
  ]
};