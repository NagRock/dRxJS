import {Injectable} from '@angular/core';
import {from, interval, ReplaySubject} from "rxjs";
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {browser} from "../types/webextension-polyfill-ts";
import {Event} from '@drxjs/events';

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
        switchMap(() => from(browser.devtools.inspectedWindow.eval(this.flushFuncName))),
        map(data => data[0]),
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
