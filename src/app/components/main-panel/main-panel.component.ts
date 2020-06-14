import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { loadWorkoutsFromFilesystem, checkIfFileExists, saveFile } from 'src/app/util/files';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainPanelComponent implements OnInit {

  lastSignalOptions: any[] = [
    {
      label: "Last 20[s]",
      value: "last20"
    },
    {
      label: "Last 10[s]",
      value: "last10"
    },
    {
      label: "Last 5[s]",
      value: "last5"
    }
  ];
  lastSignalSelected: boolean[] = [true, true, true];

  loadedWorkouts: any[] = [{ label: 'Select workout', value: null }];
  selectedWorkout: any;

  roundsInput: number = 3;
  delayInput: number = 10;

  basesInput: number[] = [];
  relaxesInput: number[] = [];
  roundsTabs: any[] = [];

  whole: number = 120;
  time: number = 120;
  round: number = 0;
  base: number = 0;

  saveWorkoutInput: string = '';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.updateInputs();
    this.loadWorkouts();
  }

  loadWorkouts() {
    let workoutsFromFileSystem = loadWorkoutsFromFilesystem();
    workoutsFromFileSystem.forEach(file => {
      var fileJson = JSON.parse(file);
      this.loadedWorkouts.push({ label: fileJson.name, value: fileJson.workout });
    });
  }

  selectWorkout(workout) {
    if (workout) {
      this.lastSignalSelected = workout.lastSignalSelected;
      this.roundsInput = workout.roundsCount;
      this.delayInput = workout.delay ? workout.delay : 10;

      this.basesInput = workout.basesCount
      this.relaxesInput = workout.relaxes;
      this.roundsTabs = new Array(this.roundsInput).fill([]);

      this.roundsTabs.forEach((element, index) => {
        this.basesInputChange(index);
      });
    }
  }

  roundsInputChange() {
    this.updateInputs();
  }

  basesInputChange(index: number) {
    this.roundsTabs[index] = new Array(this.basesInput[index]).fill(0);
  }

  updateInputs() {
    this.basesInput = new Array(this.roundsInput).fill(1);
    this.relaxesInput = new Array(this.roundsInput > 0 ? this.roundsInput - 1 : 0).fill(0);
    this.roundsTabs = new Array(this.roundsInput).fill([]);

    this.roundsTabs.forEach((element, index) => {
      this.basesInputChange(index);
    });
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  startWorkout() {
    // let content = electronFs.readFileSync("C:\\Users\\arusev\\Downloads\\workout.json", 'utf8');
    // console.log(content);

  }

  resetWorkout() {

  }

  saveWorkout() {
    if (!this.saveWorkoutInput || this.saveWorkoutInput.trim() == '') {
      this.messageService.add({ severity: 'error', summary: 'Save workout', detail: 'Please enter valid name' });
      return;
    }
    if (checkIfFileExists(this.saveWorkoutInput.trim())) {
      this.messageService.add({ severity: 'error', summary: 'Save workout', detail: 'File with such name already exists' });
      return;
    }

    let workoutFile = this.createWorkoutFile();
    workoutFile.name = this.saveWorkoutInput.trim();
    saveFile(this.saveWorkoutInput.trim(), workoutFile);
    this.messageService.add({ severity: 'success', summary: 'Save workout', detail: 'Successfully saved' });

  }

  createWorkoutFile(): any {
    let workout: any = {};
    workout.lastSignalSelected = this.lastSignalSelected;
    workout.roundsCount = this.roundsInput;
    workout.delay = this.delayInput;
    workout.basesCount = this.basesInput;
    workout.relaxes = this.relaxesInput;
    let workoutFile: any = {};
    workoutFile.workout = workout;
    return workoutFile;
  }
}

