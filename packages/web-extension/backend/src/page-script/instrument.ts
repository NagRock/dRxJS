import * as _rxjs from 'rxjs';
import {ConnectableObservable, Observable, Observer, Subscriber} from 'rxjs';
import * as _rxjsOperators from 'rxjs/operators';
import {
  trackCompleteNotification,
  trackConnect,
  trackConstructorDeclaration,
  trackErrorNotification,
  trackInstance,
  trackNextNotification,
  trackObservableFromConstructor,
  trackObservableFromOperator, trackObservableFromSubscribe,
  trackOperatorDeclaration,
  trackSubjectComplete,
  trackSubjectError,
  trackSubjectNext,
  trackSubscribe,
  trackSubscribeDeclaration,
  trackUnsubscribe
} from './track';

function getZoneProperty(property) {
  return (window as any).Zone.current.get(property);
}

type RxJS = typeof _rxjs;
type RxJSOperators = typeof _rxjsOperators;

interface InstrumentationContext {
  rxjs: RxJS;
  rxjsOperators: RxJSOperators;
  originalRxjs: RxJS;
  originalRxjsOperators: RxJSOperators;
}

function trackSubscribeInstance(args: any[], source: number) {
  const declarationId = trackSubscribeDeclaration(args);
  const observableId = trackObservableFromSubscribe(declarationId, source);
  return trackInstance(observableId);
}

function fork(instanceId: number, eventId: number) {
  return (window as any).Zone.current.fork({
    name: '__doctor__',
    properties: {
      __doctor__instance_id: instanceId,
      __doctor__event_id: eventId,
    },
  });
}

function isSourcePrototype(observable: any) {
  return observable.source && observable.source.__doctor__observable_id === observable.__doctor__observable_id;
}

function isInternal(observable: any) {
  return observable.__doctor__observable_id === undefined || isSourcePrototype(observable);
}

function instrumentSubscribe<T extends Observable<unknown>>({originalRxjs}: InstrumentationContext, observable: T) {
  if ((observable as any).__doctor__subscribe_instrumented) {
    return;
  }
  const {subscribe} = observable;
  Object.defineProperties(observable, {
    __doctor__subscribe_instrumented: {
      value: true,
    },
    subscribe: {
      value: function __doctor__subscribe(
        observerOrNext?: Observer<unknown> | ((value: unknown) => void),
        error?: (error: any) => void,
        complete?: () => void,
      ) {
        if (isInternal(this)) {
          return subscribe.call(this, observerOrNext, error, complete);
        }
        const instanceId =
          this.__doctor__instance_id // Subject or multicast
          || trackInstance(this.__doctor__observable_id); // unicast
        const destinationInstanceId =
          (observerOrNext && (observerOrNext as any).__doctor__instance_id) // Subject
          || getZoneProperty('__doctor__instance_id') // subscriber that called this subscribe
          || trackSubscribeInstance([observerOrNext, error, complete], this.__doctor__observable_id); // direct subscribe call

        const subscriber = instrumentSubscriber(
          toSubscriber(originalRxjs, observerOrNext, error, complete),
          instanceId,
          destinationInstanceId,
        );

        const eventId = trackSubscribe(instanceId, destinationInstanceId, getZoneProperty('__doctor__event_id'));
        return fork(instanceId, eventId).run(() => {
            return subscribe.call(this, subscriber);
          }
        );
      }
    },
  });
}

function instrumentSubjects(context: InstrumentationContext) {
  const {rxjs, originalRxjs} = context;

  const subjects = [
    originalRxjs.Subject,
    originalRxjs.ReplaySubject,
    originalRxjs.BehaviorSubject,
    originalRxjs.AsyncSubject,
  ];

  subjects.forEach((subject: any) => {
    class __doctor__subject extends subject {
      __doctor__observable_id: number;
      __doctor__instance_id: number;

      constructor(...args) {
        super(...args);
        this.__doctor__observable_id = trackObservableFromConstructor(trackConstructorDeclaration(subject, args));
        this.__doctor__instance_id = trackInstance(this.__doctor__observable_id);
        instrumentSubscribe(context, this as any);
      }

      next(value: any) {
        const instanceId = getZoneProperty('__doctor__instance_id') || this.__doctor__instance_id;
        const eventId = trackSubjectNext(this.__doctor__instance_id, instanceId, getZoneProperty('__doctor__event_id'), value);
        fork(instanceId, eventId).run(() => {
            super.next(value);
          }
        );
      }

      error(error: any) {
        const instanceId = getZoneProperty('__doctor__instance_id') || this.__doctor__instance_id;
        const eventId = trackSubjectError(this.__doctor__instance_id, instanceId, getZoneProperty('__doctor__event_id'), error);
        fork(instanceId, eventId).run(() => {
            super.error(error);
          }
        );
      }

      complete() {
        const instanceId = getZoneProperty('__doctor__instance_id') || this.__doctor__instance_id;
        const eventId = trackSubjectComplete(this.__doctor__instance_id, getZoneProperty('__doctor__event_id'), instanceId);
        fork(instanceId, eventId).run(() => {
            super.complete();
          }
        );
      }
    }

    Object.defineProperty(rxjs, subject.name, {
      get() {
        return __doctor__subject;
      }
    });
  });
}

function instrumentSubscriber(subscriber: Subscriber<unknown>, instanceId, destinationInstanceId) {
  if ((subscriber as any).__doctor__subscriber_instrumented) {
    // subscriber reused; e.g. repeat operator
    Object.defineProperties(subscriber, {
      __doctor__instance_id: {
        value: instanceId,
      },
      __doctor_destination_instance_id: {
        value: destinationInstanceId,
      },
    });
  } else {
    const {next, error, complete, unsubscribe} = subscriber;
    Object.defineProperties(subscriber, {
      __doctor__subscriber_instrumented: {
        value: true,
      },
      __doctor__instance_id: {
        value: instanceId,
      },
      __doctor_destination_instance_id: {
        value: destinationInstanceId,
      },
      next: {
        value: function __doctor__next(value) {
          const eventId = !this.isStopped
            ? trackNextNotification(this.__doctor__instance_id, this.__doctor_destination_instance_id, getZoneProperty('__doctor__event_id'), value)
            : undefined;
          fork(this.__doctor_destination_instance_id, eventId).run(() => {
            next.call(this, value);
          });
        }
      },
      error: {
        value: function __doctor__error(err) {
          const eventId = !this.isStopped
            ? trackErrorNotification(this.__doctor__instance_id, this.__doctor_destination_instance_id, getZoneProperty('__doctor__event_id'), err)
            : undefined;
          fork(this.__doctor_destination_instance_id, eventId).run(() => {
            error.call(this, err);
          });
        }
      },
      complete: {
        value: function __doctor__complete() {
          const eventId = !this.isStopped
            ? trackCompleteNotification(this.__doctor__instance_id, this.__doctor_destination_instance_id, getZoneProperty('__doctor__event_id'))
            : undefined;
          fork(this.__doctor_destination_instance_id, eventId).run(() => {
            complete.call(this);
          });
        }
      },
      unsubscribe: {
        value: function __doctor__unsubscribe() {
          const eventId = !this.closed
            ? trackUnsubscribe(this.__doctor__instance_id, this.__doctor_destination_instance_id, getZoneProperty('__doctor__event_id'))
            : undefined;
          fork(this.__doctor_destination_instance_id, eventId).run(() => {
            unsubscribe.call(this);
          });
        }
      }
    });
  }

  return subscriber;
}

function toSubscriber(originalRxjs: RxJS, observerOrNext: Observer<unknown> | ((value: unknown) => void), error: (error: any) => void, complete: () => void) {
  return observerOrNext instanceof originalRxjs.Subscriber
    ? new originalRxjs.Subscriber(observerOrNext)
    : new originalRxjs.Subscriber(observerOrNext, error, complete);
}

function deoptimize(observable: Observable<unknown>, originalRxjs: RxJS) {
  if (observable._isScalar) {
    const {value} = observable as any;
    return new originalRxjs.Observable((subscriber) => {
      subscriber.next(value);
      subscriber.complete();
    });
  } else if (observable === originalRxjs.EMPTY) {
    return new originalRxjs.Observable((subscriber) => {
      subscriber.complete();
    });
  } else if (observable === originalRxjs.NEVER) {
    return new originalRxjs.Observable((subscriber) => {
    });
  } else {
    return observable;
  }
}

function instrumentCreators(context: InstrumentationContext) {
  const {rxjs, originalRxjs} = context;

  const creators = [
    originalRxjs.combineLatest,
    originalRxjs.concat,
    originalRxjs.empty,
    originalRxjs.forkJoin,
    originalRxjs.from,
    originalRxjs.fromEvent,
    originalRxjs.fromEventPattern,
    originalRxjs.generate,
    originalRxjs.iif,
    originalRxjs.interval,
    originalRxjs.merge,
    originalRxjs.never,
    originalRxjs.of,
    originalRxjs.onErrorResumeNext,
    originalRxjs.pairs,
    originalRxjs.race,
    originalRxjs.range,
    originalRxjs.throwError,
    originalRxjs.timer,
    originalRxjs.using,
    originalRxjs.zip,
  ];

  creators.forEach((func: any) => {
    const instrumentedCreator = (...args) => {
      const resultStream = deoptimize(func(...args), originalRxjs);
      (resultStream as any).__doctor__observable_id = trackObservableFromConstructor(trackConstructorDeclaration(func, args));
      instrumentSubscribe(context, resultStream);
      return resultStream;
    };
    Object.defineProperty(rxjs, func.name, {
      get() {
        return instrumentedCreator;
      }
    });
  });
}

function instrumentConnect({}: InstrumentationContext, observable: ConnectableObservable<unknown>) {
  if ((observable as any).__doctor__connect_instrumented) {
    return;
  }
  const {connect} = observable;
  Object.defineProperties(observable, {
    __doctor__connect_instrumented: {
      value: true,
    },
    connect: {
      value: function __doctor__connect() {
        const {__doctor__instance_id: instanceId} = this;
        if (instanceId !== undefined) {
          const eventId = trackConnect(instanceId, getZoneProperty('__doctor__event_id'));
          return fork(instanceId, eventId).run(() => {
            return connect.call(this);
          });
        } else {
          // TODO: should we fork here?
          return connect.call(this);
        }
      }
    }
  });
}

function instrumentOperators(context: InstrumentationContext) {
  const {rxjsOperators, originalRxjs, originalRxjsOperators} = context;

  const operators = [
    [originalRxjsOperators.audit],
    [originalRxjsOperators.auditTime],
    [originalRxjsOperators.buffer],
    [originalRxjsOperators.bufferCount],
    [originalRxjsOperators.bufferToggle],
    [originalRxjsOperators.bufferWhen],
    [originalRxjsOperators.catchError],
    [originalRxjsOperators.combineAll],
    [originalRxjsOperators.combineLatest],
    [originalRxjsOperators.concat],
    [originalRxjsOperators.concatAll],
    [originalRxjsOperators.concatMap],
    [originalRxjsOperators.concatMapTo],
    [originalRxjsOperators.count],
    [originalRxjsOperators.debounce],
    [originalRxjsOperators.debounceTime],
    [originalRxjsOperators.defaultIfEmpty],
    [originalRxjsOperators.delay],
    [originalRxjsOperators.delayWhen],
    [originalRxjsOperators.dematerialize],
    [originalRxjsOperators.distinct],
    [originalRxjsOperators.distinctUntilChanged],
    [originalRxjsOperators.distinctUntilKeyChanged],
    [originalRxjsOperators.elementAt],
    [originalRxjsOperators.endWith],
    [originalRxjsOperators.every],
    [originalRxjsOperators.exhaust],
    [originalRxjsOperators.exhaustMap],
    [originalRxjsOperators.expand],
    [originalRxjsOperators.filter],
    [originalRxjsOperators.finalize],
    [originalRxjsOperators.find],
    [originalRxjsOperators.findIndex],
    [originalRxjsOperators.first],
    [originalRxjsOperators.groupBy],
    [originalRxjsOperators.ignoreElements],
    [originalRxjsOperators.isEmpty],
    [originalRxjsOperators.last],
    [originalRxjsOperators.map],
    [originalRxjsOperators.mapTo],
    [originalRxjsOperators.materialize],
    [originalRxjsOperators.max],
    [originalRxjsOperators.merge],
    [originalRxjsOperators.mergeAll],
    [originalRxjsOperators.mergeMap],
    [originalRxjsOperators.mergeMapTo],
    [originalRxjsOperators.mergeScan],
    [originalRxjsOperators.min],
    [originalRxjsOperators.multicast],
    [originalRxjsOperators.observeOn],
    [originalRxjsOperators.onErrorResumeNext],
    [originalRxjsOperators.pairwise],
    [originalRxjsOperators.pluck],
    [originalRxjsOperators.publish, {multicast: true /* ??? */}],
    [originalRxjsOperators.publishBehavior, {multicast: true /* ??? */}],
    [originalRxjsOperators.publishLast, {multicast: true /* ??? */}],
    [originalRxjsOperators.publishReplay, {multicast: true /* ??? */}],
    [originalRxjsOperators.race],
    [originalRxjsOperators.reduce],
    [originalRxjsOperators.repeat],
    [originalRxjsOperators.repeatWhen],
    [originalRxjsOperators.retry],
    [originalRxjsOperators.retryWhen],
    [originalRxjsOperators.refCount, {multicast: false}],
    [originalRxjsOperators.sample],
    [originalRxjsOperators.sampleTime],
    [originalRxjsOperators.scan],
    [originalRxjsOperators.sequenceEqual],
    [originalRxjsOperators.share, {multicast: true}],
    [originalRxjsOperators.shareReplay, {multicast: true}],
    [originalRxjsOperators.single],
    [originalRxjsOperators.skip],
    [originalRxjsOperators.skipLast],
    [originalRxjsOperators.skipUntil],
    [originalRxjsOperators.skipWhile],
    [originalRxjsOperators.startWith],
    [originalRxjsOperators.subscribeOn],
    [originalRxjsOperators.switchAll],
    [originalRxjsOperators.switchMap],
    [originalRxjsOperators.switchMapTo],
    [originalRxjsOperators.take],
    [originalRxjsOperators.takeLast],
    [originalRxjsOperators.takeUntil],
    [originalRxjsOperators.takeWhile],
    [originalRxjsOperators.tap],
    [originalRxjsOperators.throttle],
    [originalRxjsOperators.throttleTime],
    [originalRxjsOperators.throwIfEmpty],
    [originalRxjsOperators.timeInterval],
    [originalRxjsOperators.timeout],
    [originalRxjsOperators.timeoutWith],
    [originalRxjsOperators.timestamp],
    [originalRxjsOperators.toArray],
    [originalRxjsOperators.window],
    [originalRxjsOperators.windowCount],
    [originalRxjsOperators.windowToggle],
    [originalRxjsOperators.windowWhen],
    [originalRxjsOperators.withLatestFrom],
    [originalRxjsOperators.zip],
    [originalRxjsOperators.zipAll],
  ];

  operators.forEach(([func, {multicast = false} = {}]: any) => {
    const instrumentedOperator = (...args) => {
      const declarationId = trackOperatorDeclaration(func, args);
      return (stream: Observable<unknown>) => {
        const resultStream = deoptimize(func(...args)(stream), originalRxjs);
        const observableId = trackObservableFromOperator(declarationId, (stream as any).__doctor__observable_id);
        (resultStream as any).__doctor__observable_id = observableId;
        if (multicast) {
          (resultStream as any).__doctor__instance_id = trackInstance(observableId);
        }

        instrumentSubscribe(context, resultStream);
        if (typeof (resultStream as any).connect === 'function') {
          instrumentConnect(context, resultStream as ConnectableObservable<unknown>);
        }

        return resultStream;
      };
    };
    Object.defineProperty(rxjsOperators, func.name, {
      get() {
        return instrumentedOperator;
      }
    });
  });
}

function instrumentObservables(context: InstrumentationContext) {
  const {rxjs, originalRxjs} = context;
  const {Observable, ConnectableObservable} = originalRxjs;

  class __doctor__observable extends Observable<unknown> {
    __doctor__observable_id: number;

    constructor(...args) {
      super(...args);
      this.__doctor__observable_id = trackObservableFromConstructor(trackConstructorDeclaration(originalRxjs.Observable, args));
      instrumentSubscribe(context, this);
    }
  }

  class __doctor__connectable_observable extends ConnectableObservable<unknown> {
    __doctor__observable_id: number;
    __doctor__instance_id: number;

    constructor(...args) {
      // @ts-ignore
      super(...args);
      this.__doctor__observable_id = trackObservableFromConstructor(trackConstructorDeclaration(originalRxjs.ConnectableObservable, args));
      this.__doctor__instance_id = trackInstance(this.__doctor__observable_id);
      instrumentSubscribe(context, this);
      instrumentConnect(context, this);
    }
  }

  Object.defineProperties(rxjs, {
    [(Observable as any).name]: {
      value: __doctor__observable,
    },
    [(ConnectableObservable as any).name]: {
      value: __doctor__connectable_observable,
    },
  });
}

export function instrumentRxJS(rxjs: RxJS, rxjsOperators: RxJSOperators) {
  const context: InstrumentationContext = {
    rxjs,
    rxjsOperators,
    originalRxjs: {...rxjs},
    originalRxjsOperators: {...rxjsOperators},
  };

  instrumentObservables(context);
  instrumentSubjects(context);
  instrumentCreators(context);
  instrumentOperators(context);
}


