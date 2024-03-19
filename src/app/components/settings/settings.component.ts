import { Component } from '@angular/core';
import { labels } from 'src/app/config/labels';
import { SettingsService } from 'src/app/services/settings.service';
import { SoundsFileService } from 'src/app/services/sounds.file.service';
import { SoundsService } from 'src/app/services/sounds.service';
import { WorkoutFileService } from 'src/app/services/workout.file.service';
import { MessageService } from 'primeng/api';
import { WorkoutFile } from 'src/app/models/workout-file.model';
import { workoutFileJsonToModel } from 'src/app/util/model.mapper';
import { WorkoutService } from 'src/app/services/workout.service';

declare const Buffer;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  doc: any = document;
  labels: any = labels;

  signals: any[] = [];
  selectedSignalType: number = 0;
  soundsFileNames: string[];
  selectedWorkoutIndex: number = 0;

  loadedWorkouts: any[] = [{ label: labels.select_workout, value: null }];

  constructor(private settingsService: SettingsService,
    private workoutsFileService: WorkoutFileService,
    private soundsFileService: SoundsFileService,
    private soundsService: SoundsService,
    private messageService: MessageService,
    private workoutService: WorkoutService) { }

  ngOnInit(): void {
    this.populateSignalsArray();
    this.soundsFileNames = this.soundsFileService.getSoundsFiles();
    this.loadWorkouts();
  }

  previewSound(index: number) {
    this.soundsFileService.play(index);
  }

  populateSignalsArray() {
    let settings = this.settingsService.getAll();
    this.signals = [];
    for (var prop in settings) {
      if (Object.prototype.hasOwnProperty.call(settings, prop)) {
        this.signals.push({ "id": prop, "label": labels[prop], "wav": settings[prop] });
      }
    }
  }

  uploadWavFile(files: any) {
    for (let i = 0; i < files.target.files.length; i++) {
      let fileReader = new FileReader();
      let file = files.target.files[i];
      fileReader.onload = (e) => {
        this.soundsFileService.saveSoundFile(Buffer.from(fileReader.result.toString().replace('data:audio/wav;base64,', ''), 'base64'), file.name);
        if (i == files.target.files.length - 1) {
          this.soundsFileNames = this.soundsFileService.getSoundsFiles();
        }
      };
      fileReader.readAsDataURL(file);
    }
  }

  saveSoundsSettings() {
    this.signals.forEach(signalType => {
      this.settingsService.set(signalType.id, signalType.wav);
    });
    this.soundsService.refreshSounds();
    this.messageService.add({ severity: 'info', summary: labels.sounds_settings, detail: labels.successful_save });
  }

  resetSoundsSettings() {
    this.populateSignalsArray();
    this.messageService.add({ severity: 'warn', summary: labels.sounds_settings, detail: labels.successful_reset });
  }

  loadWorkouts() {
    this.loadedWorkouts = [{ label: labels.select_workout, value: null }];
    let workoutsFromFileSystem = this.workoutsFileService.loadWorkoutsFromFilesystem();
    workoutsFromFileSystem.forEach(file => {
      let workoutFile: WorkoutFile = workoutFileJsonToModel(file);
      this.loadedWorkouts.push({ label: workoutFile.name, value: workoutFile.workout });
    });
  }

  deleteWorkout(index: number) {
    // Using index+1 because of the first default item
    this.workoutsFileService.deleteWorkout(this.loadedWorkouts[index + 1].label);
    this.loadWorkouts();
  }

  get isWorkoutRunning(): boolean {
    return this.workoutService.isWorkoutRunning;
  }

  get isWorkoutPaused(): boolean {
    return this.workoutService.isWorkoutPaused;
  }
}
