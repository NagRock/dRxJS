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
import {
  instrumentAuditOperator,
  instrumentBufferCountOperator,
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
  instrumentDebounceOperator,
  instrumentDelayWhenOperator,
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
  InstrumentOperator,
  instrumentRaceOperator,
  instrumentRefCountOperator,
  instrumentRepeatWhenOperator,
  instrumentRetryWhenOperator,
  instrumentSampleOperator,
  instrumentSampleTimeOperator,
  instrumentScanOperator,
  instrumentSequenceEqualOperator,
  instrumentShareOperator,
  instrumentSimpleOperator,
  instrumentSkipUntilOperator,
  instrumentSwitchAllOperator,
  instrumentSwitchMapOperator,
  instrumentSwitchMapToOperator,
  instrumentThrottleOperator,
  instrumentTimeoutWithOperator,
  instrumentWindowCountOperator,
  instrumentWindowOperator,
  instrumentWindowToggleOperator,
  instrumentWindowWhenOperator,
  instrumentWithLatestFromOperator,
  instrumentZipAllOperator,
  instrumentZipOperator,
  RxOperator
} from './operators';
import {instrumentSubjects} from './subject';
import {instrumentConnectableOperator} from './operators/instrument-connectable-operator';

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

const instrumentAsync: any = instrumentSimpleOperator; // we don't need events correlation data for now

const operators: [RxOperator, InstrumentOperator][] = [
  [rxOperators.audit, instrumentAuditOperator], // or instrumentAsync... emits are caused directly by emissions of durationSelector
  [rxOperators.auditTime, instrumentAsync],
  [rxOperators.buffer, instrumentBufferOperator],
  [rxOperators.bufferCount, instrumentBufferCountOperator], // count items
  // [rxOperators.bufferTime, instrumentAsync], // it wont work with async
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
  [rxOperators.debounce, instrumentDebounceOperator],
  [rxOperators.debounceTime, instrumentAsync],
  [rxOperators.defaultIfEmpty, instrumentSimpleOperator],
  [rxOperators.delay, instrumentAsync],
  [rxOperators.delayWhen, instrumentDelayWhenOperator],
  [rxOperators.dematerialize, instrumentSimpleOperator],
  [rxOperators.distinct, instrumentDistinctOperator],
  [rxOperators.distinctUntilChanged, instrumentSimpleOperator],
  [rxOperators.distinctUntilKeyChanged, instrumentSimpleOperator],
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
  [rxOperators.multicast, instrumentConnectableOperator],
  [rxOperators.observeOn, instrumentAsync], // unless sync scheduler is used
  [rxOperators.onErrorResumeNext, instrumentOnErrorResumeNextOperator],
  [rxOperators.pairwise, instrumentSimpleOperator],
  // [rxOperators.partition, x_instrumentOperator],
  [rxOperators.pluck, instrumentSimpleOperator],
  [rxOperators.publish, instrumentConnectableOperator],
  [rxOperators.publishBehavior, instrumentConnectableOperator],
  [rxOperators.publishLast, instrumentConnectableOperator],
  [rxOperators.publishReplay, instrumentConnectableOperator],
  [rxOperators.race, instrumentRaceOperator],
  [rxOperators.reduce, instrumentSimpleOperator],
  [rxOperators.repeat, instrumentSimpleOperator],
  [rxOperators.repeatWhen, instrumentRepeatWhenOperator],
  [rxOperators.retry, instrumentSimpleOperator],
  [rxOperators.retryWhen, instrumentRetryWhenOperator],
  [rxOperators.refCount, instrumentRefCountOperator], // count subscribers
  [rxOperators.sample, instrumentSampleOperator],
  [rxOperators.sampleTime, instrumentSampleTimeOperator], // store sampled value
  [rxOperators.scan, instrumentScanOperator], // store accumulator
  [rxOperators.sequenceEqual, instrumentSequenceEqualOperator],
  [rxOperators.share, instrumentShareOperator],
  [rxOperators.shareReplay, instrumentShareOperator],
  [rxOperators.single, instrumentSimpleOperator],
  [rxOperators.skip, instrumentSimpleOperator], // count skipped
  [rxOperators.skipLast, instrumentSimpleOperator], // count skipped
  [rxOperators.skipUntil, instrumentSkipUntilOperator],
  [rxOperators.skipWhile, instrumentSimpleOperator],
  [rxOperators.startWith, instrumentSimpleOperator], // emission scheduler
  [rxOperators.subscribeOn, instrumentSimpleOperator], // subscribe scheduler
  [rxOperators.switchAll, instrumentSwitchAllOperator],
  [rxOperators.switchMap, instrumentSwitchMapOperator],
  [rxOperators.switchMapTo, instrumentSwitchMapToOperator],
  [rxOperators.take, instrumentSimpleOperator],
  [rxOperators.takeLast, instrumentSimpleOperator],
  [rxOperators.takeUntil, instrumentSimpleOperator],
  [rxOperators.takeWhile, instrumentSimpleOperator],
  [rxOperators.tap, instrumentSimpleOperator],
  [rxOperators.throttle, instrumentThrottleOperator],
  [rxOperators.throttleTime, instrumentAsync],
  [rxOperators.throwIfEmpty, instrumentSimpleOperator], // delegates to 'tap'
  [rxOperators.timeInterval, instrumentSimpleOperator],
  [rxOperators.timeout, instrumentSimpleOperator], // throws error after timeout
  [rxOperators.timeoutWith, instrumentTimeoutWithOperator], // switch to second observable after timeout
  [rxOperators.timestamp, instrumentSimpleOperator],
  [rxOperators.toArray, instrumentSimpleOperator],
  [rxOperators.window, instrumentWindowOperator],
  [rxOperators.windowCount, instrumentWindowCountOperator], // count items
  // [rxOperators.windowTime, instrumentAsync], // it wont work with async
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
