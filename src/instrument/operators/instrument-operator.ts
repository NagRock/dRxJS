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
import {from, identity, isObservable, noop, Observable, ObservableInput, Observer} from 'instrumented-rxjs';
import {Receiver, Sender} from '../types';
import {RxOperator} from './types';

export type InstrumentObservableInput = (input: ObservableInput<any>, inputKey?: number | string) => void;

export interface InstrumentOperatorOptions {
  instrumentInput?: (source: any, instrument: InstrumentObservableInput) => any;
  instrumentArgs?: (args: any[], instrument: InstrumentObservableInput) => any[];
  onReceived?: (inputKey: number | string, notificationId: number) => void;
  onSend?: (notificationId: number) => void;
}

export const instrumentOperator =
  ({
     instrumentInput = identity,
     instrumentArgs = identity,
     onReceived = noop,
     onSend = noop,
   }: InstrumentOperatorOptions = {}) =>
    <IN = any, OUT = any, ARGS extends any[] = any>(operator: RxOperator<IN, OUT, ARGS>): RxOperator<IN, OUT, ARGS> => {
      return (...args: ARGS) => {
        const definitionId = trackOperatorDefinition(operator, args);
        return (scopeStream) => new Observable((scopeObserver: Observer<any>) => {
          const senderId = trackInstance(definitionId);
          let lastReceivedNotificationId: number;
        return rx.pipe(
          (stream: Observable<any>) => {
            return rx.Observable.create((receiver: Receiver) => {
              receiver.__receiver_id__ = senderId;
              receiver.__set_last_received_notification_id__ = (notificationId) => {
                lastReceivedNotificationId = notificationId;
                onReceived(null, notificationId);
              };
              return stream.subscribe(receiver);
            });
          },
          operator(...instrumentArgs(
            args,
            (input, inputKey) => {
              const observableInput = isObservable(input) ? input : from(input);
              return rx.Observable.create((receiver: Receiver) => {
                receiver.__receiver_id__ = senderId;
                receiver.__set_last_received_notification_id__ = (notificationId) => {
                  lastReceivedNotificationId = notificationId;
                  onReceived(inputKey, notificationId);
                };
                return observableInput.subscribe(receiver);
              });
            }
          ) as ARGS),
            (stream: Observable<any>) =>
              rx.Observable.create((observer: Receiver & Sender) => {
                const receiverId = observer.__receiver_id__;

                trackSubscribe(senderId, receiverId);
                const subscription = stream.subscribe({
                  __skip_instrumentation__: true,
                  next: (value) => {
                    const notificationId = trackNextNotification(senderId, receiverId, value, getCause(lastReceivedNotificationId));
                    onSend(notificationId);
                    observer.__set_last_received_notification_id__(notificationId);
                    observer.next(value);
                  },
                  error: (error) => {
                    const notificationId = trackErrorNotification(senderId, receiverId, error, getCause(lastReceivedNotificationId));
                    onSend(notificationId);
                    observer.__set_last_received_notification_id__(notificationId);
                    observer.error(error);
                  },
                  complete: () => {
                    const notificationId = trackCompleteNotification(senderId, receiverId, getCause(lastReceivedNotificationId));
                    onSend(notificationId);
                    observer.__set_last_received_notification_id__(notificationId);
                    observer.complete();
                  },
                } as any);
                return () => {
                  trackUnsubscribe(senderId, receiverId);
                  subscription.unsubscribe();
                };
              }))(scopeStream)
            .subscribe(scopeObserver);
        });
      };
    };
