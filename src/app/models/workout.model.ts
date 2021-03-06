import { WorkRelax } from './work-relax.model';

export interface Workout {
    roundsCount: number;
    basesCount: number[];
    lastSignalSelected: boolean[];
    lastSignalSeconds?: number[];
    workWarning: number,
    relaxWarning: number,
    lastRelax: boolean,
    useFirstRound: boolean,
    useFirstBase: boolean,
    delay: number;
    relaxes: number[];
    rounds: WorkRelax[][]
}
