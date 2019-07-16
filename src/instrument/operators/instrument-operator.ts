import {Observable, OperatorFunction} from 'instrumented-rxjs';
import {rx} from '../rx';
import {rxInspector} from '../rx-inspector';
import {
  Cause,
  CompleteNotificationEvent,
  ErrorNotificationEvent,
  NextNotificationEvent,
  OperatorDefinitionEvent,
  InstanceEvent,
  Receiver,
  Sender,
  SubscribeEvent,
  UnsubscribeEvent
} from '../types';
import {getNextNotificationId, getNextObservableId, getNextObservableInstanceId} from '../ids';

export type RxOperator<IN = any, OUT = any, ARGS extends any[] = any[]> = (...args: ARGS) => OperatorFunction<IN, OUT>;
export type InstrumentOperator = <IN, OUT, ARGS extends any[]>(operator: RxOperator<IN, OUT, ARGS>) => RxOperator<IN, OUT, ARGS>;

// creator.instance -(sender/receiver)-> operator.instance -(sender/receiver)-> subscriber.instance

function trackOperator<IN, OUT, ARGS extends any[]>(func: RxOperator<IN, OUT, ARGS>, args: ARGS): number {
  const operator = getNextObservableId();

  const event: OperatorDefinitionEvent = {
    kind: 'operator-definition',
    definition: operator,
    func,
    args,
  };

  rxInspector.dispatch(event);

  return operator;
}

function trackOperatorInstance(operator: number): number {
  const operatorInstance = getNextObservableInstanceId();

  const event: InstanceEvent = {
    kind: 'operator-instance',
    definition: operator,
    instance: operatorInstance,
  };

  rxInspector.dispatch(event);

  return operatorInstance;
}


function trackSubscribe(sender: number, receiver: number): void {
  const event: SubscribeEvent = {
    kind: 'subscribe',
    sender,
    receiver,
  };

  rxInspector.dispatch(event);
}

function trackUnsubscribe(sender: number, receiver: number): void {
  const event: UnsubscribeEvent = {
    kind: 'unsubscribe',
    sender,
    receiver,
  };

  rxInspector.dispatch(event);
}

function trackNextNotification(sender: number, receiver: number, value: any, cause: Cause) {
  const notification = getNextNotificationId();

  const event: NextNotificationEvent = {
    kind: 'next',
    sender,
    receiver,
    notification,
    cause,
    value,
  };

  rxInspector.dispatch(event);

  return notification;
}

function trackErrorNotification(sender: number, receiver: number, error: any, cause: Cause) {
  const notification = getNextNotificationId();

  const event: ErrorNotificationEvent = {
    kind: 'error',
    sender,
    receiver,
    notification,
    cause,
    error,
  };

  rxInspector.dispatch(event);

  return notification;
}

function trackCompleteNotification(sender: number, receiver: number, cause: Cause) {
  const notification = getNextNotificationId();

  const event: CompleteNotificationEvent = {
    kind: 'complete',
    sender,
    receiver,
    notification,
    cause,
  };

  rxInspector.dispatch(event);

  return notification;
}

function getCause(notification: number, kind: 'sync' | 'async' = 'sync'): Cause {
  return {
    kind,
    notification,
  };
}

export const instrumentTransformingOperator =
  <IN = any, OUT = any, ARGS extends any[] = any>(operator: RxOperator<IN, OUT, ARGS>): RxOperator<IN, OUT, ARGS> => {
    return (...args: ARGS) => {
      const operatorId = trackOperator(operator, args);
      let lastSenderId: number;
      let lastReceivedNotificationId: number;
      return rx.pipe(
        (stream: Observable<any>) => {
          return Observable.create((receiver: Receiver) => {
            receiver.__receiver_id__ = lastSenderId;
            receiver.__set_last_received_notification_id__ = (notificationId) => {
              lastReceivedNotificationId = notificationId;
            };
            return stream.subscribe(receiver);
          });
        },
        operator(...args),
        (stream: Observable<any>) =>
          Observable.create((observer: Receiver & Sender) => {
            const senderId = trackOperatorInstance(operatorId);
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


export const instrumentOperator =
  <IN = any, OUT = any, ARGS extends any[] = any>(operator: RxOperator<IN, OUT, ARGS>): RxOperator<IN, OUT, ARGS> => {
    return (...args: ARGS) => {
      return operator(...args);
    };
  };
