import { Injectable } from '@angular/core';
import { Workout } from '../models/workout.model';
import { DatePipe } from '@angular/common';

var remote = window.require('@electron/remote');
var fs = remote.require('fs');
var app = remote.app;
var process = window.require('process');

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private readonly cutoffDays = 30;

  historyFolder: string = `${process.env.PORTABLE_EXECUTABLE_DIR || app.getAppPath()}/history/`;

  constructor(private datePipe: DatePipe) { }

  getHistory(full: boolean = false): any[] {
    try {
      return this.getFilenames(full).map((file: any) => {
        file.content = fs.readFileSync(this.historyFolder + file.filename, 'utf8');
        return file;
      });
    } catch (err) {
      // error in reading history folder
      console.log(err);
    }
  }

  getFilenames(full: boolean) {
    console.log(full ? "Get full history" : "Get 30 day history");
    try {
      let cutoffDate = this.getCutoffDate();
      return fs.readdirSync(this.historyFolder)
        .map((filename: string) => {
          return {
            filename: filename,
            creationDate: fs.statSync(this.historyFolder + filename)?.birthtime
          }
        })
        .filter((file: any) => full || file.creationDate > cutoffDate)
        .sort((f1: any, f2: any) => f1.creationDate - f2.creationDate)
    } catch (err) {
      // error in reading history folder
      console.log(err);
    }
  }

  getCutoffDate() {
    let now = new Date()
    return new Date(now.setDate(now.getDate() - this.cutoffDays));
  }

  addToHistory(workout: Workout) {
    try {
      let filename = this.generateHistoryFilename();
      let path = `${this.historyFolder}${filename}.json`;
      fs.writeFileSync(path, JSON.stringify(workout, null, 2));
    } catch (err) {
      // Nothing to do - just don't save to history
    }
  }

  generateHistoryFilename() {
    return this.datePipe.transform(new Date().getTime(), 'dd_MM_YYYY__HH_mm_ss_sss');
  }
}