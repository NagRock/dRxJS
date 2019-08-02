import {instrumentedRx, instrumentedRxOperators, rx, rxOperators} from './rx';
import {rxInspector} from './rx-inspector';
import {instrumentSubscribe} from './subscribe';
import {
  instrumentCombineLatest,
  instrumentConcat,
  instrumentForkJoin,
  instrumentMerge,
  instrumentOnErrorResumeNext,
  InstrumentRxCreator,
  instrumentSimpleCreator,
  instrumentZip,
  RxCreator,
} from './creators';
import {InstrumentOperator, instrumentOperator, instrumentSimpleOperator, RxOperator} from './operators';
import {instrumentCombiningOperator} from './operators/instrument-combining-operator';

const creators: [RxCreator, InstrumentRxCreator][] = [
  // [rx.bindCallback, instrumentCreator],
  // [rx.bindNodeCallback, instrumentCreator],
  [rx.combineLatest, instrumentCombineLatest],
  [rx.concat, instrumentConcat],
  // [rx.defer, ?], // needs special handling
  [rx.empty, instrumentSimpleCreator],
  [rx.forkJoin, instrumentForkJoin],
  [rx.from, instrumentSimpleCreator],
  [rx.fromEvent, instrumentSimpleCreator],
  [rx.fromEventPattern, instrumentSimpleCreator],
  [rx.generate, instrumentSimpleCreator],
  [rx.iif, instrumentSimpleCreator],
  [rx.interval, instrumentSimpleCreator],
  [rx.merge, instrumentMerge],
  [rx.never, instrumentSimpleCreator],
  [rx.of, instrumentSimpleCreator],
  [rx.onErrorResumeNext, instrumentOnErrorResumeNext],
  [rx.pairs, instrumentSimpleCreator],
  [rx.race, instrumentSimpleCreator],
  [rx.range, instrumentSimpleCreator],
  [rx.throwError, instrumentSimpleCreator],
  [rx.timer, instrumentSimpleCreator],
  [rx.using, instrumentSimpleCreator],
  [rx.zip, instrumentZip],
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
  [rxOperators.concatMap, instrumentCombiningOperator ],
  [rxOperators.concatMapTo, instrumentOperator],
  [rxOperators.count, instrumentSimpleOperator],
  [rxOperators.debounce, instrumentOperator],
  [rxOperators.debounceTime, instrumentOperator],
  [rxOperators.defaultIfEmpty, instrumentOperator],
  [rxOperators.delay, instrumentOperator],
  [rxOperators.delayWhen, instrumentOperator],
  [rxOperators.dematerialize, instrumentOperator],
  [rxOperators.distinct, instrumentOperator],
  [rxOperators.distinctUntilChanged, instrumentSimpleOperator],
  [rxOperators.distinctUntilKeyChanged, instrumentOperator],
  [rxOperators.elementAt, instrumentSimpleOperator],
  [rxOperators.endWith, instrumentSimpleOperator], // scheduler
  [rxOperators.every, instrumentSimpleOperator],
  [rxOperators.exhaust, instrumentOperator],
  [rxOperators.exhaustMap, instrumentOperator],
  [rxOperators.expand, instrumentOperator],
  [rxOperators.filter, instrumentSimpleOperator],
  [rxOperators.finalize, instrumentSimpleOperator],
  [rxOperators.find, instrumentSimpleOperator],
  [rxOperators.findIndex, instrumentSimpleOperator],
  [rxOperators.first, instrumentSimpleOperator],
  [rxOperators.groupBy, instrumentOperator],
  [rxOperators.ignoreElements, instrumentSimpleOperator],
  [rxOperators.isEmpty, instrumentSimpleOperator],
  [rxOperators.last, instrumentSimpleOperator],
  [rxOperators.map, instrumentSimpleOperator],
  [rxOperators.mapTo, instrumentSimpleOperator],
  [rxOperators.materialize, instrumentSimpleOperator],
  [rxOperators.max, instrumentSimpleOperator],
  [rxOperators.merge, instrumentOperator],
  [rxOperators.mergeAll, instrumentOperator],
  [rxOperators.mergeMap, instrumentOperator],
  [rxOperators.mergeMapTo, instrumentOperator],
  [rxOperators.mergeScan, instrumentOperator],
  [rxOperators.min, instrumentSimpleOperator],
  [rxOperators.multicast, instrumentOperator],
  [rxOperators.observeOn, instrumentOperator],
  [rxOperators.onErrorResumeNext, instrumentOperator],
  [rxOperators.pairwise, instrumentSimpleOperator],
  // [rxOperators.partition, instrumentOperator],
  [rxOperators.pluck, instrumentSimpleOperator],
  [rxOperators.publish, instrumentOperator],
  [rxOperators.publishBehavior, instrumentOperator],
  [rxOperators.publishLast, instrumentOperator],
  [rxOperators.publishReplay, instrumentOperator],
  [rxOperators.race, instrumentOperator],
  [rxOperators.reduce, instrumentSimpleOperator],
  [rxOperators.repeat, instrumentOperator],
  [rxOperators.repeatWhen, instrumentOperator],
  [rxOperators.retry, instrumentOperator],
  [rxOperators.retryWhen, instrumentOperator],
  [rxOperators.refCount, instrumentOperator],
  [rxOperators.sample, instrumentOperator],
  [rxOperators.sampleTime, instrumentOperator],
  [rxOperators.scan, instrumentSimpleOperator],
  [rxOperators.sequenceEqual, instrumentOperator],
  [rxOperators.share, instrumentOperator],
  [rxOperators.shareReplay, instrumentOperator],
  [rxOperators.single, instrumentSimpleOperator],
  [rxOperators.skip, instrumentSimpleOperator],
  [rxOperators.skipLast, instrumentSimpleOperator],
  [rxOperators.skipUntil, instrumentSimpleOperator],
  [rxOperators.skipWhile, instrumentSimpleOperator],
  [rxOperators.startWith, instrumentSimpleOperator], // scheduler
  [rxOperators.subscribeOn, instrumentOperator],
  [rxOperators.switchAll, instrumentOperator],
  [rxOperators.switchMap, instrumentOperator],
  [rxOperators.switchMapTo, instrumentOperator],
  [rxOperators.take, instrumentSimpleOperator],
  [rxOperators.takeLast, instrumentSimpleOperator],
  [rxOperators.takeUntil, instrumentSimpleOperator],
  [rxOperators.takeWhile, instrumentSimpleOperator],
  [rxOperators.tap, instrumentSimpleOperator],
  [rxOperators.throttle, instrumentOperator],
  [rxOperators.throttleTime, instrumentOperator],
  [rxOperators.throwIfEmpty, instrumentSimpleOperator], // delegates to 'tap'
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
