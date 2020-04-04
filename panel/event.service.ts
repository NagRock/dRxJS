import {Injectable} from '@angular/core';
import {from, interval, ReplaySubject} from 'rxjs';
import {concatMap, filter, tap} from 'rxjs/operators';
import {MessageEvent} from '@doctor-rxjs/events';
import {inspectedWindowEval} from './inspected-window-eval';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly _events$: ReplaySubject<Array<MessageEvent>> = new ReplaySubject();

  constructor() {
    interval(1000)
      .pipe(
        tap(() => console.log('call flush')),
        concatMap(() => from(inspectedWindowEval('__doctor_rxjs__.getEvents()'))),
        filter(events => events && events.length !== 0),
      )
      .subscribe(events => {
        this._events$.next(events);
      });
  }

  get event$() {
    return this._events$;
  }
}
