import { Injectable } from '@angular/core';
import {InstrumentationState, InstrumentationStateService} from './instrumentation-state.service';
import {filter, switchMap, switchMapTo} from 'rxjs/operators';
import {interval, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  readonly events$: Observable<any>;

  constructor(
    private readonly instrumentationStateService: InstrumentationStateService,
  ) {
    const pageLoaded$ = instrumentationStateService.state$.pipe(filter((state) => state === InstrumentationState.PAGE_LOADED));
    const pageInstrumented$ = instrumentationStateService.state$.pipe(filter((state) => state === InstrumentationState.PAGE_INSTRUMENTED));

    pageInstrumented$.pipe(
      switchMapTo(
        interval(1000).pipe()
      )
    )
  }
}
