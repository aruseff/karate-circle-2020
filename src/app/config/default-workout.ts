import { Workout } from "../models/workout.model";

export const DEFAULT_WORKOUT: Workout = {
  roundsCount: 3,
  basesCount: [
  ],
  lastSignalSelected: [true, true, true],
  lastSignalSeconds: [20, 10, 5],
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