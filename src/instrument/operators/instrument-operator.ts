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

export type InstrumentObservableInput = (input: ObservableInput<any>, wrapObserver?: (observer: Observer<any>) => Observer<any>) => void;

export interface InstrumentOperatorOptions {
  instrumentInput?: (source: any, instrument: InstrumentObservableInput) => any;
  wrapArgs?: (args: any[], instrument: InstrumentObservableInput) => any[];
}

export const instrumentOperator =
  ({
     wrapArgs = identity,
   }: InstrumentOperatorOptions = {}) =>
    <IN = any, OUT = any, ARGS extends any[] = any>(operator: RxOperator<IN, OUT, ARGS>): RxOperator<IN, OUT, ARGS> => {
      return (...args: ARGS) => {
        const definitionId = trackOperatorDefinition(operator, args);
        return (scopeStream) => new Observable((scopeObserver: Observer<any>) => {
          const senderId = trackInstance(definitionId);
          let lastReceivedNotificationId: number;
          const instrumentObservableInput: InstrumentObservableInput = (source, wrapObserver = identity) => {
            const stream = isObservable(source) ? source : from(source);
            return rx.Observable.create((observer: Observer<any>) => {
              const receiver = wrapObserver(observer) as Receiver;
              receiver.__receiver_id__ = senderId;
              receiver.__set_last_received_notification_id__ = (notificationId) => {
                lastReceivedNotificationId = notificationId;
              };
              return stream.subscribe(receiver);
            });
          };
          return rx.pipe(
            (stream: Observable<any>) => {
              return rx.Observable.create((receiver: Receiver) => {
                receiver.__receiver_id__ = senderId;
                receiver.__set_last_received_notification_id__ = (notificationId) => {
                  lastReceivedNotificationId = notificationId;
                };
                return stream.subscribe(receiver);
              });
            },
            operator(...wrapArgs(args, instrumentObservableInput) as ARGS),
            (stream: Observable<any>) =>
              rx.Observable.create((observer: Receiver & Sender) => {
                const receiverId = observer.__receiver_id__;

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
              }))(scopeStream)
            .subscribe(scopeObserver);
        });
      };
    };
