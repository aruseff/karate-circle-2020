import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { labels } from '../util/labels';
var remote = window.require('electron').remote;
var electronFs = remote.require('fs');
var app = remote.app;
var process = window.require('process');

@Injectable({
    providedIn: 'root'
})
export class SoundsFileService {

    audios: any = [];
    soundsFileNames: string[] = [];
    soundsFolder: string;

    constructor(private messageService: MessageService) {
        if (process.env.PORTABLE_EXECUTABLE_DIR) {
            this.soundsFolder = process.env.PORTABLE_EXECUTABLE_DIR;
        } else {
            this.soundsFolder = app.getAppPath();
        }
        this.soundsFolder += '/sounds/';
    }

    getSoundsFiles() {
        this.refreshSounds();
        return this.soundsFileNames;
    }

    refreshSounds() {
        this.soundsFileNames = [];
        this.audios = [];
        try {
            var files = electronFs.readdirSync(this.soundsFolder);
            files.forEach(fileName => {

                let currentAudio = new Audio();
                currentAudio.src = "file:///" + this.soundsFolder.replace('\\', '/') + '/' + fileName;
                currentAudio.load();

                this.soundsFileNames.push(fileName);
                this.audios.push(currentAudio);
            });
        } catch (err) {
            // error in reading sounds folder
        }
    }

    play(index: number) {
        if (this.audios && index < this.audios.length) {
            this.audios[index].play();
        }
    }

    saveSoundFile(content: any, filename: string) {
        let path = this.soundsFolder + filename;
        try {
            electronFs.writeFileSync(path, content);
            this.messageService.add({ severity: 'success', summary: labels.sounds_settings, detail: labels.successful_save });
        } catch (err) {
            this.messageService.add({ severity: 'error', summary: labels.sounds_settings, detail: labels.generic_error });
        }
    }

}
