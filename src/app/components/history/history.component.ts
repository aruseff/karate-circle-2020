import { Component } from '@angular/core';
import { labels } from '../../config/labels';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {

  labels: any = labels;

  history: any[] = [];
  loading: boolean = false;

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

}
