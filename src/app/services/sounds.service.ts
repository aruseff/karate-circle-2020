import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { Howl } from 'howler';

var remote = window.require('@electron/remote');
var app = remote.app;

@Injectable({
  providedIn: 'root'
})
export class SoundsService {

  sounds: any = {
    relaxCountdownSignal: {},
    workCountdownSignal: {},
    startWorkSignal: {},
    stopWorkSignal: {},
    roundEndSignal: {},
    workoutEndSignal: {},
    workWarningSignal: {},
    relaxWarningSignal: {},
    betweenRoundsWarning: {},
    betweenRoundsCountdown: {}
  }

  constructor(private settingsService: SettingsService) {
    this.refreshSounds();
  }

  refreshSounds() {
    let soundsFolder = `${app.getAppPath()}/sounds/`;

    this.loadSound(soundsFolder, 'relax_countdown');
    this.loadSound(soundsFolder, 'work_countdown');
    this.loadSound(soundsFolder, 'start_work');
    this.loadSound(soundsFolder, 'stop_work');
    this.loadSound(soundsFolder, 'round_end');
    this.loadSound(soundsFolder, 'workout_end');
    this.loadSound(soundsFolder, 'work_warning');
    this.loadSound(soundsFolder, 'relax_warning');
    this.loadSound(soundsFolder, 'between_rounds_warning');
    this.loadSound(soundsFolder, 'between_rounds_countdown');
  }

  loadSound(soundsFolder: string, soundName: string) {
    this.sounds[soundName] = new Howl({
      src: [soundsFolder + this.settingsService.get(soundName)],
      preload: true
    });
  }

  playSound(key: string) {
    if (this.sounds[key]) {
      this.sounds[key].play();
    }
  }
}