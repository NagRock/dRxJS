import {Injectable} from '@angular/core';
import {from, interval, ReplaySubject} from 'rxjs';
import {concatMap, filter, map, tap} from 'rxjs/operators';
import {Event} from '@doctor-rxjs/events';
import {inspectedWindowEval} from './inspected-window-eval';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly flushFuncName = '___dRxJS_flushBuffer()';
  private readonly _events$: ReplaySubject<Array<Event>> = new ReplaySubject();

  constructor() {
    interval(1000)
      .pipe(
        tap(() => console.log('call flush')),
        concatMap(() => from(inspectedWindowEval(this.flushFuncName))),
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
