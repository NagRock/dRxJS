import {Component} from '@angular/core';
import {getEvents, getState$} from './state';
import {rxInspector} from '../instrument/rx-inspector';
import {asapScheduler, BehaviorSubject, combineLatest} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {runConcatAllExample, runConcatMapExample, runExpandExample, runSimpleExample} from './examples';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  readonly selectedInstanceIdSubject = new BehaviorSubject<number>(1);
  readonly selectedEventIndexSubject = new BehaviorSubject<number>(0);

  readonly state$ = getState$(rxInspector).pipe(debounceTime(0, asapScheduler));
  readonly selectedInstance$ = combineLatest(
    this.state$,
    this.selectedInstanceIdSubject.asObservable(),
  ).pipe(
    map(([state, selectedInstanceId]) => {
      return state.instances[selectedInstanceId];
    }),
  );
  readonly selectedInstanceEvents$ = this.selectedInstance$
    .pipe(
      map(getEvents),
    );
  readonly selectedEvent$ = combineLatest(
    this.selectedInstanceEvents$,
    this.selectedEventIndexSubject.asObservable(),
  ).pipe(map(([events, index]) => events[index]));

  constructor() {
    // setTimeout(runConcatAllExample);
    setTimeout(runConcatMapExample);
    // setTimeout(runSimpleExample);
  }
}
