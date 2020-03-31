import {Injectable, NgZone} from '@angular/core';
import {ContentScriptMessage, ContentScriptMessageType, DevtoolsMessage, DevtoolsMessageType} from '../../messages';
import {BehaviorSubject} from 'rxjs';
import {EagerSingleton} from '../eager-singletons';

export const enum InstrumentationState {
  VOID = 'VOID',
  PAGE_LOADED = 'PAGE_LOADED',
  PAGE_INSTRUMENTED = 'PAGE_INSTRUMENTED',
}

@Injectable({
  providedIn: 'root'
})
export class InstrumentationStateService implements EagerSingleton {
  private readonly stateSubject = new BehaviorSubject<InstrumentationState>(InstrumentationState.VOID);
  readonly state$ = this.stateSubject.asObservable();

  constructor(
    private readonly ngZone: NgZone,
  ) {
  }


  eagerSingletonInit(): void {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (sender.tab.id === chrome.devtools.inspectedWindow.tabId && typeof request === 'object') {
        this.ngZone.run(() => this.onMessage(request, sendResponse));
      }
    });
  }

  private onMessage(request: ContentScriptMessage, sendResponse: (response: DevtoolsMessage) => void) {
    switch (request.message) {
      case ContentScriptMessageType.LOADED:
        this.stateSubject.next(InstrumentationState.PAGE_LOADED);
        sendResponse({
          message: DevtoolsMessageType.READY,
        });
        break;
      case ContentScriptMessageType.INSTRUMENTED:
        this.stateSubject.next(InstrumentationState.PAGE_INSTRUMENTED);
        break;
    }
  }
}
