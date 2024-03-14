import { Component } from '@angular/core';
import { DEFAULT_WORKOUT } from 'src/app/config/default-workout';
import { Workout } from 'src/app/models/workout.model';
import { WorkoutService } from 'src/app/services/workout.service';
import { labels } from 'src/app/config/labels';

@Component({
  selector: 'app-workout-configuration',
  templateUrl: './workout-configuration.component.html',
  styleUrl: './workout-configuration.component.scss'
})
export class WorkoutConfigurationComponent {

  labels: any = labels;
  defaultWorkout = DEFAULT_WORKOUT;

  constructor(public workoutService: WorkoutService) {
  }

  calculateTotalTimeOfWorkout() {
    this.workoutService.totalTimeOfWorkout = 0;
    this.wo.rounds.forEach(workRelax => {
      if (this.wo.useFirstRound) {
        workRelax = this.wo.rounds[0];
      }
      workRelax.forEach((base, index) => {
        this.workoutService.totalTimeOfWorkout += (this.wo.useFirstBase ? workRelax[0] : base).workTime;
        if (index < workRelax.length - 1 || this.wo.lastRelax) {
          this.workoutService.totalTimeOfWorkout += (this.wo.useFirstBase ? workRelax[0] : base).relaxTime;
        }
      });
    });
    this.wo.relaxes.forEach(relax => {
      this.workoutService.totalTimeOfWorkout += relax;
    });
    this.workoutService.totalTimeOfWorkout += this.wo.delay;
    return this.workoutService.totalTimeOfWorkout;
  }

  basesInputChange(index: number) {
    let oldCount = this.wo.rounds[index].length;
    let newCount = this.wo.basesCount[index];
    if (oldCount < newCount) {
      for (let i = 0; i < newCount - oldCount; i++) {
        this.wo.rounds[index].push({ workTime: 5, relaxTime: 5 });
      }
    } else {
      this.wo.rounds[index].length = newCount;
    }
    this.calculateTotalTimeOfWorkout();
  }

  refreshWorkoutModel() {
    let oldCount = this.wo.rounds.length;
    let newCount = this.wo.roundsCount;
    if (oldCount < newCount) {
      for (let i = 0; i < newCount - oldCount; i++) {
        this.wo.basesCount.push(1);
        this.wo.rounds.push([]);
      }
      for (let i = 0; i < newCount - (oldCount == 0 ? 1 : oldCount); i++) {
        this.wo.relaxes.push(10);
      }
    } else {
      this.wo.basesCount.length = newCount;
      this.wo.rounds.length = newCount;
      this.wo.relaxes.length = newCount - 1 > 0 ? newCount - 1 : 0
    }
    this.wo.rounds.forEach((element, index) => {
      this.basesInputChange(index);
    });
    this.calculateTotalTimeOfWorkout();
  }

  get wo(): Workout {
    return this.workoutService.workout;
  }

  trackByIndex = (index: number, obj: any): any => {
    return index;
  }
}
