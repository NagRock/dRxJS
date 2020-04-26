import {Injectable} from '@angular/core';
import {EventsService} from './events.service';
import {filter, scan, shareReplay, switchMap, takeUntil, tap} from 'rxjs/operators';
import {handleEvent} from './model.reducer';
import {Model} from '../model/model';
import {MessageEvent} from '@doctor-rxjs/events';
import {InstrumentationState, InstrumentationStateService} from './instrumentation-state.service';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ModelService {

  readonly model$: Observable<Model>;

  constructor(
    private readonly eventsService: EventsService,
    private readonly instrumentationStateService: InstrumentationStateService,
  ) {
    const pageLoaded$ = instrumentationStateService.state$.pipe(
      filter((state) => state === InstrumentationState.PAGE_LOADED),
    );
    const pageInstrumented$ = instrumentationStateService.state$.pipe(
      filter((state) => state === InstrumentationState.PAGE_INSTRUMENTED),
    );

    this.model$ = pageInstrumented$.pipe(
      switchMap(() =>
        this.eventsService.events$.pipe(
          scan<MessageEvent, Model>(
            handleEvent,
            {
              files: {},
              declarations: [],
              observables: [],
              instances: [],
              events: [],
              tasks: [],
              currentTask: undefined,
            },
          ),
          takeUntil(pageLoaded$),
        )),
      shareReplay(1),
    );
  }
}
