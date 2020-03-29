import {Injectable} from '@angular/core';
import {concatMap, shareReplay} from 'rxjs/operators';
import {from} from 'rxjs';
import {state} from './reducer';
import {EventService} from '../event.service';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  readonly state$ = this.eventService.event$.pipe(
    concatMap((events) => from(events)),
    state(),
    shareReplay(),
  );

  constructor(
    private readonly eventService: EventService,
  ) {
  }
}
