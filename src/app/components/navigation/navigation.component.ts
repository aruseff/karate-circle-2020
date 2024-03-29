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
    date: "08/03/2024",
    os: "Windows 64-bit (Portable)"
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
