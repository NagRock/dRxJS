import {instrumentedRx, rx} from './rx';
import {Receiver} from './types';
import {trackInstance, trackSubscribeDefinition} from './track';


export function instrumentSubscribe() {
  const subscribe = rx.Observable.prototype.subscribe;
  instrumentedRx.Observable.prototype.subscribe = function(observerOrNext?, error?, complete?) {
    if (this.__skip_instrumentation__
      || (observerOrNext && observerOrNext.__skip_instrumentation__)
      || observerOrNext instanceof instrumentedRx.Subscriber
    // || (observerOrNext && observerOrNext.__receiver_id__ !== undefined) // todo: ??
    ) {
      return subscribe.call(this, observerOrNext, error, complete);
    } else {
      const subscriber = new instrumentedRx.Subscriber(observerOrNext, error, complete);
      const receiver = subscriber as any as Receiver;
      const definitionId = trackSubscribeDefinition([observerOrNext, error, complete]);
      receiver.__receiver_id__ = trackInstance(definitionId);
      receiver.__set_last_received_notification_id__ = () => {
      }; // todo: set cause for callback functions
      return subscribe.call(this, subscriber);
    }
  };
}
