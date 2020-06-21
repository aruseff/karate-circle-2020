import { Injectable, EventEmitter } from '@angular/core';
import { timer, Subject, Observable } from 'rxjs';
import { map, take, filter, tap, takeWhile } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TimerService {

    everySecond: Observable<number> = timer(500, 1000);
    finished: Subject<void> = new Subject();

    startTimer(countdownStart: number) {
        return this.everySecond.pipe(
            map(i => countdownStart - i),
            takeWhile(remainingTime => remainingTime >= 0),
            tap(remainingTime => {
                if (remainingTime <= 0) {
                    return this.delay(0);
                }
            })
        );
    }

    delay(seconds: number) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
}

