import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  activeTab: number = 0;
  screenPositions: any[] = [0, -150, -300];

  constructor() { }

  navigate(index: number) {
    this.activeTab = index;
  }
}