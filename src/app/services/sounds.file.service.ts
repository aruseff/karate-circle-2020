import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { labels } from '../config/labels';
import { SettingsService } from './settings.service';

var remote = window.require('@electron/remote');
var electronFs = remote.require('fs');
var app = remote.app;
var process = window.require('process');

@Injectable({
  providedIn: 'root'
})
export class SoundsFileService {

  soundsFolder: string = `${process.env.PORTABLE_EXECUTABLE_DIR || app.getAppPath()}/sounds/`;
  sounds: any = {};

  constructor(private messageService: MessageService,
    private settingsService: SettingsService) {
    this.loadFromFileSystem();
  }

  loadFromFileSystem() {
    try {
      var files = electronFs.readdirSync(this.soundsFolder);
      files.forEach(fileName => {
        let currentAudio = new Audio();
        currentAudio.src = `file:///${this.soundsFolder.replace('\\', '/')}/${fileName}`;
        currentAudio.load();

        this.sounds[fileName] = currentAudio;
      });
    } catch (err) {
      // error in reading sounds folder
      console.log(err);
    }
  }

  playByName(name: string) {
    this.sounds[name].play();
  }

  playByKey(key: string) {
    if (this.settingsService.settings[key]) {
      this.sounds[this.settingsService.settings[key]]?.play();
    }
  }

  saveSoundFile(content: any, filename: string) {
    let path = this.soundsFolder + filename;
    try {
      electronFs.writeFileSync(path, content);
      this.loadFromFileSystem();
      this.messageService.add({ severity: 'success', summary: labels.sounds_settings, detail: labels.successful_save });
    } catch (err) {
      this.messageService.add({ severity: 'error', summary: labels.sounds_settings, detail: labels.generic_error });
    }
  }

  getSoundsNames() {
    return Object.keys(this.sounds);
  }
}