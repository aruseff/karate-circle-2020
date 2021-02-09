import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Workout } from './models/workout.model';
import { Observable, timer, Subscription } from 'rxjs';
import { SoundsService } from './services/sounds.service';
import { WorkoutFile } from './models/workout-file.model';
import { workoutFileJsonToModel } from './util/model.mapper';
import { SoundsFileService } from './services/sounds.file.service';
import { SettingsService } from './services/settings.service';
import { labels } from './util/labels';
import { WorkoutFileService } from './services/workout.file.service';
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
  versionInfo: any = {
    version: "1.1.0",
    date: "02/02/2021",
    os: "Windows 32-bit (Portable)"
  }

  // Navigation
  activeTab: number = 0;

  // ------------------------------ Workout configuration begin ------------------------------
  workout: Workout = {
    roundsCount: 3,
    basesCount: [
    ],
    lastSignalSelected: [true, true, true],
    lastSignalSeconds: [20, 10, 5],
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

  // Save/load workouts
  loadedWorkouts: any[] = [{ label: labels.select_workout, value: null }];
  selectedWorkout: any;
  saveWorkoutInput: string = '';

  // ------------------------------ Workout configuration end ------------------------------

  // ------------------------------    Workout timer begin    ------------------------------
  isWorkoutRunning: boolean = false;
  isWorkoutPaused: boolean = false;
  currentStatus: string = 'DELAY';

  // Fields
  currentWholeTime: number = 0;
  currentTime: number = 0;
  currentRound: number = 0;
  currentBase: number = 0;
  totalTimeOfWorkout: number = 0;
  elapsedTime: number = 0;
  remainingTime: number = 0;

  // Timer observables
  workoutCountdown: Observable<number> = timer(1000, 1000);
  workoutSubscription: Subscription;

  // Key Listeners
  KEY_CODE = {
    SPACE: 32,
    ESC: 27
  }

  // ------------------------------     Workout timer end     ------------------------------

  // ------------------------------  Workout settings begin   ------------------------------
  signals: any[] = [];
  selectedSignalType: number = 0;
  soundsFileNames: string[];
  selectedWorkoutIndex: number = 0;
  // ------------------------------    Workout settings end   ------------------------------


  constructor(
    private messageService: MessageService,
    private soundsService: SoundsService,
    private workoutsFileService: WorkoutFileService,
    private soundsFileService: SoundsFileService,
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    this.populateSignalsArray();
    this.soundsFileNames = this.soundsFileService.getSoundsFiles();
    this.loadWorkouts();

    this.refreshWorkoutModel();
  }

  navigate(index: number) {
    this.activeTab = index;
  }

  // Needed by the dynamically ngModels for bases and rounds 
  trackByIndex(index: number, obj: any): any {
    return index;
  }

  // ------------------------------ Workout configuration begin ------------------------------
  basesInputChange(index: number) {
    if (this.workout.basesCount[index] > 50) {
      this.messageService.add({ severity: 'error', summary: labels.bases, detail: labels.warning_between_1_and_50 });
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

  saveWorkout() {
    if (!this.saveWorkoutInput || this.saveWorkoutInput.trim() == '') {
      this.messageService.add({ severity: 'error', summary: labels.save_workout, detail: labels.enter_valid_name });
      return;
    }
    if (this.workoutsFileService.checkIfFileExists(this.saveWorkoutInput.trim())) {
      this.messageService.add({ severity: 'error', summary: labels.save_workout, detail: labels.file_already_exists });
      return;
    }

    let workoutFile: WorkoutFile = {
      name: this.saveWorkoutInput.trim(),
      workout: this.workout
    };
    this.workoutsFileService.saveWorkout(this.saveWorkoutInput.trim(), workoutFile);
    this.loadWorkouts();
    this.saveWorkoutInput = '';
  }

  loadWorkouts() {
    this.loadedWorkouts = [{ label: labels.select_workout, value: null }];
    let workoutsFromFileSystem = this.workoutsFileService.loadWorkoutsFromFilesystem();
    workoutsFromFileSystem.forEach(file => {
      let workoutFile: WorkoutFile = workoutFileJsonToModel(file);
      this.loadedWorkouts.push({ label: workoutFile.name, value: workoutFile.workout });
    });
  }

  selectWorkout(event) {
    if (event.value) {
      if (!event.value.lastSignalSeconds) {
        event.value.lastSignalSeconds = [20, 10, 5];
      }
      this.workout = event.value;
      this.calculateTotalTimeOfWorkout();
    }
  }

  onDelayChange() {
    if (!this.workout.delay || this.workout.delay == 0) {
      this.workout.delay = 10;
    }
    this.calculateTotalTimeOfWorkout();
  }
  // ------------------------------ Workout configuration end ------------------------------

  // ------------------------------    Workout timer begin    ------------------------------
  startWorkout() {
    this.resetWorkout();
    this.isWorkoutRunning = true;
    this.isWorkoutPaused = false;
    this.remainingTime = this.calculateTotalTimeOfWorkout();
    this.currentTime = this.workout.delay;
    this.currentWholeTime = this.currentTime;
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

  checkForSignals(warningTime: number, countdownSignal: string, warningSignal: string) {
    // Countdown signal
    if (this.currentTime < warningTime && this.currentTime > 0) {
      this.soundsService.playSound(countdownSignal);
      // Last (20, 10, 5) - configurable signals
    } else if (this.workout.lastSignalSelected[0] && this.currentTime == this.workout.lastSignalSeconds[0]) {
      this.soundsService.playSound(warningSignal);
    }
    else if (this.workout.lastSignalSelected[1] && this.currentTime == this.workout.lastSignalSeconds[1]) {
      this.soundsService.playSound(warningSignal);
    }
    else if (this.workout.lastSignalSelected[2] && this.currentTime == this.workout.lastSignalSeconds[2]) {
      this.soundsService.playSound(warningSignal);
    }
  }

  // Used only for DELAY and RELAX_BETWEEN_ROUNDS
  checkForDelaySignals(countdownSignal: string, warningSignal: string) {
    // Countdown signal
    if (this.currentTime < 4 && this.currentTime > 0) {
      this.soundsService.playSound(countdownSignal);
      // Last 20, 10
    } else if (this.currentTime == 10 || this.currentTime == 20) {
      this.soundsService.playSound(warningSignal);
    }
  }

  processEachSecond() {
    this.currentTime--;
    this.elapsedTime++;
    this.remainingTime--;

    if (this.currentStatus.toUpperCase() == 'DELAY') {
      this.checkForDelaySignals("relax_countdown", "relax_warning");
    } else if(this.currentStatus.toUpperCase() == 'RELAX_BETWEEN_ROUNDS') {
      this.checkForDelaySignals("between_rounds_countdown", "between_rounds_warning");
    } else if (this.currentStatus.toUpperCase() == 'ROUND_RELAXTIME') {
      this.checkForSignals(this.workout.relaxWarning, "relax_countdown", "relax_warning");
    } else {
      this.checkForSignals(this.workout.workWarning, "work_countdown", "work_warning");
    }

    if (this.currentTime <= 0) {

      // Current status is DELAY
      if (this.currentStatus.toUpperCase() == 'DELAY') {
        this.soundsService.playSound("start_work");
        this.currentRound = 0;
        this.currentBase = 0;
        this.currentTime = this.workout.rounds[this.currentRound][this.currentBase].workTime;
        this.currentWholeTime = this.currentTime;
        this.currentStatus = 'ROUND_WORKTIME';
      }

      // Current status is ROUND_WORKTIME
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
            this.currentWholeTime = this.currentTime;
            this.currentStatus = 'RELAX_BETWEEN_ROUNDS';
          }
        } else {
          this.soundsService.playSound("stop_work");
          let useBase = this.workout.useFirstBase ? 0 : this.currentBase;
          this.currentTime = this.workout.rounds[useRound][useBase].relaxTime;
          this.currentWholeTime = this.currentTime;
          this.currentStatus = 'ROUND_RELAXTIME';
        }
      }

      // Current status is ROUND_RELAXTIME
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
          this.currentWholeTime = this.currentTime;
          this.currentStatus = 'RELAX_BETWEEN_ROUNDS';
        } else {
          // Next base
          this.soundsService.playSound("start_work");
          this.currentBase++;

          let useBase = this.workout.useFirstBase ? 0 : this.currentBase;
          let useRound = this.workout.useFirstRound ? 0 : this.currentRound;
          this.currentTime = this.workout.rounds[useRound][useBase].workTime;

          this.currentWholeTime = this.currentTime;
          this.currentStatus = 'ROUND_WORKTIME';
        }
      }

      // Current status is RELAX_BETWEEN_ROUNDS
      else if (this.currentStatus.toUpperCase() == 'RELAX_BETWEEN_ROUNDS') {
        this.soundsService.playSound("start_work");
        this.currentRound++;
        this.currentBase = 0;

        let useBase = this.workout.useFirstBase ? 0 : this.currentBase;
        let useRound = this.workout.useFirstRound ? 0 : this.currentRound;
        this.currentTime = this.workout.rounds[useRound][useBase].workTime;

        this.currentWholeTime = this.currentTime;
        this.currentStatus = 'ROUND_WORKTIME';
      }
    }
  }

  calculateProgress() {
    if (this.totalTimeOfWorkout == 0) {
      return 0;
    }
    return this.elapsedTime * 100 / this.totalTimeOfWorkout;
  }

  resetWorkout() {
    this.isWorkoutRunning = false;
    this.isWorkoutPaused = false;
    this.currentWholeTime = 0;
    this.currentTime = 0;
    this.currentRound = 0;
    this.currentBase = 0;
    this.totalTimeOfWorkout = 0;
    this.elapsedTime = 0;
    this.remainingTime = 0;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.isWorkoutRunning || this.isWorkoutPaused) {

      if (event.keyCode == this.KEY_CODE.SPACE) {
        if (this.isWorkoutPaused) {
          this.resumeWorkout();
        } else {
          this.pauseWorkout();
        }
      } else if (event.keyCode == this.KEY_CODE.ESC && this.isWorkoutPaused) {
        this.resetWorkout();
      }
    }
  }
  // ------------------------------     Workout timer end     ------------------------------


  // ------------------------------  Workout settings begin   ------------------------------
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
    this.messageService.add({ severity: 'info', summary: labels.sounds_settings, detail: labels.successful_save });
  }

  resetSoundsSettings() {
    this.populateSignalsArray();
    this.messageService.add({ severity: 'warn', summary: labels.sounds_settings, detail: labels.successful_reset });
  }

  deleteWorkout(index: number) {
    // Using index+1 because of the first default item
    this.workoutsFileService.deleteWorkout(this.loadedWorkouts[index + 1].label);
    this.loadWorkouts();
  }
  // ------------------------------    Workout settings end   ------------------------------
}
