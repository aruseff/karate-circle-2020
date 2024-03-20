import { Injectable } from '@angular/core';

var remote = window.require('@electron/remote');
var fs = remote.require('fs');
var path = remote.require('path');

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  configPath: string;
  defaultSettings: any = {
    relax_countdown: "Warning.wav",
    work_countdown: "Warning1.wav",
    start_work: "Start.wav",
    stop_work: "Stop.wav",
    round_end: "CircleEnd.wav",
    workout_end: "End.wav",
    work_warning: "VoiceWarning1.wav",
    relax_warning: "VoiceWarning2.wav",
    between_rounds_warning: "2.wav",
    between_rounds_countdown: "1.wav",
    last_base_signal: "short.wav"
  };
  private _settings: any;

  constructor() {
    const userDataPath = remote.app.getPath('userData');
    this.configPath = path.join(userDataPath, 'settings.json');
    this._settings = this.parseDataFile(this.configPath, this.defaultSettings);
  }

  get(key: string) {
    return this.settings[key];
  }

  set(key: string, value: any) {
    this.settings[key] = value;
    fs.writeFileSync(this.configPath, JSON.stringify(this.settings));
  }

  parseDataFile(filePath: string, defaults: any) {
    try {
      let settings = JSON.parse(fs.readFileSync(filePath));
      // Adding this new sound types and probably it's missing in the already created settings
      if (!settings.between_rounds_warning) {
        settings.between_rounds_warning = "2.wav";
      }
      if (!settings.between_rounds_countdown) {
        settings.between_rounds_countdown = "1.wav";
      }
      if (!settings.last_base_signal) {
        settings.last_base_signal = "short.wav";
      }
      return settings;
    } catch (error) {
      return defaults;
    }
  }

  get settings(): any {
    return this._settings;
  }

}