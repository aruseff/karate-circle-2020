import { Injectable } from '@angular/core';
var remote = window.require('electron').remote;
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
        relax_warning: "VoiceWarning2.wav"
    };
    settings: any;

    constructor() {
        const userDataPath = remote.app.getPath('userData');
        this.configPath = path.join(userDataPath, 'settings.json');
        this.settings = this.parseDataFile(this.configPath, this.defaultSettings);
    }

    get(key: string) {
        return this.settings[key];
    }

    getAll() {
        return this.settings;
    }

    set(key: string, value: any) {
        this.settings[key] = value;
        fs.writeFileSync(this.configPath, JSON.stringify(this.settings));
    }

    parseDataFile(filePath: string, defaults: any) {
        try {
            return JSON.parse(fs.readFileSync(filePath));
        } catch (error) {
            return defaults;
        }
    }
}
