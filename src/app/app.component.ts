import {Component} from '@angular/core';
import {getState$} from './state';
import {rxInspector} from '../instrument/rx-inspector';
import {asapScheduler, BehaviorSubject, combineLatest} from 'rxjs';
import {debounceTime, map, tap} from 'rxjs/operators';
import {runSimpleExample} from './examples';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  readonly selectedObservableIdSubject = new BehaviorSubject<number>(1);

  readonly state$ = getState$(rxInspector).pipe(debounceTime(0, asapScheduler));
  readonly selectedObservable$ = combineLatest(
    this.state$,
    this.selectedObservableIdSubject.asObservable(),
  ).pipe(
    map(([state, selectedObservableId]) => {
      return state.senders[selectedObservableId];
    }),
  );

  constructor() {
    setTimeout(runSimpleExample);
  }

}
