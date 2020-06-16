import { WorkRelax } from './work-relax.model';

export interface Workout {
    roundsCount: number;
    basesCount: number[];
    lastSignalSelected: boolean[];
    delay: number;
    relaxes: number[];
    rounds: WorkRelax[][]
}
