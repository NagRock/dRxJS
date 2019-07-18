import {
  getCause,
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
import {RxCreator} from './types';
import {isObservable, Observable, ObservableInput} from 'instrumented-rxjs';

function instrumentObservableInputs<ARGS extends any[]>(
  inputs: ARGS, senderId: number, setLastReceivedNotificationId: (notificationId) => void,
): ARGS {
  return inputs.map((input) => {
    if (isObservable(input)) {
      return rx.Observable.create((receiver: Receiver) => {
        receiver.__receiver_id__ = senderId;
        receiver.__set_last_received_notification_id__ = setLastReceivedNotificationId;
        return input.subscribe(receiver);
      });
    } else {
      return input;
    }
  }) as ARGS;
}

export const instrumentCombiningCreator =
  <OUT = any, ARGS extends any[] = any>(creator: RxCreator<OUT, ARGS>): RxCreator<OUT, ARGS> => {
    return (...args: ARGS) => {
      const definitionId = trackCreatorDefinition(creator, args);
      let lastReceivedNotificationId: number;
      return rx.Observable.create((observer: Receiver & Sender) => {
        const senderId = trackInstance(definitionId);
        const receiverId = observer.__receiver_id__;

        trackSubscribe(senderId, receiverId);
        const instrumentedArgs = instrumentObservableInputs(args, senderId, (notificationId => lastReceivedNotificationId = notificationId));
        const subscription = creator(...instrumentedArgs).subscribe({
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
      });
    };
  };
