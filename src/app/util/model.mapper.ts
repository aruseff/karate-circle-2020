import { WorkoutFile } from '../models/workout-file.model';

export function workoutFileJsonToModel(json: string): WorkoutFile {
    let object = JSON.parse(json);
    return {
        name: object.name,
        workout: object.workout
    };
}
