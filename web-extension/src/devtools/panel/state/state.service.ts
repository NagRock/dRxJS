import {Injectable} from '@angular/core';
import {EventService} from '../../event.service';
import {concatMap, map} from 'rxjs/operators';
import {from} from 'rxjs';
import {state} from './reducer';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  readonly state$ = this.eventService.event$.pipe(
    concatMap((events) => from(events)),
    map((event) => event.originalEvent),
    state(),
  );

  constructor(
    private readonly eventService: EventService,
  ) {
  }
}
