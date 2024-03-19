import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { labels } from '../config/labels';

var remote = window.require('@electron/remote');
var fs = remote.require('fs');
var app = remote.app;
var process = window.require('process');

@Injectable({
  providedIn: 'root'
})
export class WorkoutFileService {

  workoutsFolder: string = `${process.env.PORTABLE_EXECUTABLE_DIR || app.getAppPath()}/workouts/`;
  private _workouts: any[] = [];

  constructor(private messageService: MessageService) {
    this.loadFromFileSystem();
  }

  loadFromFileSystem() {
    try {
      var files = fs.readdirSync(this.workoutsFolder);
      files.forEach(fileName => {
        let content = fs.readFileSync(this.workoutsFolder + fileName, 'utf8');
        this.workouts.push(content);
      });
    } catch (err) {
      // error in reading workouts folder
      console.log(err);
    }
  }

  checkIfFileExists(fileName: string) {
    try {
      let path = `${this.workoutsFolder}${fileName}.json`;
      return fs.existsSync(path);
    } catch (err) {
      // Nothing to do here
    }
  }

  saveWorkout(fileName: string, content: any) {
    try {
      let path = `${this.workoutsFolder}${fileName}.json`;
      fs.writeFileSync(path, JSON.stringify(content, null, 2));
      this.messageService.add({ severity: 'info', summary: labels.workout_settings, detail: labels.successful_save });
    } catch (err) {
      this.messageService.add({ severity: 'error', summary: labels.workout_settings, detail: labels.generic_error });
    }
  }

  deleteWorkout(fileName: string) {
    try {
      let path = `${this.workoutsFolder}${fileName}.json`;
      fs.unlinkSync(path);
      this.messageService.add({ severity: 'info', summary: labels.workout_settings, detail: labels.successful_delete });
    } catch (err) {
      this.messageService.add({ severity: 'error', summary: labels.workout_settings, detail: labels.generic_error });
    }
  }
  
  get workouts(): any[] {
    return this._workouts;
  }
}