import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DEFAULT_WORKOUT } from 'src/app/config/default-workout';
import { Workout } from 'src/app/models/workout.model';
import { WorkoutService } from 'src/app/services/workout.service';
import { labels } from 'src/app/util/labels';

@Component({
  selector: 'app-workout-configuration',
  templateUrl: './workout-configuration.component.html',
  styleUrl: './workout-configuration.component.scss'
})
export class WorkoutConfigurationComponent {

  labels: any = labels;
  defaultWorkout = DEFAULT_WORKOUT;

  constructor(public workoutService: WorkoutService,
    private messageService: MessageService) {
  }

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

  basesInputChange(index: number) {
    // if (this.woForm.basesCount[index] > 50) {
    //   this.messageService.add({ severity: 'error', summary: labels.bases, detail: labels.warning_between_1_and_50 });
    // } else {
    //   let oldCount = this.woForm.rounds[index].length;
    //   let newCount = this.woForm.basesCount[index];
    //   if (oldCount < newCount) {
    //     for (let i = 0; i < newCount - oldCount; i++) {
    //       this.woForm.rounds[index].push({ workTime: 5, relaxTime: 5 });
    //     }
    //   } else {
    //     this.woForm.rounds[index].length = newCount;
    //   }
    // }
    // this.calculateTotalTimeOfWorkout();
  }


  refreshWorkoutModel() {
    // let oldCount = this.woForm.rounds.length;
    // let newCount = this.woForm.roundsCount;
    // if (oldCount < newCount) {
    //   for (let i = 0; i < newCount - oldCount; i++) {
    //     this.woForm.basesCount.push(1);
    //     this.woForm.rounds.push([]);
    //   }
    //   for (let i = 0; i < newCount - (oldCount == 0 ? 1 : oldCount); i++) {
    //     this.woForm.relaxes.push(10);
    //   }
    // } else {
    //   this.woForm.basesCount.length = newCount;
    //   this.woForm.rounds.length = newCount;
    //   this.woForm.relaxes.length = newCount - 1 > 0 ? newCount - 1 : 0
    // }
    // this.woForm.rounds.forEach((element, index) => {
    //   this.basesInputChange(index);
    // });
    // this.calculateTotalTimeOfWorkout();
  }

  get wo(): Workout {
    return this.workoutService.workout;
  }

}
