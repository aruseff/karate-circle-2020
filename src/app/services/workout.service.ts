import { Injectable } from '@angular/core';
import { Workout } from '../models/workout.model';
import { DEFAULT_WORKOUT } from '../config/default-workout';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  public workout: Workout = JSON.parse(JSON.stringify(DEFAULT_WORKOUT));

  public isWorkoutRunning: boolean = false;
  public isWorkoutPaused: boolean = false;
  public totalTimeOfWorkout: number = 0;

  calculateTotalTimeOfWorkout() {
    this.totalTimeOfWorkout = 0;
    this.workout.rounds.forEach(workRelax => {
      if (this.workout.useFirstRound) {
        workRelax = this.workout.rounds[0];
      }
      workRelax.forEach((base, index) => {
        this.totalTimeOfWorkout += (this.workout.useFirstBase ? workRelax[0] : base).workTime;
        if (index < workRelax.length - 1 || this.workout.lastRelax) {
          this.totalTimeOfWorkout += (this.workout.useFirstBase ? workRelax[0] : base).relaxTime;
        }
      });
    });
    this.workout.relaxes.forEach(relax => {
      this.totalTimeOfWorkout += relax;
    });
    this.totalTimeOfWorkout += this.workout.delay;
    return this.totalTimeOfWorkout;
  }

}