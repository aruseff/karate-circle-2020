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

  loadedWorkouts: any[] = [{ label: labels.select_workout, value: null }];
  selectedWorkout: any;
  saveWorkoutInput: string = '';

  constructor(public workoutService: WorkoutService) {
  }

  ngOnInit() {
    this.refreshWorkoutModel();
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

  selectWorkout(event) {
    if (event.value) {
      this.wo = event.value;
      this.workoutService.calculateTotalTimeOfWorkout();
    }
  }


  saveWorkout() {
    //   if (!this.saveWorkoutInput || this.saveWorkoutInput.trim() == '') {
    //     this.messageService.add({ severity: 'error', summary: labels.save_workout, detail: labels.enter_valid_name });
    //     return;
    //   }
    //   if (this.workoutsFileService.checkIfFileExists(this.saveWorkoutInput.trim())) {
    //     this.messageService.add({ severity: 'error', summary: labels.save_workout, detail: labels.file_already_exists });
    //     return;
    //   }

    //   let workoutFile: WorkoutFile = {
    //     name: this.saveWorkoutInput.trim(),
    //     workout: this.workout
    //   };
    //   this.workoutsFileService.saveWorkout(this.saveWorkoutInput.trim(), workoutFile);
    //   this.loadWorkouts();
    //   this.saveWorkoutInput = '';
  }

  // loadWorkouts() {
  //   this.loadedWorkouts = [{ label: labels.select_workout, value: null }];
  //   let workoutsFromFileSystem = this.workoutsFileService.loadWorkoutsFromFilesystem();
  //   workoutsFromFileSystem.forEach(file => {
  //     let workoutFile: WorkoutFile = workoutFileJsonToModel(file);
  //     this.loadedWorkouts.push({ label: workoutFile.name, value: workoutFile.workout });
  //   });
  // }

  get wo(): Workout {
    return this.workoutService.workout;
  }

  set wo(workout: Workout) {
    this.workoutService.workout = workout;
  }

  trackByIndex = (index: number, obj: any): any => {
    return index;
  }
}
