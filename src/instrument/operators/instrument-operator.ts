import {Observable, Observer, OperatorFunction, pipe} from 'rxjs';
import {rxOperators} from '../rx';
import {rxInspector} from '../rx-inspector';

export type RxOperator<IN = any, OUT = any, ARGS extends any[] = any[]> = (...args: ARGS) => OperatorFunction<IN, OUT>;
export type InstrumentOperator = <IN, OUT, ARGS extends any[]>(operator: RxOperator<IN, OUT, ARGS>) => RxOperator<IN, OUT, ARGS>;

// creator.instance -(sender/receiver)-> operator.instance -(sender/receiver)-> subscriber.instance

export interface Cause {
  kind: 'sync' | 'async';
  notification: number;
}

export interface OperatorEvent {
  kind: 'operator';
  operator: number;
  func: (...args: any[]) => OperatorFunction<any, any>;
  args: any[];
}

export interface OperatorInstanceEvent {
  kind: 'operator-instance';
  operator: number;
  operatorInstance: number;
}

export interface SubscribeEvent {
  kind: 'subscribe';
  sender: number;
  receiver: number;
}

export interface UnsubscribeEvent {
  kind: 'unsubscribe';
  sender: number;
  receiver: number;
}

export interface NextNotificationEvent {
  kind: 'notification:next';
  sender: number;
  receiver: number;
  notification: number;
  cause: Cause;
  value: any;
}

export interface ErrorNotificationEvent {
  kind: 'notification:error';
  sender: number;
  receiver: number;
  notification: number;
  cause: Cause;
  error: any;
}

export interface CompleteNotificationEvent {
  kind: 'notification:complete';
  sender: number;
  receiver: number;
  notification: number;
  cause: Cause;
}

export type Event
  = OperatorEvent
  | OperatorInstanceEvent
  | SubscribeEvent
  | UnsubscribeEvent
  | NextNotificationEvent
  | ErrorNotificationEvent
  | CompleteNotificationEvent;

let nextObservableId = 0;
let nextObservableInstanceId = 0;
let nextNotificationId = 0;

interface ObserverWithDestination extends Observer<any> {
  destination: ObserverWithDestination;
}

interface Receiver extends ObserverWithDestination {
  __receiver_id__: number;

  __set_last_received_notification_id__(notificationId: number): void;
}

interface Sender extends ObserverWithDestination {
  __sender_id__: number;
}

function getSender(candidate: ObserverWithDestination): Sender {
  if ((candidate as Sender).__sender_id__ !== undefined) {
    return candidate as Sender;
  } else {
    if (candidate.destination !== undefined) {
      return getSender(candidate.destination);
    } else {
      throw new Error('sender not found');
    }
  }
}

function trackOperator<IN, OUT, ARGS extends any[]>(func: RxOperator<IN, OUT, ARGS>, args: ARGS): number {
  const operator = nextObservableId++;

  const event: OperatorEvent = {
    kind: 'operator',
    operator,
    func,
    args,
  };

  rxInspector.dispatch(event);

  return operator;
}

function trackOperatorInstance(operator: number): number {
  const operatorInstance = nextObservableInstanceId++;

  const event: OperatorInstanceEvent = {
    kind: 'operator-instance',
    operator,
    operatorInstance,
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
  const notification = nextNotificationId++;

  const event: NextNotificationEvent = {
    kind: 'notification:next',
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
  const notification = nextNotificationId++;

  const event: ErrorNotificationEvent = {
    kind: 'notification:error',
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
  const notification = nextNotificationId++;

  const event: CompleteNotificationEvent = {
    kind: 'notification:complete',
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
      let lastReceivedNotificationId: number;
      return pipe(
        (stream: Observable<any>) => {
          return Observable.create((receiver: Receiver) => {
            const sender = getSender(receiver.destination);
            receiver.__receiver_id__ = sender.__sender_id__;
            receiver.__set_last_received_notification_id__ = (notificationId) => {
              lastReceivedNotificationId = notificationId;
            };
            return stream.subscribe(receiver);
          });
        },
        operator(...args),
        (stream: Observable<any>) =>
          Observable.create((observer: Receiver & Sender) => {
            observer.__sender_id__ = trackOperatorInstance(operatorId);
            const {__sender_id__: senderId, __receiver_id__: receiverId} = observer;

            trackSubscribe(senderId, receiverId);
            const subscription = stream.subscribe({
              __skip_subscribe_instrumentation_: true,
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
