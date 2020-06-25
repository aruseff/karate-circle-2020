import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { loadWorkoutsFromFilesystem, checkIfFileExists, saveFile } from 'src/app/util/files';
import { MessageService } from 'primeng/api';
import { Workout } from 'src/app/models/workout.model';
import { workoutFileJsonToModel } from 'src/app/util/model.mapper';
import { WorkoutFile } from 'src/app/models/workout-file.model';
import { TimerService } from 'src/app/services/timer.service';
import { filter, tap, switchMap, repeat, skipWhile } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
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

  workoutRunning: boolean = false;
  isWorkoutPaused: boolean = false;

  // Timer
  whole: number = 0;
  time: number = 0;
  round: number = 0;
  base: number = 0;
  total: number = 0;
  prepareTime = 0;
  showGetReadyDialog: boolean = false;
  prepareSubscription: Subscription;
  workoutSubscription: Subscription;

  currentRound: number = 0;
  currentBase: number = 0;

  // Save
  saveWorkoutInput: string = '';

  constructor(private messageService: MessageService,
    private timer: TimerService,
    private soundsService: SoundsService) { }

  ngOnInit(): void {
    this.refreshWorkoutModel();
    this.loadWorkouts();
  }

  selectWorkout(workout: Workout) {
    if (workout) {
      this.workout = workout;
    }
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

  startWorkout() {
    this.isWorkoutPaused = false;
    this.workoutRunning = true;

    this.prepareSubscription = this.timer.startTimer(this.workout.delay).subscribe(seconds => {
      
      this.prepareTime = seconds;
      this.showGetReadyDialog = true;

      if (seconds <= 4 && seconds > 0) {
        this.soundsService.playShortSound();
      }

      if (seconds <= 0) {
        this.soundsService.playLongSound();
        this.showGetReadyDialog = false;
        this.currentRound = 0;
        this.currentBase = 0;
        let repeats = this.calculateTotalBases();
        this.startWorkoutTimer(repeats, this.currentRound, this.currentBase);
      }
    });
  }

  pauseWorkout() {
    this.workoutRunning = false;
    this.isWorkoutPaused = true;
    this.workoutSubscription.unsubscribe();
  }

  resumeWorkout() {
    this.workoutRunning = true;
    this.isWorkoutPaused = false;
    // let repeats = this.calculateTotalBases();
    this.startWorkoutTimer(5, this.currentRound, this.currentBase);
  }

  resetWorkout() {
    // this.stopTimer();
  }

  startWorkoutTimer(repeats: number, currentRound: number, currentBase: number) {
    this.workoutSubscription = of(1).pipe(

      tap(() => {
        this.round = currentRound + 1;
        this.base = currentBase + 1;
      }),
      switchMap(() => {
        // let left = 
        return this.timer.startTimer(this.workout.rounds[currentRound][currentBase].workTime);
      }),
      tap(seconds => this.time = seconds),
      filter(seconds => seconds <= 0),

      switchMap(() => {
        return this.timer.startTimer(this.workout.rounds[currentRound][currentBase].relaxTime);
      }),
      tap(seconds => this.time = seconds),
      filter(seconds => seconds <= 0),

      tap(() => {
        if (this.workout.rounds[currentRound].length - 1 == currentBase) {
          currentRound++;
          currentBase = 0;
        } else {
          currentBase++;
        }
      }),

      skipWhile(() => currentBase != 0 || currentRound == 0),
      switchMap(() => {
        return this.timer.startTimer(this.workout.relaxes[currentRound - 1]);
      }),
      tap(seconds => {
        this.showGetReadyDialog = true;
        this.prepareTime = seconds;
      }),
      filter(seconds => seconds <= 0),
      tap(() => this.showGetReadyDialog = false),

      repeat(repeats)
    ).subscribe();
  }

  prepareDialogOnHide() {
    this.prepareSubscription.unsubscribe();
  }

  calculateTotalBases() {
    // let basesCount = 0;
    // for(let i=this.currentRound; i<this.workout.basesCount.length; i++) {
    //   basesCount += this.workout.basesCount[i];
    //   basesCount -= this.curr
    // }
    return this.workout.basesCount.reduce((b1, b2) => b1 + b2);
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
