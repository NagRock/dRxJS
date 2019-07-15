import {Component} from '@angular/core';
import {getState$} from './state';
import {rxInspector} from '../instrument/rx-inspector';
import {asapScheduler, BehaviorSubject, combineLatest} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {runSimpleExample} from './examples';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  readonly selectedInstanceIdSubject = new BehaviorSubject<number>(1);

  readonly state$ = getState$(rxInspector).pipe(debounceTime(0, asapScheduler));
  readonly selectedInstanceId = combineLatest(
    this.state$,
    this.selectedInstanceIdSubject.asObservable(),
  ).pipe(
    map(([state, selectedInstanceId]) => {
      return state.instances[selectedInstanceId];
    }),
  );

  constructor() {
    setTimeout(runSimpleExample);
  }

}
