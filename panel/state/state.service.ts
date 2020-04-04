import {Injectable} from '@angular/core';
import {concatMap, scan, shareReplay} from 'rxjs/operators';
import {from} from 'rxjs';
import {handleEvent} from 'web-extension/src/app/services/model.reducer';
import {EventService} from '../event.service';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  readonly state$ = this.eventService.event$.pipe(
    concatMap((events) => from(events)),
    scan(handleEvent, {
      definitions: {},
      instances: {},
      events: {},
      tasks: {},
      currentTask: undefined,
    }),
    shareReplay(),
  );

  constructor(
    private readonly eventService: EventService,
  ) {
  }
}
