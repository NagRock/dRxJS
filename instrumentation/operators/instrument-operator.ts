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
import {instrumentedRx, rx} from '../rx';
import {Observable, ObservableInput, Observer, Subscriber} from 'rxjs';
import {Receiver, Sender} from '../types';
import {RxOperator} from './types';

export const toSubscriber = (observer: Observer<any> | Subscriber<any>): Subscriber<any> => {
  if (observer instanceof Subscriber) {
    return observer;
  } else {
    return new rx.Subscriber(observer);
  }
};

export type InstrumentObservableInput = (input: ObservableInput<any>, wrapObserver?: (observer: Observer<any>) => Observer<any>) => void;

export interface InstrumentOperatorOptions {
  wrapArgs?: (args: any[], instrument: InstrumentObservableInput) => any[];
  wrapReceiver?: (observer: Observer<any>, instrument: InstrumentObservableInput) => Observer<any>;
  wrapSender?: (observer: Observer<any>) => Observer<any>;
}

export const instrumentOperator =
  ({
     wrapArgs = rx.identity,
     wrapReceiver = rx.identity,
   }: InstrumentOperatorOptions = {}) =>
    <IN = any, OUT = any, ARGS extends any[] = any>(operator: RxOperator<IN, OUT, ARGS>): RxOperator<IN, OUT, ARGS> => {
      return (...args: ARGS) => {
        const definitionId = trackOperatorDefinition(operator, args);
        return (scopeStream) => new rx.Observable((scopeObserver: Observer<any>) => {
          const senderId = trackInstance(definitionId);
          let lastReceivedNotificationId: number;
          const instrumentObservableInput: InstrumentObservableInput = (source, wrapObserver = rx.identity) => {
            const stream = rx.isObservable(source) ? source : instrumentedRx.from(source);
            return rx.Observable.create((observer: Observer<any>) => {
              const receiver = toSubscriber(wrapObserver(observer)) as unknown as Receiver;
              receiver.__receiver_id__ = senderId;
              receiver.__set_last_received_notification_id__ = (notificationId) => {
                lastReceivedNotificationId = notificationId;
              };
              return stream.subscribe(receiver);
            });
          };
          return rx.pipe(
            (stream: Observable<any>) => {
              return new rx.Observable((observer: Observer<any>) => {
                const receiver = toSubscriber(wrapReceiver(observer, instrumentObservableInput)) as unknown as Receiver;
                receiver.__receiver_id__ = senderId;
                receiver.__set_last_received_notification_id__ = (notificationId) => {
                  lastReceivedNotificationId = notificationId;
                };
                return stream.subscribe(receiver);
              });
            },
            operator(...wrapArgs(args, instrumentObservableInput) as ARGS),
            (stream: Observable<any>) =>
              // @ts-ignore
              new rx.Observable((observer: Receiver & Sender) => {
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
