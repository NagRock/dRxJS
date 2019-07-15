import {instrumentedRx, instrumentedRxOperators, rx, rxOperators} from './rx';
import {instrumentOperator, InstrumentOperator, instrumentTransformingOperator, RxOperator} from './operators/instrument-operator';
import {instrumentCreator, InstrumentRxCreator, RxCreator} from './creators/instrument-creator';
import {rxInspector} from './rx-inspector';
import {instrumentSubscribe} from './subscribe';

const creators: [RxCreator, InstrumentRxCreator][] = [
  // [rx.bindCallback, instrumentCreator],
  // [rx.bindNodeCallback, instrumentCreator],
  [rx.combineLatest, instrumentCreator],
  [rx.concat, instrumentCreator],
  [rx.defer, instrumentCreator],
  [rx.empty, instrumentCreator],
  [rx.forkJoin, instrumentCreator],
  [rx.from, instrumentCreator],
  [rx.fromEvent, instrumentCreator],
  [rx.fromEventPattern, instrumentCreator],
  [rx.generate, instrumentCreator],
  [rx.iif, instrumentCreator],
  [rx.interval, instrumentCreator],
  [rx.merge, instrumentCreator],
  [rx.never, instrumentCreator],
  [rx.of, instrumentCreator],
  [rx.onErrorResumeNext, instrumentCreator],
  [rx.pairs, instrumentCreator],
  [rx.race, instrumentCreator],
  [rx.range, instrumentCreator],
  [rx.throwError, instrumentCreator],
  [rx.timer, instrumentCreator],
  [rx.using, instrumentCreator],
  [rx.zip, instrumentCreator],
];

const operators: [RxOperator, InstrumentOperator][] = [
  [rxOperators.audit, instrumentOperator],
  [rxOperators.auditTime, instrumentOperator],
  [rxOperators.buffer, instrumentOperator],
  [rxOperators.bufferCount, instrumentOperator],
  [rxOperators.bufferTime, instrumentOperator],
  [rxOperators.bufferToggle, instrumentOperator],
  [rxOperators.bufferWhen, instrumentOperator],
  [rxOperators.catchError, instrumentOperator],
  [rxOperators.combineAll, instrumentOperator],
  [rxOperators.combineLatest, instrumentOperator],
  [rxOperators.concat, instrumentOperator],
  [rxOperators.concatAll, instrumentOperator],
  [rxOperators.concatMap, instrumentOperator],
  [rxOperators.concatMapTo, instrumentOperator],
  [rxOperators.count, instrumentTransformingOperator],
  [rxOperators.debounce, instrumentOperator],
  [rxOperators.debounceTime, instrumentOperator],
  [rxOperators.defaultIfEmpty, instrumentOperator],
  [rxOperators.delay, instrumentOperator],
  [rxOperators.delayWhen, instrumentOperator],
  [rxOperators.dematerialize, instrumentOperator],
  [rxOperators.distinct, instrumentOperator],
  [rxOperators.distinctUntilChanged, instrumentTransformingOperator],
  [rxOperators.distinctUntilKeyChanged, instrumentOperator],
  [rxOperators.elementAt, instrumentTransformingOperator],
  [rxOperators.endWith, instrumentTransformingOperator], // scheduler
  [rxOperators.every, instrumentTransformingOperator],
  [rxOperators.exhaust, instrumentOperator],
  [rxOperators.exhaustMap, instrumentOperator],
  [rxOperators.expand, instrumentOperator],
  [rxOperators.filter, instrumentTransformingOperator],
  [rxOperators.finalize, instrumentTransformingOperator],
  [rxOperators.find, instrumentTransformingOperator],
  [rxOperators.findIndex, instrumentTransformingOperator],
  [rxOperators.first, instrumentTransformingOperator],
  [rxOperators.groupBy, instrumentOperator],
  [rxOperators.ignoreElements, instrumentTransformingOperator],
  [rxOperators.isEmpty, instrumentTransformingOperator],
  [rxOperators.last, instrumentTransformingOperator],
  [rxOperators.map, instrumentTransformingOperator],
  [rxOperators.mapTo, instrumentTransformingOperator],
  [rxOperators.materialize, instrumentTransformingOperator],
  [rxOperators.max, instrumentTransformingOperator],
  [rxOperators.merge, instrumentOperator],
  [rxOperators.mergeAll, instrumentOperator],
  [rxOperators.mergeMap, instrumentOperator],
  [rxOperators.mergeMap, instrumentOperator],
  [rxOperators.mergeMapTo, instrumentOperator],
  [rxOperators.mergeScan, instrumentOperator],
  [rxOperators.min, instrumentTransformingOperator],
  [rxOperators.multicast, instrumentOperator],
  [rxOperators.observeOn, instrumentOperator],
  [rxOperators.onErrorResumeNext, instrumentOperator],
  [rxOperators.pairwise, instrumentTransformingOperator],
  // [rxOperators.partition, instrumentOperator],
  [rxOperators.pluck, instrumentTransformingOperator],
  [rxOperators.publish, instrumentOperator],
  [rxOperators.publishBehavior, instrumentOperator],
  [rxOperators.publishLast, instrumentOperator],
  [rxOperators.publishReplay, instrumentOperator],
  [rxOperators.race, instrumentOperator],
  [rxOperators.reduce, instrumentTransformingOperator],
  [rxOperators.repeat, instrumentOperator],
  [rxOperators.repeatWhen, instrumentOperator],
  [rxOperators.retry, instrumentOperator],
  [rxOperators.retryWhen, instrumentOperator],
  [rxOperators.refCount, instrumentOperator],
  [rxOperators.sample, instrumentOperator],
  [rxOperators.sampleTime, instrumentOperator],
  [rxOperators.scan, instrumentTransformingOperator],
  [rxOperators.sequenceEqual, instrumentOperator],
  [rxOperators.share, instrumentOperator],
  [rxOperators.shareReplay, instrumentOperator],
  [rxOperators.single, instrumentTransformingOperator],
  [rxOperators.skip, instrumentTransformingOperator],
  [rxOperators.skipLast, instrumentTransformingOperator],
  [rxOperators.skipUntil, instrumentTransformingOperator],
  [rxOperators.skipWhile, instrumentTransformingOperator],
  [rxOperators.startWith, instrumentTransformingOperator], // scheduler
  [rxOperators.subscribeOn, instrumentOperator],
  [rxOperators.switchAll, instrumentOperator],
  [rxOperators.switchMap, instrumentOperator],
  [rxOperators.switchMapTo, instrumentOperator],
  [rxOperators.take, instrumentTransformingOperator],
  [rxOperators.takeLast, instrumentTransformingOperator],
  [rxOperators.takeUntil, instrumentTransformingOperator],
  [rxOperators.takeWhile, instrumentTransformingOperator],
  [rxOperators.tap, instrumentTransformingOperator],
  [rxOperators.throttle, instrumentOperator],
  [rxOperators.throttleTime, instrumentOperator],
  [rxOperators.throwIfEmpty, instrumentOperator],
  [rxOperators.timeInterval, instrumentOperator],
  [rxOperators.timeout, instrumentOperator],
  [rxOperators.timeoutWith, instrumentOperator],
  [rxOperators.timestamp, instrumentOperator],
  [rxOperators.toArray, instrumentOperator],
  [rxOperators.window, instrumentOperator],
  [rxOperators.windowCount, instrumentOperator],
  [rxOperators.windowTime, instrumentOperator],
  [rxOperators.windowToggle, instrumentOperator],
  [rxOperators.windowWhen, instrumentOperator],
  [rxOperators.withLatestFrom, instrumentOperator],
  [rxOperators.zip, instrumentOperator],
  [rxOperators.zipAll, instrumentOperator],
];


export function instrumentCreators() {
  creators.forEach(([creator, instrument]) => {
    const instrumentedCreator = instrument(creator);
    Object.defineProperty(instrumentedRx, creator.name, {
      get: () => instrumentedCreator,
    });
  });
}

export function instrumentOperators() {
  operators.forEach(([operator, instrument]) => {
    const instrumentedOperator = instrument(operator);
    Object.defineProperty(instrumentedRxOperators, operator.name, {
      get: () => instrumentedOperator,
    });
  });
}

let instrumented = false;

export function enableInstrumentation() {
  if (!instrumented) {
    instrumentSubscribe();
    instrumentCreators();
    instrumentOperators();
    instrumented = true;
  }

  return rxInspector;
}
