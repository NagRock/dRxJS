import {Component} from '@angular/core';
import {InstrumentationState, InstrumentationStateService} from '../services/instrumentation-state.service';
import {concat, EMPTY, merge, of} from 'rxjs';
import {delay, switchMap, tap} from 'rxjs/operators';

const waitingForInstrumentationTimeout = 4000;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  readonly states = {
    initial: 'initial',
    waitingForInstrumentation: 'waitingForInstrumentation',
    waitingForInstrumentationTimeout: 'waitingForInstrumentationTimeout',
  } as const;

  state$ = this.instrumentationStateService.state$.pipe(switchMap((state) => {
    switch (state) {
      case InstrumentationState.VOID:
        return of(this.states.initial);
      case InstrumentationState.PAGE_LOADED:
        return concat(
          of(this.states.waitingForInstrumentation),
          of(this.states.waitingForInstrumentationTimeout).pipe(delay(waitingForInstrumentationTimeout)),
        );
      default:
        return EMPTY;
    }
  })).pipe(tap((x) => console.log('state', x)));


  constructor(
    private readonly instrumentationStateService: InstrumentationStateService,
  ) {
  }

  reloadPage() {
    chrome.devtools.inspectedWindow.reload({});
  }
}
