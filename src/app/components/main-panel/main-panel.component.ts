import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { loadWorkoutsFromFilesystem, checkIfFileExists, saveFile } from 'src/app/util/files';
import { MessageService } from 'primeng/api';
import { Workout } from 'src/app/models/workout.model';
import { workoutFileJsonToModel } from 'src/app/util/model.mapper';
import { WorkoutFile } from 'src/app/models/workout-file.model';
import { Subscription, Observable, timer } from 'rxjs';
import { SoundsService } from 'src/app/services/sounds.service';

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

  // States
  isWorkoutRunning: boolean = false;
  isWorkoutPaused: boolean = false;
  isRelax: boolean = false;

  // Fields
  whole: number = 0;
  currentTime: number = 0;
  currentRound: number = 0;
  currentBase: number = 0;
  totalTimeOfWorkout: number = 0;
  prepareTime: number = 0;
  progress: number = 0;
  elapsedTime: number = 0;
  remainingTime: number = 0;
  showPrepareDialog: boolean = false;

  // Timer observables
  prepareCountdown: Observable<number> = timer(500, 1000);
  workoutCountdown: Observable<number> = timer(1000, 1000);

  // Subscriptions
  prepareSubscription: Subscription;
  workoutSubscription: Subscription;

  // Save
  saveWorkoutInput: string = '';

  constructor(private messageService: MessageService,
    private soundsService: SoundsService) { }

  ngOnInit(): void {
    this.refreshWorkoutModel();
    this.loadWorkouts();
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

  calculateTotalTimeOfWorkout() {
    this.totalTimeOfWorkout = 0;
    this.workout.rounds.forEach(workRelax => {
      workRelax.forEach(base => {
        this.totalTimeOfWorkout += base.workTime;
        this.totalTimeOfWorkout += base.relaxTime;
      });
    });
    this.workout.relaxes.forEach(relax => {
      this.totalTimeOfWorkout += relax;
    });
    return this.totalTimeOfWorkout;
  }

  // Starting the workout
  startWorkout() {
    this.isWorkoutPaused = false;
    this.remainingTime = this.calculateTotalTimeOfWorkout();
    this.prepareTime = this.workout.delay;

    this.prepareSubscription = this.prepareCountdown.subscribe(() => {

      this.showPrepareDialog = true;
      this.prepareTime--;

      if (this.prepareTime <= 4 && this.prepareTime > 0) {
        this.soundsService.playShortSound();
      }

      if (this.prepareTime <= 0) {
        this.soundsService.playLongSound();
        this.showPrepareDialog = false;
        this.startWorkoutTimer();
      }
    });
  }

  pauseWorkout() {
    this.isWorkoutRunning = false;
    this.isWorkoutPaused = true;
    this.workoutSubscription.unsubscribe();
  }

  resumeWorkout() {
    this.isWorkoutRunning = true;
    this.isWorkoutPaused = false;
    this.workoutSubscription = this.workoutCountdown.subscribe(() => {
      this.processEachSecond();
    });
  }

  resetWorkout() {
  }

  startWorkoutTimer() {
    this.currentRound = 0;
    this.currentBase = 0;
    this.isRelax = false;
    this.isWorkoutRunning = true;
    this.isWorkoutPaused = false;
    this.currentTime = this.workout.rounds[this.currentRound][this.currentBase].workTime;
    this.whole = this.currentTime;
    this.workoutSubscription = this.workoutCountdown.subscribe(() => {
      this.processEachSecond();
    });
  }

  processEachSecond() {

    this.calculateProgress();
    this.currentTime--;
    if (this.currentTime == 0) {
      this.soundsService.playLongSound();
    }
    if (this.currentTime <= 0) {
      if (this.isRelax) {

        // Check if workout finished
        if (this.currentRound == this.workout.roundsCount - 1 && this.workout.rounds[this.currentRound].length - 1 == this.currentBase) {
          this.workoutSubscription.unsubscribe();
          this.isWorkoutRunning = false;
          return;
        }

        // Check for relax between rounds
        if (this.workout.rounds[this.currentRound].length - 1 == this.currentBase) {
          this.processPrepare(this.workout.relaxes[this.currentRound]);
          this.currentRound++;
          this.currentBase = 0;
        } else {
          this.currentBase++;
        }


        this.currentTime = this.workout.rounds[this.currentRound][this.currentBase].workTime;
        this.whole = this.currentTime;

      } else {
        this.currentTime = this.workout.rounds[this.currentRound][this.currentBase].relaxTime;
      }
      this.isRelax = !this.isRelax;
    }
  }

  processPrepare(initialTime: number) {
    this.workoutSubscription.unsubscribe();
    this.prepareTime = initialTime;

    this.prepareSubscription = this.prepareCountdown.subscribe(() => {

      this.calculateProgress();
      this.showPrepareDialog = true;
      this.prepareTime--;

      if (this.prepareTime <= 4 && this.prepareTime > 0) {
        this.soundsService.playShortSound();
      }

      if (this.prepareTime <= 0) {
        this.soundsService.playLongSound();
        this.showPrepareDialog = false;
        this.resumeWorkout();
      }
    });
  }

  calculateProgress() {
    this.elapsedTime++;
    this.remainingTime--;
    this.progress = (this.elapsedTime / this.totalTimeOfWorkout) * 100;
  }

  prepareDialogOnHide() {
    this.prepareSubscription.unsubscribe();
  }

  relaxDialogOnHide() {
    this.prepareSubscription.unsubscribe();
    this.isWorkoutPaused = true;
    this.isWorkoutRunning = false;
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

  loadWorkouts() {
    let workoutsFromFileSystem = loadWorkoutsFromFilesystem();
    workoutsFromFileSystem.forEach(file => {
      let workoutFile: WorkoutFile = workoutFileJsonToModel(file);
      this.loadedWorkouts.push({ label: workoutFile.name, value: workoutFile.workout });
    });
  }

  // Needed by the dynamically ngModels for bases and rounds 
  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
