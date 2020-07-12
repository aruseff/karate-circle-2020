import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';

var remote = window.require('electron').remote;
var app = remote.app;

@Injectable({
    providedIn: 'root'
})
export class SoundsService {

    relaxCountdownSignal: any;
    workCountdownSignal: any;
    startWorkSignal: any;
    stopWorkSignal: any;
    roundEndSignal: any;
    workoutEndSignal: any;
    workWarningSignal: any;
    relaxWarningSignal: any;

    constructor(private settingsService: SettingsService) {
        this.refreshSounds();
    }

    refreshSounds() {
        let soundsFolder = app.getAppPath() + '/sounds/';

        this.relaxCountdownSignal = new Audio();
        this.relaxCountdownSignal.src = soundsFolder + this.settingsService.get("relax_countdown");
        this.relaxCountdownSignal.load();

        this.workCountdownSignal = new Audio();
        this.workCountdownSignal.src = soundsFolder + this.settingsService.get("work_countdown");
        this.workCountdownSignal.load();

        this.startWorkSignal = new Audio();
        this.startWorkSignal.src = soundsFolder + this.settingsService.get("start_work");
        this.startWorkSignal.load();

        this.stopWorkSignal = new Audio();
        this.stopWorkSignal.src = soundsFolder + this.settingsService.get("stop_work");
        this.stopWorkSignal.load();

        this.roundEndSignal = new Audio();
        this.roundEndSignal.src = soundsFolder + this.settingsService.get("round_end");
        this.roundEndSignal.load();

        this.workoutEndSignal = new Audio();
        this.workoutEndSignal.src = soundsFolder + this.settingsService.get("workout_end");
        this.workoutEndSignal.load();

        this.workWarningSignal = new Audio();
        this.workWarningSignal.src = soundsFolder + this.settingsService.get("work_warning");
        this.workWarningSignal.load();

        this.relaxWarningSignal = new Audio();
        this.relaxWarningSignal.src = soundsFolder + this.settingsService.get("relax_warning");
        this.relaxWarningSignal.load();
    }

    playSound(key: string) {
        switch (key) {
            case "relax_countdown":
                this.relaxCountdownSignal.play();
                break;
            case "work_countdown":
                this.workCountdownSignal.play();
                break;
            case "start_work":
                this.startWorkSignal.play();
                break;
            case "stop_work":
                this.stopWorkSignal.play();
                break;
            case "round_end":
                this.roundEndSignal.play();
                break;
            case "workout_end":
                this.workoutEndSignal.play();
                break;
            case "work_warning":
                this.workWarningSignal.play();
                break;
            case "relax_warning":
                this.relaxWarningSignal.play();
                break;
            default:
                console.log(key + " not found");
        }
    }
}
