import { Component, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  signalsForLast: SelectItem[] = [
    { label: '20s', value: '20s' },
    { label: '10s', value: '10s' },
    { label: '5s', value: '5s' },
  ];

  selectedSignalsForLast = [];

  value3;
  val;
}
