import {Observable, Observer, OperatorFunction, pipe} from 'rxjs';
import {rxOperators} from '../rx';
import {rxInspector} from '../rx-inspector';

export type RxOperator<IN = any, OUT = any, ARGS extends any[] = any[]> = (...args: ARGS) => OperatorFunction<IN, OUT>;
export type InstrumentOperator = <IN, OUT, ARGS extends any[]>(operator: RxOperator<IN, OUT, ARGS>) => RxOperator<IN, OUT, ARGS>;

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
}

interface ErrorNotificationEvent {
  kind: 'error';
  notification: number;
  error: any;
  observable: number;
  source: number;
  destination: number;
}

interface CompleteNotificationEvent {
  kind: 'complete';
  notification: number;
  observable: number;
  source: number;
  destination: number;
}

type Event = SubscribeEvent | UnsubscribeEvent | NextNotificationEvent | ErrorNotificationEvent | CompleteNotificationEvent;

let observableId = 0;
let subscriptionId = 0;
let notificationId = 0;

function getDestination(observer: any) {
  return observer.__id__ !== undefined
    ? observer.__id__
    : observer.destination !== undefined
      ? getDestination(observer.destination)
      : -1;
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

function trackSubscribe(observable: number, observer: Observer<any>): { source: number, destination: number } {
  const source = subscriptionId++;
  const destination = getDestination(observer);
  (observer as any).__id__ = source;

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


function trackNextNotification(observable: number, source: number, destination: number, value: any) {
  const notification = notificationId++;

  const event: NextNotificationEvent = {
    kind: 'next',
    notification,
    value,
    observable,
    source,
    destination,
  };

  rxInspector.dispatch(event);

  return notification;
}

function trackErrorNotification(observable: number, source: number, destination: number, error: any) {
  const notification = notificationId++;

  const event: ErrorNotificationEvent = {
    kind: 'error',
    notification,
    error,
    observable,
    source,
    destination,
  };

  rxInspector.dispatch(event);

  return notification;
}

function trackCompleteNotification(observable: number, source: number, destination: number) {
  const notification = notificationId++;

  const event: CompleteNotificationEvent = {
    kind: 'complete',
    notification,
    observable,
    source,
    destination,
  };

  rxInspector.dispatch(event);

  return notification;
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
                  next: (value) => trackNextNotification(observable, source, destination, value),
                  error: (error) => trackErrorNotification(observable, source, destination, error),
                  complete: () => trackCompleteNotification(observable, source, destination),
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
