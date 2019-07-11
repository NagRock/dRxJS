import {instrumentedRx, rx} from './rx';
import {Subscriber} from 'rxjs';
import {getNextObservableInstanceId} from './ids';
import {rxInspector} from './rx-inspector';
import {SubscriberEvent} from './types';


function trackSubscriber(next, error, complete) {
  const subscriber = getNextObservableInstanceId();

  const event: SubscriberEvent = {
    kind: 'subscriber',
    subscriber,
    next,
    error,
    complete
  };

  rxInspector.dispatch(event);

  return subscriber;
}

export function instrumentSubscribe() {
  const subscribe = rx.Observable.prototype.subscribe;
  instrumentedRx.Observable.prototype.subscribe = function(observerOrNext?, error?, complete?) {
    if (this.__skip_instrumentation__
      || (observerOrNext && observerOrNext.__skip_instrumentation__)
      || observerOrNext instanceof instrumentedRx.Subscriber) {
      return subscribe.call(this, observerOrNext, error, complete);
    } else {
      const subscriber = new Subscriber(observerOrNext, error, complete);
      (subscriber as any).__receiver_id__ = trackSubscriber(observerOrNext, error, complete);
      return subscribe.call(this, subscriber);
    }
  };
}
