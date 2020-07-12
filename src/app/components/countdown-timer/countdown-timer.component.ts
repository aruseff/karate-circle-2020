import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent implements OnInit {

  @Input()
  wholeTime: number;

  @Input()
  status: string;

  @Input()
  isPaused: boolean = false;

  @Input("seconds")
  set seconds(seconds: number) {
    this._seconds = seconds;
    if (this._seconds != 0) {
      this.setCircleDasharray();
    }
  }

  _seconds: number = this.wholeTime;
  circleDasharray: string = '284';
  strokeColors: any = {
    DELAY: "blue",
    ROUND_WORKTIME: "red",
    ROUND_RELAXTIME: "green",
    RELAX_BETWEEN_ROUNDS: "blue",
  };
  statusLabels: any = {
    DELAY: "PREPARE",
    ROUND_WORKTIME: "WORK",
    ROUND_RELAXTIME: "RELAX",
    RELAX_BETWEEN_ROUNDS: "PREPARE",
  };

  constructor() { }

  ngOnInit(): void {

  }

  setCircleDasharray() {
    let rawTimeFraction = this._seconds / this.wholeTime;
    rawTimeFraction = rawTimeFraction - (1 / this.wholeTime) * (1 - rawTimeFraction);
    this.circleDasharray = (rawTimeFraction * 283).toFixed(0);
  }

}
