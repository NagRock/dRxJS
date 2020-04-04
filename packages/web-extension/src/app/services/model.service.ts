import {Injectable} from '@angular/core';
import {EventsService} from './events.service';
import {scan, shareReplay} from 'rxjs/operators';
import {handleEvent} from './model.reducer';


@Injectable({
  providedIn: 'root'
})
export class ModelService {

  readonly model$ = this.eventsService.events$.pipe(
    scan(
      handleEvent,
      {
        definitions: {},
        instances: {},
        events: {},
        tasks: {},
        currentTask: undefined,
      },
    ),
    shareReplay(1),
  );

  constructor(
    private readonly eventsService: EventsService,
  ) {
  }
}
