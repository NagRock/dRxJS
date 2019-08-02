import {
  getCause,
  trackCompleteNotification,
  trackErrorNotification,
  trackInstance,
  trackNextNotification,
  trackOperatorDefinition,
  trackSubscribe,
  trackUnsubscribe
} from '../track';
import {rx} from '../rx';
import {from, isObservable, Observable} from 'instrumented-rxjs';
import {Receiver, Sender} from '../types';
import {RxOperator} from './types';

function instrumentArgs(args, instrument) {
  return args.map((x) => (...ys) => instrument(x(...ys)));
}

export const instrumentCombiningOperator =
  <IN = any, OUT = any, ARGS extends any[] = any>(operator: RxOperator<IN, OUT, ARGS>): RxOperator<IN, OUT, ARGS> => {
    return (...args: ARGS) => {
      const definitionId = trackOperatorDefinition(operator, args);
      let lastSenderId: number;
      let lastReceivedNotificationId: number;
      return rx.pipe(
        (stream: Observable<any>) => {
          return rx.Observable.create((receiver: Receiver) => {
            receiver.__receiver_id__ = lastSenderId;
            receiver.__set_last_received_notification_id__ = (notificationId) => {
              lastReceivedNotificationId = notificationId;
            };
            return stream.subscribe(receiver);
          });
        },
        operator(...instrumentArgs(
          args,
          (input, inputKey) => {
            const observableInput = isObservable(input) ? input : from(input);
            return rx.Observable.create((receiver: Receiver) => {
              receiver.__receiver_id__ = lastSenderId;
              receiver.__set_last_received_notification_id__ = notificationId => lastReceivedNotificationId = notificationId;
              return observableInput.subscribe(receiver);
            });
          }
        ) as ARGS),
        (stream: Observable<any>) =>
          rx.Observable.create((observer: Receiver & Sender) => {
            const senderId = trackInstance(definitionId);
            const receiverId = observer.__receiver_id__;

            lastSenderId = senderId;

            trackSubscribe(senderId, receiverId);
            const subscription = stream.subscribe({
              __skip_instrumentation__: true,
              next: (value) => {
                const notificationId = trackNextNotification(senderId, receiverId, value, getCause(lastReceivedNotificationId));
                observer.__set_last_received_notification_id__(notificationId);
                observer.next(value);
              },
              error: (error) => {
                const notificationId = trackErrorNotification(senderId, receiverId, error, getCause(lastReceivedNotificationId));
                observer.__set_last_received_notification_id__(notificationId);
                observer.error(error);
              },
              complete: () => {
                const notificationId = trackCompleteNotification(senderId, receiverId, getCause(lastReceivedNotificationId));
                observer.__set_last_received_notification_id__(notificationId);
                observer.complete();
              },
            } as any);
            return () => {
              trackUnsubscribe(senderId, receiverId);
              subscription.unsubscribe();
            };
          }));
    };

  };
