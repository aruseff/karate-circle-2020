import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainPanelComponent implements OnInit {

  lastSignalOptions: any[] = [
    {
      label: "Last 20[s]",
      value: "last20"
    },
    {
      label: "Last 10[s]",
      value: "last10"
    },
    {
      label: "Last 5[s]",
      value: "last5"
    }
  ];
  lastSignalSelected: boolean[] = [true, true, true];

  roundsInput: number = 3;
  delayInput: number = 5;

  basesInput: any[] = [];
  relaxesInput: number[] = [];
  roundsTabs: any[] = [];

  whole: number = 120;
  time: number = 120;
  round: number = 0;
  base: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.updateInputs();
  }

  roundsInputChange() {
    this.updateInputs();
  }

  basesInputChange(value: any, index: number) {
    console.log(value);
    this.roundsTabs[index] = new Array(value).fill(0);
  }

  updateInputs() {
    this.basesInput = new Array(this.roundsInput).fill("");
    this.relaxesInput = new Array(this.roundsInput > 0 ? this.roundsInput-1 : 0).fill("");
    this.roundsTabs = new Array(this.roundsInput).fill([]);
  }
}
