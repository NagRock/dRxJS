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
import {InstrumentOperator, RxOperator} from './operators';
import {
  instrumentBufferOperator,
  instrumentBufferToggleOperator,
  instrumentBufferWhenOperator,
  instrumentCatchErrorOperator,
  instrumentCombineAllOperator,
  instrumentCombineLatestOperator,
  instrumentConcatAllOperator,
  instrumentConcatMapOperator,
  instrumentConcatMapToOperator,
  instrumentConcatOperator,
  instrumentDistinctOperator,
  instrumentExhaustMapOperator,
  instrumentExhaustOperator,
  instrumentExpandOperator,
  instrumentGroupByOperator,
  instrumentMergeAllOperator,
  instrumentMergeMapOperator,
  instrumentMergeMapToOperator,
  instrumentMergeOperator,
  instrumentMergeScanOperator,
  instrumentOnErrorResumeNextOperator,
  instrumentRepeatWhenOperator,
  instrumentRetryWhenOperator,
  instrumentSampleOperator,
  instrumentSequenceEqualOperator,
  instrumentSimpleOperator,
  instrumentSwitchAllOperator,
  instrumentSwitchMapOperator,
  instrumentSwitchMapToOperator,
  instrumentWindowOperator,
  instrumentWindowToggleOperator,
  instrumentWindowWhenOperator,
  instrumentWithLatestFromOperator,
  instrumentZipAllOperator,
  instrumentZipOperator
} from './operators/instumented-operators';
import {noop} from 'instrumented-rxjs';
import {instrumentSubjects} from './subject';

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

const x_instrumentOperator: any = noop;

const operators: [RxOperator, InstrumentOperator][] = [
  [rxOperators.audit, x_instrumentOperator],
  [rxOperators.auditTime, x_instrumentOperator],
  [rxOperators.buffer, instrumentBufferOperator],
  [rxOperators.bufferCount, x_instrumentOperator],
  [rxOperators.bufferTime, x_instrumentOperator],
  [rxOperators.bufferToggle, instrumentBufferToggleOperator],
  [rxOperators.bufferWhen, instrumentBufferWhenOperator],
  [rxOperators.catchError, instrumentCatchErrorOperator],
  [rxOperators.combineAll, instrumentCombineAllOperator],
  [rxOperators.combineLatest, instrumentCombineLatestOperator],
  [rxOperators.concat, instrumentConcatOperator],
  [rxOperators.concatAll, instrumentConcatAllOperator],
  [rxOperators.concatMap, instrumentConcatMapOperator],
  [rxOperators.concatMapTo, instrumentConcatMapToOperator],
  [rxOperators.count, instrumentSimpleOperator],
  [rxOperators.debounce, x_instrumentOperator],
  [rxOperators.debounceTime, x_instrumentOperator],
  [rxOperators.defaultIfEmpty, instrumentSimpleOperator],
  [rxOperators.delay, x_instrumentOperator],
  [rxOperators.delayWhen, x_instrumentOperator],
  [rxOperators.dematerialize, x_instrumentOperator],
  [rxOperators.distinct, instrumentDistinctOperator],
  [rxOperators.distinctUntilChanged, instrumentSimpleOperator],
  [rxOperators.distinctUntilKeyChanged, x_instrumentOperator],
  [rxOperators.elementAt, instrumentSimpleOperator],
  [rxOperators.endWith, instrumentSimpleOperator], // scheduler
  [rxOperators.every, instrumentSimpleOperator],
  [rxOperators.exhaust, instrumentExhaustOperator],
  [rxOperators.exhaustMap, instrumentExhaustMapOperator],
  [rxOperators.expand, instrumentExpandOperator],
  [rxOperators.filter, instrumentSimpleOperator],
  [rxOperators.finalize, instrumentSimpleOperator],
  [rxOperators.find, instrumentSimpleOperator],
  [rxOperators.findIndex, instrumentSimpleOperator],
  [rxOperators.first, instrumentSimpleOperator],
  [rxOperators.groupBy, instrumentGroupByOperator],
  [rxOperators.ignoreElements, instrumentSimpleOperator],
  [rxOperators.isEmpty, instrumentSimpleOperator],
  [rxOperators.last, instrumentSimpleOperator],
  [rxOperators.map, instrumentSimpleOperator],
  [rxOperators.mapTo, instrumentSimpleOperator],
  [rxOperators.materialize, instrumentSimpleOperator],
  [rxOperators.max, instrumentSimpleOperator],
  [rxOperators.merge, instrumentMergeOperator],
  [rxOperators.mergeAll, instrumentMergeAllOperator],
  [rxOperators.mergeMap, instrumentMergeMapOperator],
  [rxOperators.mergeMapTo, instrumentMergeMapToOperator],
  [rxOperators.mergeScan, instrumentMergeScanOperator],
  [rxOperators.min, instrumentSimpleOperator],
  [rxOperators.multicast, x_instrumentOperator],
  [rxOperators.observeOn, x_instrumentOperator],
  [rxOperators.onErrorResumeNext, instrumentOnErrorResumeNextOperator],
  [rxOperators.pairwise, instrumentSimpleOperator],
  // [rxOperators.partition, x_instrumentOperator],
  [rxOperators.pluck, instrumentSimpleOperator],
  [rxOperators.publish, x_instrumentOperator],
  [rxOperators.publishBehavior, x_instrumentOperator],
  [rxOperators.publishLast, x_instrumentOperator],
  [rxOperators.publishReplay, x_instrumentOperator],
  [rxOperators.race, x_instrumentOperator],
  [rxOperators.reduce, instrumentSimpleOperator],
  [rxOperators.repeat, instrumentSimpleOperator],
  [rxOperators.repeatWhen, instrumentRepeatWhenOperator],
  [rxOperators.retry, instrumentSimpleOperator],
  [rxOperators.retryWhen, instrumentRetryWhenOperator],
  [rxOperators.refCount, x_instrumentOperator],
  [rxOperators.sample, instrumentSampleOperator],
  [rxOperators.sampleTime, x_instrumentOperator],
  [rxOperators.scan, instrumentSimpleOperator],
  [rxOperators.sequenceEqual, instrumentSequenceEqualOperator],
  [rxOperators.share, x_instrumentOperator],
  [rxOperators.shareReplay, x_instrumentOperator],
  [rxOperators.single, instrumentSimpleOperator],
  [rxOperators.skip, instrumentSimpleOperator],
  [rxOperators.skipLast, instrumentSimpleOperator],
  [rxOperators.skipUntil, instrumentSimpleOperator],
  [rxOperators.skipWhile, instrumentSimpleOperator],
  [rxOperators.startWith, instrumentSimpleOperator], // scheduler
  [rxOperators.subscribeOn, x_instrumentOperator],
  [rxOperators.switchAll, instrumentSwitchAllOperator],
  [rxOperators.switchMap, instrumentSwitchMapOperator],
  [rxOperators.switchMapTo, instrumentSwitchMapToOperator],
  [rxOperators.take, instrumentSimpleOperator],
  [rxOperators.takeLast, instrumentSimpleOperator],
  [rxOperators.takeUntil, instrumentSimpleOperator],
  [rxOperators.takeWhile, instrumentSimpleOperator],
  [rxOperators.tap, instrumentSimpleOperator],
  [rxOperators.throttle, x_instrumentOperator],
  [rxOperators.throttleTime, x_instrumentOperator],
  [rxOperators.throwIfEmpty, instrumentSimpleOperator], // delegates to 'tap'
  [rxOperators.timeInterval, x_instrumentOperator],
  [rxOperators.timeout, x_instrumentOperator],
  [rxOperators.timeoutWith, x_instrumentOperator],
  [rxOperators.timestamp, x_instrumentOperator],
  [rxOperators.toArray, instrumentSimpleOperator],
  [rxOperators.window, instrumentWindowOperator],
  [rxOperators.windowCount, x_instrumentOperator],
  [rxOperators.windowTime, x_instrumentOperator],
  [rxOperators.windowToggle, instrumentWindowToggleOperator],
  [rxOperators.windowWhen, instrumentWindowWhenOperator],
  [rxOperators.withLatestFrom, instrumentWithLatestFromOperator],
  [rxOperators.zip, instrumentZipOperator],
  [rxOperators.zipAll, instrumentZipAllOperator],
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
    instrumentSubjects();
    instrumentSubscribe();
    instrumentCreators();
    instrumentOperators();
    instrumented = true;
  }

  return rxInspector;
}
