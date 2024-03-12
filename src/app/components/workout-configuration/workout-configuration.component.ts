import { Component } from '@angular/core';
import { WorkoutService } from 'src/app/services/workout.service';
import { labels } from 'src/app/util/labels';

@Component({
  selector: 'app-workout-configuration',
  templateUrl: './workout-configuration.component.html',
  styleUrl: './workout-configuration.component.scss'
})
export class WorkoutConfigurationComponent {

  labels: any = labels;

  constructor(public workoutService: WorkoutService) { }

  calculateTotalTimeOfWorkout() {
    this.workoutService.totalTimeOfWorkout = 0;
    this.wo.rounds.forEach(workRelax => {
      if (this.wo.useFirstRound) {
        workRelax = this.wo.rounds[0];
      }
      workRelax.forEach((base, index) => {
        this.workoutService.totalTimeOfWorkout += (this.wo.useFirstBase ? workRelax[0].workTime : base.workTime);
        if (index < workRelax.length - 1 || this.wo.lastRelax) {
          this.workoutService.totalTimeOfWorkout += (this.wo.useFirstBase ? workRelax[0].relaxTime : base.relaxTime);
        }
      });
    });
    this.wo.relaxes.forEach(relax => {
      this.workoutService.totalTimeOfWorkout += relax;
    });
    this.workoutService.totalTimeOfWorkout += this.wo.delay;
    return this.workoutService.totalTimeOfWorkout;
  }

  get wo(): any {
    return this.workoutService.workout;
  }

}
