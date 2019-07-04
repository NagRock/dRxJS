import {Observable, Observer, OperatorFunction, pipe} from 'rxjs';
import {rxOperators} from '../rx';
import {rxInspector} from '../rx-inspector';

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
  observable: number;
  source: number;
  destination: number;
}

interface NextNotificationEvent {
  kind: 'next';
  notification: number;
  value: any;
  observable: number;
  source: number;
  destination: number;
  cause?: Cause;
}

interface ErrorNotificationEvent {
  kind: 'error';
  notification: number;
  error: any;
  observable: number;
  source: number;
  destination: number;
  cause?: Cause;
}

interface CompleteNotificationEvent {
  kind: 'complete';
  notification: number;
  observable: number;
  source: number;
  destination: number;
  cause?: Cause;
}

type Event = SubscribeEvent | UnsubscribeEvent | NextNotificationEvent | ErrorNotificationEvent | CompleteNotificationEvent;

let observableId = 0;
let subscriptionId = 0;
let notificationId = 0;

function getDestinationObserver(observer: any): Observer<any> & { __id__: number } | undefined {
  return observer.__id__ !== undefined
    ? observer
    : observer.destination !== undefined
      ? getDestination(observer.destination)
      : undefined;
}

function getDestination(observer: any) {
  const destination = getDestinationObserver(observer);
  return destination !== undefined ? destination.__id__ : -1;
}

function trackOperator<IN, OUT, ARGS extends any[]>(operator: RxOperator<IN, OUT, ARGS>, args: ARGS): number {
  const observable = observableId++;

  const event: OperatorEvent = {
    kind: 'operator',
    observable,
    operator,
    args,
  };

  rxInspector.dispatch(event);

  return observable;
}

function setId(observer: Observer<any>, id) {
  (observer as any).__id__ = id;
}

function setLastReveivedNotificationOnDestination(observer: Observer<any>, notification: number) {
  const destination = getDestinationObserver(observer);
  if (destination !== undefined) {
    (destination as any).__last_received_notificaion_id__ = notification;
  }
}

function getLastReceivedNotification(observer: Observer<any>): number {
  return (observer as any).__last_received_notificaion_id__;
}

function trackSubscribe(observable: number, observer: Observer<any>): { source: number, destination: number } {
  const source = subscriptionId++;
  const destination = getDestination(observer);
  setId(observer, source);

  const event: SubscribeEvent = {
    kind: 'subscribe',
    observable,
    source,
    destination,
  };

  rxInspector.dispatch(event);

  return event;
}

function trackUnsubscribe(observable: number, source: number, destination: number): void {
  const event: SubscribeEvent = {
    kind: 'subscribe',
    observable,
    source,
    destination,
  };

  rxInspector.dispatch(event);
}


function trackNextNotification(observable: number, source: number, destination: number, value: any, cause?: Cause) {
  const notification = notificationId++;

  const event: NextNotificationEvent = {
    kind: 'next',
    notification,
    value,
    observable,
    source,
    destination,
    cause,
  };

  rxInspector.dispatch(event);

  return notification;
}

function trackErrorNotification(observable: number, source: number, destination: number, error: any, cause?: Cause) {
  const notification = notificationId++;

  const event: ErrorNotificationEvent = {
    kind: 'error',
    notification,
    error,
    observable,
    source,
    destination,
    cause,
  };

  rxInspector.dispatch(event);

  return notification;
}

function trackCompleteNotification(observable: number, source: number, destination: number, cause?: Cause) {
  const notification = notificationId++;

  const event: CompleteNotificationEvent = {
    kind: 'complete',
    notification,
    observable,
    source,
    destination,
    cause,
  };

  rxInspector.dispatch(event);

  return notification;
}

function getSyncCause(observer: any): SyncCause {
  const notification = getLastReceivedNotification(observer);
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
                  next: (value) => trackNextNotification(observable, source, destination, value, getSyncCause(observer)),
                  error: (error) => trackErrorNotification(observable, source, destination, error, getSyncCause(observer)),
                  complete: () => trackCompleteNotification(observable, source, destination, getSyncCause(observer)),
                })
              )
              .subscribe(observer);

            return () => {
              trackUnsubscribe(observable, source, destination);
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
