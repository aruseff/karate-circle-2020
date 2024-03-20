import { Component } from '@angular/core';
import { labels } from 'src/app/config/labels';
import { SettingsService } from 'src/app/services/settings.service';
import { SoundsFileService } from 'src/app/services/sounds.file.service';
import { WorkoutFileService } from 'src/app/services/workout.file.service';
import { MessageService } from 'primeng/api';
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

  constructor(public workoutFileService: WorkoutFileService,
    private workoutService: WorkoutService,
    private settingsService: SettingsService,
    private soundsFileService: SoundsFileService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.populateSignalsArray();
    this.soundsFileNames = this.soundsFileService.getSoundsNames();
  }

  previewSound(name: string) {
    this.soundsFileService.playByName(name);
  }

  populateSignalsArray() {
    let settings = this.settingsService.settings;
    this.signals = Object.keys(settings).map((prop: any) => { return { id: prop, label: labels[prop], wav: settings[prop] } });
  }

  uploadWavFile(files: any) {
    for (let i = 0; i < files.target.files.length; i++) {
      let fileReader = new FileReader();
      let file = files.target.files[i];
      fileReader.onload = (e) => {
        this.soundsFileService.saveSoundFile(Buffer.from(fileReader.result.toString().replace('data:audio/wav;base64,', ''), 'base64'), file.name);
        if (i == files.target.files.length - 1) {
          this.soundsFileNames = this.soundsFileService.getSoundsNames();
        }
      };
      fileReader.readAsDataURL(file);
    }
  }

  saveSoundsSettings() {
    this.signals.forEach(signalType => {
      this.settingsService.set(signalType.id, signalType.wav);
    });
    this.soundsFileNames = this.soundsFileService.getSoundsNames();
    this.messageService.add({ severity: 'info', summary: labels.sounds_settings, detail: labels.successful_save });
  }

  resetSoundsSettings() {
    this.populateSignalsArray();
    this.messageService.add({ severity: 'warn', summary: labels.sounds_settings, detail: labels.successful_reset });
  }

  deleteWorkout(index: number) {
    this.workoutFileService.deleteWorkout(this.workoutFileService.workouts[index].name);
  }

  get isWorkoutRunning(): boolean {
    return this.workoutService.isWorkoutRunning;
  }

  get isWorkoutPaused(): boolean {
    return this.workoutService.isWorkoutPaused;
  }
}
