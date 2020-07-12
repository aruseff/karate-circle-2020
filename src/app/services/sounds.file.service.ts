import { Injectable } from '@angular/core';
var remote = window.require('electron').remote;
var electronFs = remote.require('fs');
var app = remote.app;

@Injectable({
    providedIn: 'root'
})
export class SoundsFileService {

    audios: any = [];
    soundsFileNames: string[] = [];

    getSoundsFiles() {
        this.refreshSounds();
        return this.soundsFileNames;
    }

    refreshSounds() {
        this.soundsFileNames = [];
        this.audios = [];
        let soundsFolder = app.getAppPath() + '/sounds';
        var files = electronFs.readdirSync(soundsFolder);
        files.forEach(fileName => {

            let currentAudio = new Audio();
            currentAudio.src = "file:///" + soundsFolder.replace('\\', '/') + '/' + fileName;
            currentAudio.load();

            this.soundsFileNames.push(fileName);
            this.audios.push(currentAudio);
        });
    }

    play(index: number) {
        if (this.audios && index < this.audios.length) {
            this.audios[index].play();
        }
    }

    saveSoundFile(content: any, filename: string) {
        let path = app.getAppPath() + '/sounds/' + filename;
        electronFs.writeFileSync(path, content);
    }
}
