import { Component, EventEmitter, Output, Input } from '@angular/core';
import { labels } from '../../config/labels';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {

  @Input() activeTab: number = 0;
  @Output() navigationChange: EventEmitter<any> = new EventEmitter<any>();

  labels: any = labels;

  versionInfo: any = {
    version: "3.0.0",
    date: "01/05/2024",
    os: "Windows 32-bit (NSIS)"
  }

  navItems: any[] = [{
    icon: 'timer-config'
  }, {
    icon: 'timer'
  }, {
    icon: 'settings'
  }, {
    icon: 'history'
  }];


  navigate(index: number) {
    this.activeTab = index;
    this.navigationChange.emit(index);
  }
}
