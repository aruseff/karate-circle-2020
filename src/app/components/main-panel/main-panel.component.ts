import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { loadWorkoutsFromFilesystem, checkIfFileExists, saveFile } from 'src/app/util/files';
import { MessageService } from 'primeng/api';
import { WorkRelax } from 'src/app/models/work-relax.model';
import { Workout } from 'src/app/models/workout.model';
import { workoutFileJsonToModel } from 'src/app/util/model.mapper';
import { WorkoutFile } from 'src/app/models/workout-file.model';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainPanelComponent implements OnInit {

  workout: Workout = {
    roundsCount: 3,
    basesCount: [
    ],
    lastSignalSelected: [true, true, true],
    delay: 10,
    relaxes: [
    ],
    rounds: [
    ]
  };

  lastSignalOptions: any[] = [
    { label: "Last 20[s]", value: "last20" },
    { label: "Last 10[s]", value: "last10" },
    { label: "Last 5[s]", value: "last5" }];

  loadedWorkouts: any[] = [{ label: 'Select workout', value: null }];
  selectedWorkout: any;

  whole: number = 120;
  time: number = 120;
  round: number = 0;
  base: number = 0;
  total: number = 0;

  saveWorkoutInput: string = '';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.refreshWorkoutModel();
    this.loadWorkouts();
  }

  loadWorkouts() {
    let workoutsFromFileSystem = loadWorkoutsFromFilesystem();
    workoutsFromFileSystem.forEach(file => {
      let workoutFile: WorkoutFile = workoutFileJsonToModel(file);
      this.loadedWorkouts.push({ label: workoutFile.name, value: workoutFile.workout });
    });
  }

  selectWorkout(workout: Workout) {
    if (workout) {
      this.workout = workout;
    }
  }

  roundsInputChange() {
    this.refreshWorkoutModel();
  }

  basesInputChange(index: number) {
    let oldCount = this.workout.rounds[index].length;
    let newCount = this.workout.basesCount[index];
    if (oldCount < newCount) {
      for (let i = 0; i < newCount - oldCount; i++) {
        this.workout.rounds[index].push({ workTime: 5, relaxTime: 5 });
      }
    } else {
      this.workout.rounds[index].length = newCount;
    }
  }

  refreshWorkoutModel() {
    let oldCount = this.workout.rounds.length;
    let newCount = this.workout.roundsCount;
    if (oldCount < newCount) {
      for (let i = 0; i < newCount - oldCount; i++) {
        this.workout.basesCount.push(1);
        this.workout.rounds.push([]);
      }
      for (let i = 0; i < newCount - (oldCount == 0 ? 1 : oldCount); i++) {
        this.workout.relaxes.push(10);
      }
    } else {
      this.workout.basesCount.length = newCount;
      this.workout.rounds.length = newCount;
      this.workout.relaxes.length = newCount - 1 > 0 ? newCount - 1 : 0
    }

    this.workout.rounds.forEach((element, index) => {
      this.basesInputChange(index);
    });
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  startWorkout() {
    
  }

  resetWorkout() {

  }

  saveWorkout() {
    if (!this.saveWorkoutInput || this.saveWorkoutInput.trim() == '') {
      this.messageService.add({ severity: 'error', summary: 'Save workout', detail: 'Please enter valid name' });
      return;
    }
    if (checkIfFileExists(this.saveWorkoutInput.trim())) {
      this.messageService.add({ severity: 'error', summary: 'Save workout', detail: 'File with such name already exists' });
      return;
    }

    let workoutFile: WorkoutFile = {
      name: this.saveWorkoutInput.trim(),
      workout: this.workout
    };
    saveFile(this.saveWorkoutInput.trim(), workoutFile);
    this.messageService.add({ severity: 'success', summary: 'Save workout', detail: 'Successfully saved' });
  }
}
