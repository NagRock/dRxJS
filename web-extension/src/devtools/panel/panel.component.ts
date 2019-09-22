import {Component} from '@angular/core';
import {asapScheduler, BehaviorSubject, combineLatest, from, interval} from 'rxjs';
import {browser} from '../../types/webextension-polyfill-ts';
import {debounceTime, map, switchMap} from 'rxjs/operators';
import {RxInstanceInspectorEvent, RxSourceMappedInspectorEvent} from '../event.service';
import {getEvents} from './state';
import {StateService} from './state/state.service';

@Component({
  selector: 'd-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class PanelComponent {
  events: Array<RxInstanceInspectorEvent | RxSourceMappedInspectorEvent> = [];

  constructor(private readonly stateService: StateService) {
  }

  readonly selectedInstanceIdSubject = new BehaviorSubject<number>(30);
  readonly selectedEventIndexSubject = new BehaviorSubject<number>(0);

  readonly state$ = this.stateService.state$.pipe(debounceTime(0, asapScheduler));
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
}
