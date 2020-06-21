import { Injectable } from '@angular/core';
import { timer, Subject, Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

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
        );
    }
}
