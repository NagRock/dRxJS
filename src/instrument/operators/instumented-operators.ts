import {instrumentOperator} from './instrument-operator';

const wrapResult = (f, wrap) => {
  return (...args) => wrap(f(...args));
};

export const instrumentSimpleOperator = instrumentOperator();

export const instrumentBufferOperator = instrumentOperator();

export const instrumentBufferToggleOperator = instrumentOperator();

export const instrumentBufferWhenOperator = instrumentOperator();

export const instrumentCatchErrorOperator = instrumentOperator();

export const instrumentCombineAllOperator = instrumentOperator();

export const instrumentCombineLatestOperator = instrumentOperator(); // deprecated

export const instrumentConcatOperator = instrumentOperator(); // deprecated

export const instrumentConcatAllOperator = instrumentOperator({
  wrapReceiver(observer, instrument) {
    return {
      next(value) {
        observer.next(instrument(value));
      },
      error(error) {
        observer.error(error);
      },
      complete() {
        observer.complete();
      },
    };
  }
});

export const instrumentConcatMapOperator = instrumentOperator({
  wrapArgs([project, resultSelector], instrument) {
    return [wrapResult(project, instrument), resultSelector];
  }
});

export const instrumentConcatMapToOperator = instrumentOperator({
  wrapArgs: ([innerObservable, resultSelector], instrument) => {
    return [instrument(innerObservable), resultSelector];
  }
});

export const instrumentDistinctOperator = instrumentOperator();

export const instrumentExhaustOperator = instrumentOperator();

export const instrumentExhaustMapOperator = instrumentOperator({
  wrapArgs([project, resultSelector], instrument) {
    return [wrapResult(project, instrument), resultSelector];
  }
});

export const instrumentExpandOperator = instrumentOperator({
  wrapArgs([project, concurrent, scheduler], instrument) {
    return [wrapResult(project, instrument), concurrent, scheduler];
  }
});

export const instrumentGroupByOperator = instrumentOperator();

export const instrumentMergeOperator = instrumentOperator();

export const instrumentMergeAllOperator = instrumentOperator();

export const instrumentMergeMapOperator = instrumentOperator({
  wrapArgs([project, resultSelector, concurrent], instrument) {
    return [wrapResult(project, instrument), resultSelector, concurrent];
  }
});

export const instrumentMergeMapToOperator = instrumentOperator({
  wrapArgs([innerObservable, resultSelector, concurrent], instrument) {
    return [instrument(innerObservable), resultSelector, concurrent];
  }
});

export const instrumentMergeScanOperator = instrumentOperator();

export const instrumentOnErrorResumeNextOperator = instrumentOperator();

export const instrumentRepeatWhenOperator = instrumentOperator();

export const instrumentRetryWhenOperator = instrumentOperator();

export const instrumentSampleOperator = instrumentOperator();

export const instrumentSequenceEqualOperator = instrumentOperator();

export const instrumentSwitchAllOperator = instrumentOperator();

export const instrumentSwitchMapOperator = instrumentOperator();

export const instrumentSwitchMapToOperator = instrumentOperator();

export const instrumentWindowOperator = instrumentOperator();

export const instrumentWindowToggleOperator = instrumentOperator();

export const instrumentWindowWhenOperator = instrumentOperator();

export const instrumentWithLatestFromOperator = instrumentOperator();

export const instrumentZipOperator = instrumentOperator();

export const instrumentZipAllOperator = instrumentOperator();








