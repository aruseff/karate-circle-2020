import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SoundsService {

    audioShort: any;
    audioLong: any;

    constructor() {
        this.audioShort = new Audio();
        this.audioShort.src = "../../../assets/audio/short.wav";
        this.audioShort.load();

        this.audioLong = new Audio();
        this.audioLong.src = "../../../assets/audio/long.wav";
        this.audioLong.load();
    }

    playShortSound() {
        this.audioShort.play();
    }

    playLongSound() {
        this.audioLong.play();
    }
}
