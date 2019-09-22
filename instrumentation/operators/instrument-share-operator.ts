import {RxOperator} from './types';
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
import {Observable, Observer} from 'rxjs';
import {Receiver, Sender} from '../types';
import {toSubscriber} from './instrument-operator';

export const instrumentShareOperator =
  <IN = any, OUT = any, ARGS extends any[] = any>(operator: RxOperator<IN, OUT, ARGS>): RxOperator<IN, OUT, ARGS> => {
    return (...args: ARGS) => {
      const definitionId = trackOperatorDefinition(operator, args);
      let senderId: number;
      let lastReceivedNotificationId: number;

      return rx.pipe(
        (stream: Observable<any>) => {
          return new rx.Observable((observer: Observer<any>) => {
            const receiver = toSubscriber(observer) as unknown as Receiver;
            receiver.__receiver_id__ = senderId;
            // this wont work perfectly for behavior and replay subjects:
            receiver.__set_last_received_notification_id__ = (notificationId) => {
              lastReceivedNotificationId = notificationId;
            };
            return stream.subscribe(receiver);
          });
        },
        operator(...args),
        (stream: Observable<any>) =>
          // @ts-ignore
          new rx.Observable((observer: Receiver & Sender) => {
            const receiverId = observer.__receiver_id__;
            if (senderId === undefined) {
              senderId = trackInstance(definitionId);
            }

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
