import { Component, HostListener } from '@angular/core';
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
const powerSaveBlocker = window.require('@electron/remote').powerSaveBlocker;
declare const Buffer;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  doc: any = document;
  labels: any = labels;
  activeTab: number = 0;

  // Save/load workouts
  loadedWorkouts: any[] = [{ label: labels.select_workout, value: null }];
  selectedWorkout: any;
  saveWorkoutInput: string = '';

  // ------------------------------ Workout configuration end ------------------------------

  // ------------------------------    Workout timer begin    ------------------------------
  // Power saver fields
  powerSaverType: any = "prevent-display-sleep";
  powerSaverId: number = null;

  currentStatus: string = 'DELAY';

  // Fields
  currentWholeTime: number = 0;
  currentTime: number = 0;
  currentRound: number = 0;
  currentBase: number = 0;
  elapsedTime: number = 0;
  remainingTime: number = 0;

  // Timer observables
  workoutCountdown: Observable<number> = timer(1000, 1000);
  workoutSubscription: Subscription;

  // Key Listeners
  KEY_CODE = {
    ENTER: 'Enter',
    SPACE: 'Space',
    ESC: 'Escape'
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
    private settingsService: SettingsService,
    private soundsService: SoundsService,
    private workoutsFileService: WorkoutFileService,
    private soundsFileService: SoundsFileService
  ) { }

  ngOnInit(): void {
    // this.populateSignalsArray();
    // this.soundsFileNames = this.soundsFileService.getSoundsFiles();
    // this.loadWorkouts();

    // this.refreshWorkoutModel();
  }

  navigate(index: number) {
    this.activeTab = index;
  }

  // ------------------------------ Workout configuration begin ------------------------------
  
  // saveWorkout() {
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
  // }

  // loadWorkouts() {
  //   this.loadedWorkouts = [{ label: labels.select_workout, value: null }];
  //   let workoutsFromFileSystem = this.workoutsFileService.loadWorkoutsFromFilesystem();
  //   workoutsFromFileSystem.forEach(file => {
  //     let workoutFile: WorkoutFile = workoutFileJsonToModel(file);
  //     this.loadedWorkouts.push({ label: workoutFile.name, value: workoutFile.workout });
  //   });
  // }

  // selectWorkout(event) {
  //   if (event.value) {
  //     if (!event.value.lastSignalSeconds) {
  //       event.value.lastSignalSeconds = [20, 10, 5];
  //     }
  //     this.workout = event.value;
  //     this.calculateTotalTimeOfWorkout();
  //   }
  // }

  // onDelayChange() {
  //   if (!this.workout.delay || this.workout.delay == 0) {
  //     this.workout.delay = 10;
  //   }
  //   this.calculateTotalTimeOfWorkout();
  // }
  // // ------------------------------ Workout configuration end ------------------------------

  // // ------------------------------    Workout timer begin    ------------------------------
  // startWorkout() {
  //   this.startScreenSleepPrevent();
  //   this.resetWorkout();
  //   this.isWorkoutRunning = true;
  //   this.isWorkoutPaused = false;
  //   this.remainingTime = this.calculateTotalTimeOfWorkout();
  //   this.currentTime = this.workout.delay;
  //   this.currentWholeTime = this.currentTime;
  //   this.currentStatus = 'DELAY';

  //   this.workoutSubscription = this.workoutCountdown.subscribe(() => {
  //     this.processEachSecond();
  //   });
  // }

  // pauseWorkout() {
  //   this.stopScreenSleepPrevent();
  //   this.isWorkoutRunning = false;
  //   this.isWorkoutPaused = true;
  //   this.workoutSubscription.unsubscribe();
  // }

  // resumeWorkout() {
  //   this.startScreenSleepPrevent();
  //   this.isWorkoutRunning = true;
  //   this.isWorkoutPaused = false;
  //   this.workoutSubscription = this.workoutCountdown.subscribe(() => {
  //     this.processEachSecond();
  //   });
  // }

  // checkForSignals(warningTime: number, countdownSignal: string, warningSignal: string) {
  //   // Countdown signal
  //   if (this.currentTime < warningTime && this.currentTime > 0) {
  //     this.soundsService.playSound(countdownSignal);
  //     // Last (20, 10, 5) - configurable signals
  //   } else if (this.workout.lastSignalSelected[0] && this.currentTime == this.workout.lastSignalSeconds[0]) {
  //     this.soundsService.playSound(warningSignal);
  //   }
  //   else if (this.workout.lastSignalSelected[1] && this.currentTime == this.workout.lastSignalSeconds[1]) {
  //     this.soundsService.playSound(warningSignal);
  //   }
  //   else if (this.workout.lastSignalSelected[2] && this.currentTime == this.workout.lastSignalSeconds[2]) {
  //     this.soundsService.playSound(warningSignal);
  //   }
  // }

  // // Used only for DELAY and RELAX_BETWEEN_ROUNDS
  // checkForDelaySignals(countdownSignal: string, warningSignal: string) {
  //   // Countdown signal
  //   if (this.currentTime < 4 && this.currentTime > 0) {
  //     this.soundsService.playSound(countdownSignal);
  //     // Last 20, 10
  //   } else if (this.currentTime == 10 || this.currentTime == 20) {
  //     this.soundsService.playSound(warningSignal);
  //   }
  // }

  // processEachSecond() {
  //   this.currentTime--;
  //   this.elapsedTime++;
  //   this.remainingTime--;

  //   if (this.currentStatus.toUpperCase() == 'DELAY') {
  //     this.checkForDelaySignals("relax_countdown", "relax_warning");
  //   } else if (this.currentStatus.toUpperCase() == 'RELAX_BETWEEN_ROUNDS') {
  //     this.checkForDelaySignals("between_rounds_countdown", "between_rounds_warning");
  //   } else if (this.currentStatus.toUpperCase() == 'ROUND_RELAXTIME') {
  //     this.checkForSignals(this.workout.relaxWarning, "relax_countdown", "relax_warning");
  //   } else {
  //     this.checkForSignals(this.workout.workWarning, "work_countdown", "work_warning");
  //   }

  //   if (this.currentTime <= 0) {

  //     // Current status is DELAY
  //     if (this.currentStatus.toUpperCase() == 'DELAY') {
  //       this.soundsService.playSound("start_work");
  //       this.currentRound = 0;
  //       this.currentBase = 0;
  //       this.currentTime = this.workout.rounds[this.currentRound][this.currentBase].workTime;
  //       this.currentWholeTime = this.currentTime;
  //       this.currentStatus = 'ROUND_WORKTIME';
  //     }

  //     // Current status is ROUND_WORKTIME
  //     else if (this.currentStatus.toUpperCase() == 'ROUND_WORKTIME') {

  //       let useRound = this.workout.useFirstRound ? 0 : this.currentRound;
  //       if (this.workout.rounds[useRound].length - 1 == this.currentBase && !this.workout.lastRelax) {

  //         if (this.currentRound == this.workout.roundsCount - 1) {// Check if last round :: Workout end
  //           this.soundsService.playSound("workout_end");
  //           this.workoutSubscription.unsubscribe();
  //           this.isWorkoutRunning = false;
  //           return;
  //         } else { // Not last round :: Round end
  //           this.soundsService.playSound("round_end");
  //           this.currentTime = this.workout.relaxes[this.currentRound];
  //           this.currentWholeTime = this.currentTime;
  //           this.currentStatus = 'RELAX_BETWEEN_ROUNDS';
  //         }
  //       } else {
  //         this.soundsService.playSound("stop_work");
  //         let useBase = this.workout.useFirstBase ? 0 : this.currentBase;
  //         this.currentTime = this.workout.rounds[useRound][useBase].relaxTime;
  //         this.currentWholeTime = this.currentTime;
  //         this.currentStatus = 'ROUND_RELAXTIME';
  //       }
  //     }

  //     // Current status is ROUND_RELAXTIME
  //     else if (this.currentStatus.toUpperCase() == 'ROUND_RELAXTIME') {
  //       // Check if workout finished - last relax
  //       let useRound = this.workout.useFirstRound ? 0 : this.currentRound;
  //       if (this.currentRound == this.workout.roundsCount - 1 && this.workout.rounds[useRound].length - 1 == this.currentBase) {
  //         this.soundsService.playSound("workout_end");
  //         this.stopScreenSleepPrevent();
  //         this.workoutSubscription.unsubscribe();
  //         this.isWorkoutRunning = false;
  //         return;
  //       }

  //       // Relax between rounds
  //       if (this.workout.rounds[useRound].length - 1 == this.currentBase) {
  //         this.soundsService.playSound("round_end");
  //         this.currentTime = this.workout.relaxes[this.currentRound];
  //         this.currentWholeTime = this.currentTime;
  //         this.currentStatus = 'RELAX_BETWEEN_ROUNDS';
  //       } else {
  //         // Next base
  //         this.soundsService.playSound("start_work");
  //         this.currentBase++;

  //         let useBase = this.workout.useFirstBase ? 0 : this.currentBase;
  //         let useRound = this.workout.useFirstRound ? 0 : this.currentRound;
  //         this.currentTime = this.workout.rounds[useRound][useBase].workTime;

  //         this.currentWholeTime = this.currentTime;
  //         this.currentStatus = 'ROUND_WORKTIME';
  //       }
  //     }

  //     // Current status is RELAX_BETWEEN_ROUNDS
  //     else if (this.currentStatus.toUpperCase() == 'RELAX_BETWEEN_ROUNDS') {
  //       this.soundsService.playSound("start_work");
  //       this.currentRound++;
  //       this.currentBase = 0;

  //       let useBase = this.workout.useFirstBase ? 0 : this.currentBase;
  //       let useRound = this.workout.useFirstRound ? 0 : this.currentRound;
  //       this.currentTime = this.workout.rounds[useRound][useBase].workTime;

  //       this.currentWholeTime = this.currentTime;
  //       this.currentStatus = 'ROUND_WORKTIME';
  //     }
  //   }
  // }

  // calculateProgress() {
  //   if (this.totalTimeOfWorkout == 0) {
  //     return 0;
  //   }
  //   return this.elapsedTime * 100 / this.totalTimeOfWorkout;
  // }

  // resetWorkout() {
  //   this.isWorkoutRunning = false;
  //   this.isWorkoutPaused = false;
  //   this.currentWholeTime = 0;
  //   this.currentTime = 0;
  //   this.currentRound = 0;
  //   this.currentBase = 0;
  //   this.totalTimeOfWorkout = 0;
  //   this.elapsedTime = 0;
  //   this.remainingTime = 0;
  // }

  // @HostListener('window:keyup', ['$event'])
  // keyEvent(event: KeyboardEvent) {
  //   if (event.code == this.KEY_CODE.SPACE && (this.isWorkoutRunning || this.isWorkoutPaused)) {
  //     if (this.isWorkoutPaused) {
  //       this.resumeWorkout();
  //     } else {
  //       this.pauseWorkout();
  //     }
  //   }

  //   if (event.code == this.KEY_CODE.ESC && (!this.isWorkoutRunning || this.isWorkoutPaused)) {
  //     this.resetWorkout();
  //   }

  //   if (event.code == this.KEY_CODE.ENTER && !this.isWorkoutRunning && !this.isWorkoutPaused) {
  //     this.activeTab = 1;
  //     this.startWorkout();
  //   }
  // }

  // startScreenSleepPrevent() {
  //   this.powerSaverId = powerSaveBlocker.start(this.powerSaverType);
  //   this.messageService.add({ severity: 'info', summary: labels.device_sleep, detail: labels.turned_off });
  // }

  // stopScreenSleepPrevent() {
  //   if (this.powerSaverId != null && this.powerSaverId != undefined) {
  //     powerSaveBlocker.stop(this.powerSaverId);
  //     this.messageService.add({ severity: 'info', summary: labels.device_sleep, detail: labels.turned_on });
  //   }
  // }
  // // ------------------------------     Workout timer end     ------------------------------


  // // ------------------------------  Workout settings begin   ------------------------------
  // previewSound(index: number) {
  //   this.soundsFileService.play(index);
  // }

  // populateSignalsArray() {
  //   let settings = this.settingsService.getAll();
  //   this.signals = [];
  //   for (var prop in settings) {
  //     if (Object.prototype.hasOwnProperty.call(settings, prop)) {
  //       this.signals.push({ "id": prop, "label": labels[prop], "wav": settings[prop] });
  //     }
  //   }
  // }

  // uploadWavFile(files: any) {
  //   for (let i = 0; i < files.target.files.length; i++) {
  //     let fileReader = new FileReader();
  //     let file = files.target.files[i];
  //     fileReader.onload = (e) => {
  //       this.soundsFileService.saveSoundFile(Buffer.from(fileReader.result.toString().replace('data:audio/wav;base64,', ''), 'base64'), file.name);
  //       if (i == files.target.files.length - 1) {
  //         this.soundsFileNames = this.soundsFileService.getSoundsFiles();
  //       }
  //     };
  //     fileReader.readAsDataURL(file);
  //   }
  // }

  // saveSoundsSettings() {
  //   this.signals.forEach(signalType => {
  //     this.settingsService.set(signalType.id, signalType.wav);
  //   });
  //   this.soundsService.refreshSounds();
  //   this.messageService.add({ severity: 'info', summary: labels.sounds_settings, detail: labels.successful_save });
  // }

  // resetSoundsSettings() {
  //   this.populateSignalsArray();
  //   this.messageService.add({ severity: 'warn', summary: labels.sounds_settings, detail: labels.successful_reset });
  // }

  // deleteWorkout(index: number) {
  //   // Using index+1 because of the first default item
  //   this.workoutsFileService.deleteWorkout(this.loadedWorkouts[index + 1].label);
  //   this.loadWorkouts();
  // }
  // // ------------------------------    Workout settings end   ------------------------------
}
