import { Component, Input } from '@angular/core';
import { labels } from 'src/app/config/labels';
import { Workout } from 'src/app/models/workout.model';
import { WorkoutService } from 'src/app/services/workout.service';

@Component({
  selector: 'app-workout-configuration-preview',
  templateUrl: './workout-configuration-preview.component.html',
  styleUrl: './workout-configuration-preview.component.scss'
})
export class WorkoutConfigurationPreviewComponent {

  @Input('workout') set wo(value: Workout) {
    this.workoutService.workout = value;
    this.refreshWorkoutModel();
  }

  get wo(): Workout {
    return this.workoutService.workout;
  }

  labels: any = labels;

  constructor(public workoutService: WorkoutService) { }

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
    this.workoutService.calculateTotalTimeOfWorkout();
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
    this.workoutService.calculateTotalTimeOfWorkout();
  }

  trackByIndex = (index: number, obj: any): any => {
    return index;
  }
}
