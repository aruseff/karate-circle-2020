import { Injectable, OnInit } from '@angular/core';
import { Workout } from '../models/workout.model';
import { DEFAULT_WORKOUT } from '../config/default-workout';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  public workout: Workout = JSON.parse(JSON.stringify(DEFAULT_WORKOUT));

  private isWorkoutRunning: boolean = true;
  private isWorkoutPaused: boolean = false;

  // TODO
  totalTimeOfWorkout: number = 0;

  constructor() {
  }
}