import {Component} from '@angular/core';
import {asapScheduler, BehaviorSubject, combineLatest} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {getEvents, SourcePosition} from './state';
import {StateService} from './state/state.service';
import {Event} from '@drxjs/events';

@Component({
  selector: 'd-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class PanelComponent {
  events: Array<Event> = [];

  constructor(private readonly stateService: StateService) {
  }

  readonly selectedInstanceIdSubject = new BehaviorSubject<number>(0);
  readonly selectedEventIndexSubject = new BehaviorSubject<number>(0);

  readonly state$ = this.stateService.state$.pipe(debounceTime(0, asapScheduler));
  readonly instances$ = this.state$.pipe(map((state) => Object.values(state.instances)));
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
      map((instance) => instance ? getEvents(instance) : []),
    );
  readonly selectedEvent$ = combineLatest(
    this.selectedInstanceEvents$,
    this.selectedEventIndexSubject.asObservable(),
  ).pipe(map(([events, index]) => events[index]));

  selectInstance(instanceId: number) {
    this.selectedInstanceIdSubject.next(instanceId);
  }

  getFormattedPosition(position: SourcePosition) {
    const items : Array<string | number> = [position.file];

    if (position.line > 0) {
      items.push(position.line);
    }

    if (position.column > 0) {
      items.push(position.column);
    }

    return items.join(':');
  }

}
