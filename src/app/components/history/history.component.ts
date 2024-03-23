import { Component, ViewChild } from '@angular/core';
import { labels } from '../../config/labels';
import { HistoryService } from 'src/app/services/history.service';
import { Workout } from 'src/app/models/workout.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {

  labels: any = labels;

  history: any[] = [];
  loading: boolean = false;

  workoutToPreview: Workout;

  previewDialogOpened: boolean = false;

  @ViewChild('workoutPanel') workoutPanel: any;

  constructor(private historyService: HistoryService) { }

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
}
