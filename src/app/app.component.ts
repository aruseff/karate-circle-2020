import { Component, HostListener } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Workout } from './models/workout.model';
import { Observable, timer, Subscription } from 'rxjs';
import { SoundsService } from './services/sounds.service';
import { WorkoutFile } from './models/workout-file.model';
import { workoutFileJsonToModel } from './util/model.mapper';
import { SoundsFileService } from './services/sounds.file.service';
import { SettingsService } from './services/settings.service';
import { labels } from './config/labels';
import { WorkoutFileService } from './services/workout.file.service';
declare const Buffer;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  doc: any = document;
  labels: any = labels;
  activeTab: number = 1;

  // ------------------------------ Workout configuration end ------------------------------

  // ------------------------------    Workout timer begin    ------------------------------

  // ------------------------------     Workout timer end     ------------------------------

  // ------------------------------  Workout settings begin   ------------------------------
  signals: any[] = [];
  selectedSignalType: number = 0;
  soundsFileNames: string[];
  selectedWorkoutIndex: number = 0;
  // ------------------------------    Workout settings end   ------------------------------

  constructor(
    private settingsService: SettingsService,


    private workoutsFileService: WorkoutFileService,
    private soundsFileService: SoundsFileService
  ) { }

  ngOnInit(): void {
    // this.populateSignalsArray();
    // this.soundsFileNames = this.soundsFileService.getSoundsFiles();
    // this.loadWorkouts();
  }

  navigate(index: number) {
    this.activeTab = index;
  }

  // ------------------------------ Workout configuration begin ------------------------------
  


  // onDelayChange() {
  //   if (!this.workout.delay || this.workout.delay == 0) {
  //     this.workout.delay = 10;
  //   }
  //   this.calculateTotalTimeOfWorkout();
  // }
  // // ------------------------------ Workout configuration end ------------------------------

  // // ------------------------------    Workout timer begin    ------------------------------
  
  // // ------------------------------     Workout timer end     ------------------------------


  // // ------------------------------  Workout settings begin   ------------------------------
  // previewSound(index: number) {
  //   this.soundsFileService.play(index);
  // }

  // populateSignalsArray() {
  //   let settings = this.settingsService.getAll();
  //   this.signals = [];
  //   for (var prop in settings) {
  //     if (Object.prototype.hasOwnProperty.call(settings, prop)) {
  //       this.signals.push({ "id": prop, "label": labels[prop], "wav": settings[prop] });
  //     }
  //   }
  // }

  // uploadWavFile(files: any) {
  //   for (let i = 0; i < files.target.files.length; i++) {
  //     let fileReader = new FileReader();
  //     let file = files.target.files[i];
  //     fileReader.onload = (e) => {
  //       this.soundsFileService.saveSoundFile(Buffer.from(fileReader.result.toString().replace('data:audio/wav;base64,', ''), 'base64'), file.name);
  //       if (i == files.target.files.length - 1) {
  //         this.soundsFileNames = this.soundsFileService.getSoundsFiles();
  //       }
  //     };
  //     fileReader.readAsDataURL(file);
  //   }
  // }

  // saveSoundsSettings() {
  //   this.signals.forEach(signalType => {
  //     this.settingsService.set(signalType.id, signalType.wav);
  //   });
  //   this.soundsService.refreshSounds();
  //   this.messageService.add({ severity: 'info', summary: labels.sounds_settings, detail: labels.successful_save });
  // }

  // resetSoundsSettings() {
  //   this.populateSignalsArray();
  //   this.messageService.add({ severity: 'warn', summary: labels.sounds_settings, detail: labels.successful_reset });
  // }

  // deleteWorkout(index: number) {
  //   // Using index+1 because of the first default item
  //   this.workoutsFileService.deleteWorkout(this.loadedWorkouts[index + 1].label);
  //   this.loadWorkouts();
  // }
  // // ------------------------------    Workout settings end   ------------------------------
}
