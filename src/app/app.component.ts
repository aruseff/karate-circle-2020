import { Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Workout } from './models/workout.model';
import { Observable, timer, Subscription } from 'rxjs';
import { SoundsService } from './services/sounds.service';
import { WorkoutFile } from './models/workout-file.model';
import { workoutFileJsonToModel } from './util/model.mapper';
import { SoundsFileService } from './services/sounds.file.service';
import { SettingsService } from './services/settings.service';
import { checkIfFileExists, saveFile, loadWorkoutsFromFilesystem } from './util/files';
import { labels } from './util/labels';
declare const Buffer;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  doc: any = document;
  labels: any = labels;

  // Navigation
  activeTab: number = 0;

  // Workout config
  workout: Workout = {
    roundsCount: 3,
    basesCount: [
    ],
    lastSignalSelected: [true, true, true],
    workWarning: 5,
    relaxWarning: 3,
    lastRelax: true,
    useFirstRound: false,
    useFirstBase: false,
    delay: 10,
    relaxes: [
    ],
    rounds: [
    ]
  };

  loadedWorkouts: any[] = [{ label: labels.select_workout, value: null }];
  selectedWorkout: any;

  // Workout timer
  isWorkoutRunning: boolean = false;
  isWorkoutPaused: boolean = false;
  currentStatus: string = 'DELAY';

  // Fields
  wholeTime: number = 0;
  currentTime: number = 0;
  currentRound: number = 0;
  currentBase: number = 0;
  totalTimeOfWorkout: number = 0;
  elapsedTime: number = 0;
  remainingTime: number = 0;

  // Timer observables
  workoutCountdown: Observable<number> = timer(1000, 1000);

  // Subscriptions
  workoutSubscription: Subscription;

  // Save
  saveWorkoutInput: string = '';

  // Settings
  signals: any[] = [];
  selectedSignalType: number = 0;
  soundsFileNames: string[];
  selectedWorkoutIndex: number = 0;


  constructor(private messageService: MessageService,
    private soundsService: SoundsService,
    private soundsFileService: SoundsFileService,
    private settingsService: SettingsService) {

    this.populateSignalsArray();

    this.soundsFileNames = this.soundsFileService.getSoundsFiles();
  }

  ngOnInit(): void {
    this.refreshWorkoutModel();
    this.loadWorkouts();
  }

  basesInputChange(index: number) {
    if (this.workout.basesCount[index] > 50) {
      this.messageService.add({ severity: 'error', summary: 'Bases', detail: 'Please enter value between 1 and 50' });
    } else {
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
    this.calculateTotalTimeOfWorkout();
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
    this.calculateTotalTimeOfWorkout();
  }

  calculateTotalTimeOfWorkout() {
    this.totalTimeOfWorkout = 0;
    this.workout.rounds.forEach(workRelax => {
      if (this.workout.useFirstRound) {
        workRelax = this.workout.rounds[0];
      }
      workRelax.forEach((base, index) => {
        this.totalTimeOfWorkout += (this.workout.useFirstBase ? workRelax[0].workTime : base.workTime);
        if (index < workRelax.length - 1 || this.workout.lastRelax) {
          this.totalTimeOfWorkout += (this.workout.useFirstBase ? workRelax[0].relaxTime : base.relaxTime);
        }
      });
    });
    this.workout.relaxes.forEach(relax => {
      this.totalTimeOfWorkout += relax;
    });
    this.totalTimeOfWorkout += this.workout.delay;
    return this.totalTimeOfWorkout;
  }

  // Starting the workout
  startWorkout() {
    this.isWorkoutRunning = true;
    this.isWorkoutPaused = false;
    this.remainingTime = this.calculateTotalTimeOfWorkout();
    this.currentTime = this.workout.delay;
    this.wholeTime = this.currentTime;
    this.currentStatus = 'DELAY';

    this.workoutSubscription = this.workoutCountdown.subscribe(() => {
      this.processEachSecond();

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

  processEachSecond() {
    this.currentTime--;
    this.elapsedTime++;
    this.remainingTime--;

    if (this.currentStatus.toUpperCase() == 'DELAY' || this.currentStatus.toUpperCase() == 'ROUND_RELAXTIME'
      || this.currentStatus.toUpperCase() == 'RELAX_BETWEEN_ROUNDS') {

      // Countdown signal RELAX
      if (this.currentTime < this.workout.relaxWarning && this.currentTime > 0) {
        this.soundsService.playSound("relax_countdown");
      }

      // Last signals
      if (this.workout.lastSignalSelected[0] && this.currentTime == 20) {
        this.soundsService.playSound("relax_warning");
      }
      else if (this.workout.lastSignalSelected[1] && this.currentTime == 10) {
        this.soundsService.playSound("relax_warning");
      }
      else if (this.workout.lastSignalSelected[2] && this.currentTime == 5) {
        this.soundsService.playSound("relax_warning");
      }
    }
    else {

      // Countdown signal WORK
      if (this.currentTime < this.workout.workWarning && this.currentTime > 0) {
        this.soundsService.playSound("work_countdown");
      }

      // Last signals
      if (this.workout.lastSignalSelected[0] && this.currentTime == 20) {
        this.soundsService.playSound("work_warning");
      }
      else if (this.workout.lastSignalSelected[1] && this.currentTime == 10) {
        this.soundsService.playSound("work_warning");
      }
      else if (this.workout.lastSignalSelected[2] && this.currentTime == 5) {
        this.soundsService.playSound("work_warning");
      }
    }

    if (this.currentTime <= 0) {

      // Delay
      if (this.currentStatus.toUpperCase() == 'DELAY') {
        this.soundsService.playSound("start_work");
        this.currentRound = 0;
        this.currentBase = 0;
        this.currentTime = this.workout.rounds[this.currentRound][this.currentBase].workTime;
        this.wholeTime = this.currentTime;
        this.currentStatus = 'ROUND_WORKTIME';
      }

      // Round worktime
      else if (this.currentStatus.toUpperCase() == 'ROUND_WORKTIME') {

        let useRound = this.workout.useFirstRound ? 0 : this.currentRound;
        if (this.workout.rounds[useRound].length - 1 == this.currentBase && !this.workout.lastRelax) {

          if (this.currentRound == this.workout.roundsCount - 1) {// Check if last round :: Workout end
            this.soundsService.playSound("workout_end");
            this.workoutSubscription.unsubscribe();
            this.isWorkoutRunning = false;
            return;
          } else { // Not last round :: Round end
            this.soundsService.playSound("round_end");
            this.currentTime = this.workout.relaxes[this.currentRound];
            this.wholeTime = this.currentTime;
            this.currentStatus = 'RELAX_BETWEEN_ROUNDS';
          }
        } else {
          this.soundsService.playSound("stop_work");
          let useBase = this.workout.useFirstBase ? 0 : this.currentBase;
          this.currentTime = this.workout.rounds[useRound][useBase].relaxTime;
          this.wholeTime = this.currentTime;
          this.currentStatus = 'ROUND_RELAXTIME';
        }
      }

      // Round relaxtime
      else if (this.currentStatus.toUpperCase() == 'ROUND_RELAXTIME') {
        // Check if workout finished - last relax
        let useRound = this.workout.useFirstRound ? 0 : this.currentRound;
        if (this.currentRound == this.workout.roundsCount - 1 && this.workout.rounds[useRound].length - 1 == this.currentBase) {
          this.soundsService.playSound("workout_end");
          this.workoutSubscription.unsubscribe();
          this.isWorkoutRunning = false;
          return;
        }

        // Relax between rounds
        if (this.workout.rounds[useRound].length - 1 == this.currentBase) {
          this.soundsService.playSound("round_end");
          this.currentTime = this.workout.relaxes[this.currentRound];
          this.wholeTime = this.currentTime;
          this.currentStatus = 'RELAX_BETWEEN_ROUNDS';
        } else {
          // Next base
          this.soundsService.playSound("start_work");
          this.currentBase++;

          let useBase = this.workout.useFirstBase ? 0 : this.currentBase;
          let useRound = this.workout.useFirstRound ? 0 : this.currentRound;
          this.currentTime = this.workout.rounds[useRound][useBase].workTime;

          this.wholeTime = this.currentTime;
          this.currentStatus = 'ROUND_WORKTIME';
        }
      }

      else if (this.currentStatus.toUpperCase() == 'RELAX_BETWEEN_ROUNDS') {
        this.soundsService.playSound("start_work");
        this.currentRound++;
        this.currentBase = 0;

        let useBase = this.workout.useFirstBase ? 0 : this.currentBase;
        let useRound = this.workout.useFirstRound ? 0 : this.currentRound;
        this.currentTime = this.workout.rounds[useRound][useBase].workTime;

        this.wholeTime = this.currentTime;
        this.currentStatus = 'ROUND_WORKTIME';
      }
    }
  }

  calculateProgress() {
    if(this.totalTimeOfWorkout == 0) {
      return 0;
    }
    return this.elapsedTime * 100 / this.totalTimeOfWorkout;
  }

  resetWorkout() {
    this.isWorkoutRunning = false;
    this.isWorkoutPaused = false;
    this.wholeTime = 0;
    this.currentTime = 0;
    this.currentRound = 0;
    this.currentBase = 0;
    this.totalTimeOfWorkout = 0;
    this.elapsedTime = 0;
    this.remainingTime = 0;
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

  navigate(index: number) {
    this.activeTab = index;
  }

  // Sounds tab
  previewSound(index: number) {
    this.soundsFileService.play(index);
  }

  populateSignalsArray() {
    let settings = this.settingsService.getAll();
    this.signals = [];
    for (var prop in settings) {
      if (Object.prototype.hasOwnProperty.call(settings, prop)) {
        this.signals.push({ "id": prop, "label": labels[prop], "wav": settings[prop] });
      }
    }
  }

  uploadWavFile(files: any) {
    console.log(files.target.files);
    for (let i = 0; i < files.target.files.length; i++) {
      let fileReader = new FileReader();
      let file = files.target.files[i];
      fileReader.onload = (e) => {
        this.soundsFileService.saveSoundFile(Buffer.from(fileReader.result.toString().replace('data:audio/wav;base64,', ''), 'base64'), file.name);
        if (i == files.target.files.length - 1) {
          this.soundsFileNames = this.soundsFileService.getSoundsFiles();
        }
      };
      fileReader.readAsDataURL(file);
    }
  }

  saveSoundsSettings() {
    this.signals.forEach(signalType => {
      this.settingsService.set(signalType.id, signalType.wav);
    });
    this.soundsService.refreshSounds();
    this.messageService.add({ severity: 'info', summary: 'Sounds settings', detail: 'Succesfully saved' });
  }

  resetSoundsSettings() {
    this.populateSignalsArray();
    this.messageService.add({ severity: 'warn', summary: 'Sounds settings', detail: 'Succesfully reses to defaults' });
  }

  // Needed by the dynamically ngModels for bases and rounds 
  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
