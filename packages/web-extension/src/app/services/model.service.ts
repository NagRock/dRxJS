import {Injectable} from '@angular/core';
import {EventsService} from './events.service';
import {scan, shareReplay} from 'rxjs/operators';
import {handleEvent} from './model.reducer';
import {Model} from '../model/model';
import {MessageEvent} from '@doctor-rxjs/events';


@Injectable({
  providedIn: 'root'
})
export class ModelService {

  readonly model$ = this.eventsService.events$.pipe(
    scan<MessageEvent, Model>(
      handleEvent,
      {
        definitions: [],
        instances: [],
        events: [],
        tasks: [],
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
