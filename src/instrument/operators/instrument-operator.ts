import {Observable, Observer, OperatorFunction, pipe} from 'rxjs';
import {rxOperators} from '../rx';
import {rxInspector} from '../rx-inspector';

export type RxOperator<IN = any, OUT = any, ARGS extends any[] = any[]> = (...args: ARGS) => OperatorFunction<IN, OUT>;
export type InstrumentOperator = <IN, OUT, ARGS extends any[]>(operator: RxOperator<IN, OUT, ARGS>) => RxOperator<IN, OUT, ARGS>;

export interface SyncCause {
  kind: 'sync';
  notification: number;
}

export interface AsyncCause {
  kind: 'async';
  notification: number;
}

export type Cause = SyncCause | AsyncCause;

export interface ObservableOperatorEvent {
  kind: 'observable:operator';
  observable: number;
  operator: RxOperator;
  args: any[];
}

export interface ObserverEvent {
  kind: 'observer';
  observable: number;
  observer: number;
  destination: number;
}

export interface SubscribeEvent {
  kind: 'subscribe';
  observer: number;
}

export interface UnsubscribeEvent {
  kind: 'unsubscribe';
  observer: number;
}

export interface NextNotificationEvent {
  kind: 'notification:next';
  observer: number;
  notification: number;
  cause: Cause;
  value: any;
}

export interface ErrorNotificationEvent {
  kind: 'notification:error';
  observer: number;
  notification: number;
  cause: Cause;
  error: any;
}

export interface CompleteNotificationEvent {
  kind: 'notification:complete';
  observer: number;
  notification: number;
  cause: Cause;
}

export type Event
  = ObservableOperatorEvent
  | ObserverEvent
  | SubscribeEvent
  | UnsubscribeEvent
  | NextNotificationEvent
  | ErrorNotificationEvent
  | CompleteNotificationEvent;

let nextObservableId = 0;
let nextObserverId = 0;
let nextNotificationId = 0;

const destinations: number[][] = [];
const lastReceivedNotifications: number[] = [];

interface InstrumentedObserver extends Observer<any> {
  __id__: number;
  __last_received_notification_id__: number;
  destination: InstrumentedObserver;
}

function getDestination(observer: InstrumentedObserver): InstrumentedObserver | undefined {
  return observer.__id__ !== undefined
    ? observer
    : observer.destination !== undefined
      ? getDestination(observer.destination)
      : undefined;
}

function trackOperatorObservable<IN, OUT, ARGS extends any[]>(operator: RxOperator<IN, OUT, ARGS>, args: ARGS): number {
  const observable = nextObservableId++;

  const event: ObservableOperatorEvent = {
    kind: 'observable:operator',
    observable,
    operator,
    args,
  };

  rxInspector.dispatch(event);
  // StackTrace.get().then((stacktrace) => {
  //   rxInspector.dispatch({
  //     kind: 'operator:details',
  //     stacktrace,
  //   });
  // });

  return observable;
}

function trackObserver(observable: number, observer: Observer<any>): number {
  const instrumentedObserver = observer as InstrumentedObserver;
  if (instrumentedObserver.__id__) {
    // already instrumented by Observable.prototype.subscribe or by next operator
    return instrumentedObserver.__id__;
  } else {
    instrumentedObserver.__id__ = nextObserverId++;

    const destination = getDestination(instrumentedObserver);
    destinations.push([destination.__id__]);

    const event: ObserverEvent = {
      kind: 'observer',
      observable,
      observer: instrumentedObserver.__id__,
      destination: destination.__id__,
    };

    rxInspector.dispatch(event);

    return instrumentedObserver.__id__;
  }
}


function trackSubscribe(observer: number): void {
  const event: SubscribeEvent = {
    kind: 'subscribe',
    observer,
  };

  rxInspector.dispatch(event);
}

function trackUnsubscribe(observer: number): void {
  const event: UnsubscribeEvent = {
    kind: 'unsubscribe',
    observer,
  };

  rxInspector.dispatch(event);
}

function setLastReceivedNotification(observer: number, notification) {
  for (const destination of destinations[observer]) {
    lastReceivedNotifications[destination] = notification;
  }
}

function trackNextNotification(observer: number, value: any, cause: Cause) {
  const notification = nextNotificationId++;

  const event: NextNotificationEvent = {
    kind: 'notification:next',
    observer,
    notification,
    cause,
    value,
  };

  setLastReceivedNotification(observer, notification);

  rxInspector.dispatch(event);

  return notification;
}

function trackErrorNotification(observer: number, error: any, cause: Cause) {
  const notification = nextNotificationId++;

  const event: ErrorNotificationEvent = {
    kind: 'notification:error',
    observer,
    notification,
    cause,
    error,
  };

  setLastReceivedNotification(observer, notification);

  rxInspector.dispatch(event);

  return notification;
}

function trackCompleteNotification(observer: number, cause: Cause) {
  const notification = nextNotificationId++;

  const event: CompleteNotificationEvent = {
    kind: 'notification:complete',
    observer,
    notification,
    cause,
  };

  setLastReceivedNotification(observer, notification);

  rxInspector.dispatch(event);

  return notification;
}

function getSyncCause(observer: number): SyncCause {
  const notification = lastReceivedNotifications[observer];
  return {
    kind: 'sync',
    notification,
  };
}

export const instrumentTransformingOperator =
  <IN = any, OUT = any, ARGS extends any[] = any>(operator: RxOperator<IN, OUT, ARGS>): RxOperator<IN, OUT, ARGS> => {
    return (...args: ARGS) => {
      const observableId = trackOperatorObservable(operator, args);
      return pipe(
        operator(...args),
        (stream: Observable<any>) => {
          return Observable.create((observer) => {
            const observerId = trackObserver(observableId, observer);
            trackSubscribe(observerId);
            const sub = stream
              .pipe(
                rxOperators.tap({
                  next: (value) => trackNextNotification(observerId, value, getSyncCause(observerId)),
                  error: (error) => trackErrorNotification(observerId, error, getSyncCause(observerId)),
                  complete: () => trackCompleteNotification(observerId, getSyncCause(observerId)),
                })
              )
              .subscribe(observer);

            return () => {
              trackUnsubscribe(observerId);
              sub.unsubscribe();
            };
          });
        });
    };
  };


export const instrumentOperator =
  <IN = any, OUT = any, ARGS extends any[] = any>(operator: RxOperator<IN, OUT, ARGS>): RxOperator<IN, OUT, ARGS> => {
    return (...args: ARGS) => {
      return operator(...args);
    };
  };
