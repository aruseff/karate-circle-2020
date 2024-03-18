import { Component, HostListener } from '@angular/core';
import { Observable, timer, Subscription } from 'rxjs';
import { Workout } from 'src/app/models/workout.model';
import { WorkoutService } from 'src/app/services/workout.service';
import { labels } from 'src/app/config/labels';
import { MessageService } from 'primeng/api';
import { SoundsService } from 'src/app/services/sounds.service';

const powerSaveBlocker = window.require('@electron/remote').powerSaveBlocker;

@Component({
  selector: 'app-workout-timer',
  templateUrl: './workout-timer.component.html',
  styleUrl: './workout-timer.component.scss'
})
export class WorkoutTimerComponent {

  labels: any = labels;

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

  constructor(public workoutService: WorkoutService,
    private soundsService: SoundsService,
    private messageService: MessageService) { }

  startWorkout() {
    this.startScreenSleepPrevent();
    this.resetWorkout();
    this.isWorkoutRunning = true;
    this.isWorkoutPaused = false;
    this.remainingTime = this.workoutService.calculateTotalTimeOfWorkout();
    this.currentTime = this.wo.delay;
    this.currentWholeTime = this.currentTime;
    this.currentStatus = 'DELAY';

    this.workoutSubscription = this.workoutCountdown.subscribe(() => {
      this.processEachSecond();
    });
  }

  calculateProgress() {
    if (this.workoutService.totalTimeOfWorkout == 0) {
      return 0;
    }
    return this.elapsedTime * 100 / this.workoutService.totalTimeOfWorkout;
  }

  pauseWorkout() {
    this.stopScreenSleepPrevent();
    this.isWorkoutRunning = false;
    this.isWorkoutPaused = true;
    this.workoutSubscription.unsubscribe();
  }

  resumeWorkout() {
    this.startScreenSleepPrevent();
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

    if (this.currentStatus.toUpperCase() == 'DELAY') {
      this.checkForDelaySignals("relax_countdown", "relax_warning");
    } else if (this.currentStatus.toUpperCase() == 'RELAX_BETWEEN_ROUNDS') {
      this.checkForDelaySignals("between_rounds_countdown", "between_rounds_warning");
    } else if (this.currentStatus.toUpperCase() == 'ROUND_RELAXTIME') {
      this.checkForSignals(this.wo.relaxWarning, "relax_countdown", "relax_warning");
    } else {
      this.checkForSignals(this.wo.workWarning, "work_countdown", "work_warning");
    }

    if (this.currentTime <= 0) {

      // Current status is DELAY
      if (this.currentStatus.toUpperCase() == 'DELAY') {
        this.soundsService.playSound("start_work");
        this.currentRound = 0;
        this.currentBase = 0;
        this.currentTime = this.wo.rounds[this.currentRound][this.currentBase].workTime;
        this.currentWholeTime = this.currentTime;
        this.currentStatus = 'ROUND_WORKTIME';
      }

      // Current status is ROUND_WORKTIME
      else if (this.currentStatus.toUpperCase() == 'ROUND_WORKTIME') {

        let useRound = this.wo.useFirstRound ? 0 : this.currentRound;
        if (this.wo.rounds[useRound].length - 1 == this.currentBase && !this.wo.lastRelax) {

          if (this.currentRound == this.wo.roundsCount - 1) {// Check if last round :: Workout end
            this.soundsService.playSound("workout_end");
            this.workoutSubscription.unsubscribe();
            this.isWorkoutRunning = false;
            return;
          } else { // Not last round :: Round end
            this.soundsService.playSound("round_end");
            this.currentTime = this.wo.relaxes[this.currentRound];
            this.currentWholeTime = this.currentTime;
            this.currentStatus = 'RELAX_BETWEEN_ROUNDS';
          }
        } else {
          this.soundsService.playSound("stop_work");
          let useBase = this.wo.useFirstBase ? 0 : this.currentBase;
          this.currentTime = this.wo.rounds[useRound][useBase].relaxTime;
          this.currentWholeTime = this.currentTime;
          this.currentStatus = 'ROUND_RELAXTIME';
        }
      }

      // Current status is ROUND_RELAXTIME
      else if (this.currentStatus.toUpperCase() == 'ROUND_RELAXTIME') {
        // Check if workout finished - last relax
        let useRound = this.wo.useFirstRound ? 0 : this.currentRound;
        if (this.currentRound == this.wo.roundsCount - 1 && this.wo.rounds[useRound].length - 1 == this.currentBase) {
          this.soundsService.playSound("workout_end");
          this.stopScreenSleepPrevent();
          this.workoutSubscription.unsubscribe();
          this.isWorkoutRunning = false;
          return;
        }

        // Relax between rounds
        if (this.wo.rounds[useRound].length - 1 == this.currentBase) {
          this.soundsService.playSound("round_end");
          this.currentTime = this.wo.relaxes[this.currentRound];
          this.currentWholeTime = this.currentTime;
          this.currentStatus = 'RELAX_BETWEEN_ROUNDS';
        } else {
          // Next base
          this.soundsService.playSound("start_work");
          this.currentBase++;

          let useBase = this.wo.useFirstBase ? 0 : this.currentBase;
          let useRound = this.wo.useFirstRound ? 0 : this.currentRound;
          this.currentTime = this.wo.rounds[useRound][useBase].workTime;

          this.currentWholeTime = this.currentTime;
          this.currentStatus = 'ROUND_WORKTIME';
        }
      }

      // Current status is RELAX_BETWEEN_ROUNDS
      else if (this.currentStatus.toUpperCase() == 'RELAX_BETWEEN_ROUNDS') {
        this.soundsService.playSound("start_work");
        this.currentRound++;
        this.currentBase = 0;

        let useBase = this.wo.useFirstBase ? 0 : this.currentBase;
        let useRound = this.wo.useFirstRound ? 0 : this.currentRound;
        this.currentTime = this.wo.rounds[useRound][useBase].workTime;

        this.currentWholeTime = this.currentTime;
        this.currentStatus = 'ROUND_WORKTIME';
      }
    }
  }

  checkForSignals(warningTime: number, countdownSignal: string, warningSignal: string) {
    // Countdown signal
    if (this.currentTime < warningTime && this.currentTime > 0) {
      this.soundsService.playSound(countdownSignal);
      // Last (20, 10, 5) - configurable signals
    } else if (this.wo.lastSignalSelected[0] && this.currentTime == this.wo.lastSignalSeconds[0]) {
      this.soundsService.playSound(warningSignal);
    } else if (this.wo.lastSignalSelected[1] && this.currentTime == this.wo.lastSignalSeconds[1]) {
      this.soundsService.playSound(warningSignal);
    } else if (this.wo.lastSignalSelected[2] && this.currentTime == this.wo.lastSignalSeconds[2]) {
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

  startScreenSleepPrevent() {
    this.powerSaverId = powerSaveBlocker.start(this.powerSaverType);
    this.messageService.add({ severity: 'info', summary: labels.device_sleep, detail: labels.turned_off });
  }

  stopScreenSleepPrevent() {
    if (this.powerSaverId != null && this.powerSaverId != undefined) {
      powerSaveBlocker.stop(this.powerSaverId);
      this.messageService.add({ severity: 'info', summary: labels.device_sleep, detail: labels.turned_on });
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code == this.KEY_CODE.SPACE && (this.isWorkoutRunning || this.isWorkoutPaused)) {
      if (this.isWorkoutPaused) {
        this.resumeWorkout();
      } else {
        this.pauseWorkout();
      }
    }

    if (event.code == this.KEY_CODE.ESC && (!this.isWorkoutRunning || this.isWorkoutPaused)) {
      this.resetWorkout();
    }

    if (event.code == this.KEY_CODE.ENTER && !this.isWorkoutRunning && !this.isWorkoutPaused) {
      //TODO
      // this.activeTab = 1;
      this.startWorkout();
    }
  }

  get wo(): Workout {
    return this.workoutService.workout;
  }

  get isWorkoutRunning(): boolean {
    return this.workoutService.isWorkoutRunning;
  }

  set isWorkoutRunning(value: boolean) {
    this.workoutService.isWorkoutRunning = value;
  }

  get isWorkoutPaused(): boolean {
    return this.workoutService.isWorkoutPaused;
  }

  set isWorkoutPaused(value: boolean) {
    this.workoutService.isWorkoutPaused = value;
  }

  get totalTimeOfWorkout(): boolean {
    return this.workoutService.isWorkoutPaused;
  }

  set totalTimeOfWorkout(value: any) {
    this.workoutService.totalTimeOfWorkout = value;
  }

}
