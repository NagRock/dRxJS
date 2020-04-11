import {Injectable} from '@angular/core';
import {InstrumentationState, InstrumentationStateService} from './instrumentation-state.service';
import {Router} from '@angular/router';
import {EagerSingleton} from '../eager-singletons';

@Injectable({
  providedIn: 'root'
})
export class InstrumentationStateRouterConnector implements EagerSingleton {

  constructor(
    private readonly instrumentationStateService: InstrumentationStateService,
    private readonly router: Router,
  ) {
  }

  eagerSingletonInit(): void {
    this.instrumentationStateService.state$.subscribe((state) => {
      switch (state) {
        case InstrumentationState.PAGE_LOADED:
          this.router.navigate(['']);
          break;
        case InstrumentationState.PAGE_INSTRUMENTED:
          this.router.navigate(['events']);
          break;
      }
    });
  }
}
