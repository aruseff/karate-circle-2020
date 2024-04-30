import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { labels } from '../../config/labels';
import { HistoryService } from 'src/app/services/history.service';
import { Workout } from 'src/app/models/workout.model';
import { ConfirmationService } from 'primeng/api';
import { WorkoutService } from 'src/app/services/workout.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  providers: [ConfirmationService]
})
export class HistoryComponent {

  @Output() navigate: EventEmitter<any> = new EventEmitter<any>();

  labels: any = labels;

  history: any[] = [];
  loading: boolean = false;

  workoutToPreview: Workout;

  previewDialogOpened: boolean = false;

  @ViewChild('workoutPanel') workoutPanel: any;

  constructor(private historyService: HistoryService,
    private workoutService: WorkoutService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.getHistory();
  }

  getHistory() {
    this.loading = true;
    this.history = this.historyService.getHistory();
    this.loading = false;
  }

  getFullHistory() {
    this.loading = true;
    this.history = this.historyService.getHistory(true);
    this.loading = false;
  }

  previewWorkout(workout: any) {
    this.workoutToPreview = JSON.parse(workout.content);
    this.previewDialogOpened = true;
  }

  playWorkout(workout: any) {
    this.previewDialogOpened = false;
    this.confirmationService.confirm({
      message: labels.play_workout_confirmation_message,
      header: labels.play_workout_confirmation_header,
      acceptLabel: labels.load,
      rejectLabel: labels.reject,
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.workoutService.workout = workout;
        this.navigate.emit(0);
      }
    });
  }

  parseJSON(value: string) {
    return JSON.parse(value);
  }

  get isWorkoutRunning(): boolean {
    return this.workoutService.isWorkoutRunning;
  }

  get isWorkoutPaused(): boolean {
    return this.workoutService.isWorkoutPaused;
  }
}
