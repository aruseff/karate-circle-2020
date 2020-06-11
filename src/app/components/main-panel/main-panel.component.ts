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
  delayInput: number = 10;

  basesInput: number[] = [];
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

  basesInputChange(index: number) {
    this.roundsTabs[index] = new Array(this.basesInput[index]).fill(0);
  }

  updateInputs() {
    this.basesInput = new Array(this.roundsInput).fill(1);
    this.relaxesInput = new Array(this.roundsInput > 0 ? this.roundsInput-1 : 0).fill(0);
    this.roundsTabs = new Array(this.roundsInput).fill([]);

    this.roundsTabs.forEach((element, index) => {
      this.basesInputChange(index)
    });
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
