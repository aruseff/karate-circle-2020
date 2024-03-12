import { Component, EventEmitter, Output } from '@angular/core';
import { labels } from '../../util/labels';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {

  @Output() navigationChange: EventEmitter<any> = new EventEmitter<any>();

  labels: any = labels;

  versionInfo: any = {
    version: "3.0.0",
    date: "26/03/2022",
    os: "Windows 32-bit (Portable)"
  }

  navItems: any[] = [{
    icon: 'timer-config'
  }, {
    icon: 'timer'
  }, {
    icon: 'settings'
  }];

  activeTab: number = 0;

  navigate(index: number) {
    this.activeTab = index;
    this.navigationChange.emit(index);
  }
}
