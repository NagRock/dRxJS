import {Observable, Observer, OperatorFunction, pipe} from 'rxjs';
import {rxOperators} from '../rx';
import {rxInspector} from '../rx-inspector';
import * as StackTrace from 'stacktrace-js';

export type RxOperator<IN = any, OUT = any, ARGS extends any[] = any[]> = (...args: ARGS) => OperatorFunction<IN, OUT>;
export type InstrumentOperator = <IN, OUT, ARGS extends any[]>(operator: RxOperator<IN, OUT, ARGS>) => RxOperator<IN, OUT, ARGS>;

interface SyncCause {
  kind: 'sync';
  notification: number;
}

interface AsyncCause {
  kind: 'async';
  notification: number;
}

type Cause = SyncCause | AsyncCause;

interface OperatorEvent {
  kind: 'operator';
  observable: number;
  operator: RxOperator;
  args: any[];
}

interface SubscribeEvent {
  kind: 'subscribe';
  observable: number;
  source: number;
  destination: number;
}

interface UnsubscribeEvent {
  kind: 'unsubscribe';
  source: number;
  destination: number;
}

interface NextNotificationEvent {
  kind: 'next';
  notification: number;
  value: any;
  source: number;
  destination: number;
  cause?: Cause;
}

interface ErrorNotificationEvent {
  kind: 'error';
  notification: number;
  error: any;
  source: number;
  destination: number;
  cause?: Cause;
}

interface CompleteNotificationEvent {
  kind: 'complete';
  notification: number;
  source: number;
  destination: number;
  cause?: Cause;
}

type Event = SubscribeEvent | UnsubscribeEvent | NextNotificationEvent | ErrorNotificationEvent | CompleteNotificationEvent;

let nextObservableId = 0;
let nextSubscriptionId = 0;
let nextNotificationId = 0;

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

function trackOperator<IN, OUT, ARGS extends any[]>(operator: RxOperator<IN, OUT, ARGS>, args: ARGS): number {
  const observable = nextObservableId++;

  const event: OperatorEvent = {
    kind: 'operator',
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

function trackSubscribe(observable: number, observer: Observer<any>): { source: InstrumentedObserver, destination: InstrumentedObserver } {
  const source = observer as InstrumentedObserver;
  const destination = getDestination(source);

  source.__id__ = nextSubscriptionId++;

  const event: SubscribeEvent = {
    kind: 'subscribe',
    observable,
    source: source.__id__,
    destination: destination ? destination.__id__ : -1,
  };

  rxInspector.dispatch(event);

  return {source, destination};
}

function trackUnsubscribe(source: InstrumentedObserver, destination: InstrumentedObserver): void {
  const event: UnsubscribeEvent = {
    kind: 'unsubscribe',
    source: source.__id__,
    destination: destination ? destination.__id__ : -1,
  };

  rxInspector.dispatch(event);
}


function trackNextNotification(source: InstrumentedObserver, destination: InstrumentedObserver, value: any, cause?: Cause) {
  const notification = nextNotificationId++;

  const event: NextNotificationEvent = {
    kind: 'next',
    notification,
    value,
    source: source.__id__,
    destination: destination ? destination.__id__ : -1,
    cause,
  };

  if (destination) {
    destination.__last_received_notification_id__ = notification;
  }
  rxInspector.dispatch(event);

  return notification;
}

function trackErrorNotification(source: InstrumentedObserver, destination: InstrumentedObserver, error: any, cause?: Cause) {
  const notification = nextNotificationId++;

  const event: ErrorNotificationEvent = {
    kind: 'error',
    notification,
    error,
    source: source.__id__,
    destination: destination ? destination.__id__ : -1,
    cause,
  };

  if (destination) {
    destination.__last_received_notification_id__ = notification;
  }
  rxInspector.dispatch(event);

  return notification;
}

function trackCompleteNotification(source: InstrumentedObserver, destination: InstrumentedObserver, cause?: Cause) {
  const notification = nextNotificationId++;

  const event: CompleteNotificationEvent = {
    kind: 'complete',
    notification,
    source: source.__id__,
    destination: destination ? destination.__id__ : -1,
    cause,
  };

  if (destination) {
    destination.__last_received_notification_id__ = notification;
  }
  rxInspector.dispatch(event);

  return notification;
}

function getSyncCause(observer: InstrumentedObserver): SyncCause {
  const notification = observer.__last_received_notification_id__;
  return notification !== undefined
    ? {
      kind: 'sync',
      notification,
    }
    : undefined;
}

export const instrumentTransformingOperator =
  <IN = any, OUT = any, ARGS extends any[] = any>(operator: RxOperator<IN, OUT, ARGS>): RxOperator<IN, OUT, ARGS> => {
    return (...args: ARGS) => {
      const observable = trackOperator(operator, args);
      return pipe(
        operator(...args),
        (stream: Observable<any>) => {
          return Observable.create((observer) => {
            const {source, destination} = trackSubscribe(observable, observer);
            const sub = stream
              .pipe(
                rxOperators.tap({
                  next: (value) => trackNextNotification(source, destination, value, getSyncCause(source)),
                  error: (error) => trackErrorNotification(source, destination, error, getSyncCause(source)),
                  complete: () => trackCompleteNotification(source, destination, getSyncCause(source)),
                })
              )
              .subscribe(observer);

            return () => {
              trackUnsubscribe(source, destination);
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