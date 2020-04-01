import {Component, HostListener} from '@angular/core';
import {asapScheduler, BehaviorSubject, combineLatest} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {getEvents, SourcePosition} from './state';
import {StateService} from './state/state.service';
import {MessageEvent} from '@doctor-rxjs/events';

@Component({
  selector: 'd-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class PanelComponent {
  events: Array<MessageEvent> = [];

  constructor(private readonly stateService: StateService) {
  }

  readonly selectedInstanceIdSubject = new BehaviorSubject<number>(undefined);
  readonly selectedEventIndexSubject = new BehaviorSubject<number>(undefined);
  readonly showContextConnectionsSubject$ = new BehaviorSubject<boolean>(false);

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
  readonly selectedInstanceEvents$ = combineLatest(
    this.selectedInstance$,
    this.showContextConnectionsSubject$,
  ).pipe(
    map(([instance, showContextConnections]) => instance ? getEvents(instance, showContextConnections) : []),
  );
  readonly selectedEvent$ = combineLatest(
    this.selectedInstanceEvents$,
    this.selectedEventIndexSubject.asObservable(),
  ).pipe(map(([events, index]) => events[index]));

  selectInstance(instanceId: number) {
    this.selectedInstanceIdSubject.next(instanceId);
  }

  getFormattedPosition(position: SourcePosition) {
    const items: Array<string | number> = [position.file];

    if (position.line > 0) {
      items.push(position.line);
    }

    if (position.column > 0) {
      items.push(position.column);
    }

    return items.join(':');
  }

  @HostListener('document:keydown.space', ['$event'])
  onSpaceKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    this.selectedEventIndexSubject.next(this.selectedEventIndexSubject.getValue() + 1);
  }
}
