import {Observable} from 'instrumented-rxjs';
import {
  trackCompleteNotification,
  trackCreatorDefinition,
  trackErrorNotification,
  trackInstance,
  trackNextNotification,
  trackSubscribe,
  trackUnsubscribe
} from '../track';
import {rx} from '../rx';
import {Receiver, Sender} from '../types';

export type RxCreator<OUT = any, ARGS extends any[] = any[]> = (...args: ARGS) => Observable<OUT>;
export type InstrumentRxCreator = <OUT, ARGS extends any[]>(creator: RxCreator<OUT, ARGS>) => RxCreator<OUT, ARGS>;

export const instrumentCreator =
  <OUT = any, ARGS extends any[] = any>(creator: RxCreator<OUT, ARGS>): RxCreator<OUT, ARGS> => {
    return (...args: ARGS) => {
      const definitionId = trackCreatorDefinition(creator, args);
      return rx.Observable.create((observer: Receiver & Sender) => {
        const senderId = trackInstance(definitionId);
        const receiverId = observer.__receiver_id__;

        trackSubscribe(senderId, receiverId);
        const subscription = creator(...args).subscribe({
          __skip_instrumentation__: true,
          next: (value) => {
            const notificationId = trackNextNotification(senderId, receiverId, value, undefined);
            observer.__set_last_received_notification_id__(notificationId);
            observer.next(value);
          },
          error: (error) => {
            const notificationId = trackErrorNotification(senderId, receiverId, error, undefined);
            observer.__set_last_received_notification_id__(notificationId);
            observer.error(error);
          },
          complete: () => {
            const notificationId = trackCompleteNotification(senderId, receiverId, undefined);
            observer.__set_last_received_notification_id__(notificationId);
            observer.complete();
          },
        } as any);
        return () => {
          trackUnsubscribe(senderId, receiverId);
          subscription.unsubscribe();
        };
      });
    };
  };
