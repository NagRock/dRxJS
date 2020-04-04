import {Injectable} from '@angular/core';
import {InstrumentationState, InstrumentationStateService} from './instrumentation-state.service';
import {concatMap, filter, share, shareReplay, switchMap, switchMapTo, takeUntil} from 'rxjs/operators';
import {from, interval, Observable} from 'rxjs';
import {MessageEvent} from '@doctor-rxjs/events';
import {inspectedWindowEval} from '../../../../../panel/inspected-window-eval';
import {ModelService} from './model.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  readonly events$: Observable<MessageEvent>;

  constructor(
    private readonly m: ModelService,
    private readonly instrumentationStateService: InstrumentationStateService,
  ) {
    const pageLoaded$ = instrumentationStateService.state$.pipe(filter((state) => state === InstrumentationState.PAGE_LOADED));
    const pageInstrumented$ = instrumentationStateService.state$.pipe(filter((state) => state === InstrumentationState.PAGE_INSTRUMENTED));

    this.events$ = pageInstrumented$.pipe(
      switchMapTo(
        interval(1000).pipe(
          concatMap(() => from(inspectedWindowEval('__doctor_rxjs__.getEvents()'))),
          concatMap((events: MessageEvent[]) => from(events)),
          takeUntil(pageLoaded$),
        ),
      ),
      share(),
    );
  }
}
