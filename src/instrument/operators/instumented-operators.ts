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

export const instrumentConcatAllOperator = instrumentOperator();

export const instrumentConcatMapOperator = instrumentOperator(([project, resultSelector], instrument) => {
    let i = 0;
    return [wrapResult(project, (x) => instrument(x, i++)), resultSelector];
  },
);

export const instrumentConcatMapToOperator = instrumentOperator(([innerObservable, resultSelector], instrument) => {
  return [instrument(innerObservable, 'inner'), resultSelector];
});

export const instrumentDistinctOperator = instrumentOperator();

export const instrumentExhaustOperator = instrumentOperator();

export const instrumentExhaustMapOperator = instrumentOperator(([project, resultSelector], instrument) => {
    let i = 0;
    return [wrapResult(project, (x) => instrument(x, i++)), resultSelector];
  },
);

export const instrumentExpandOperator = instrumentOperator(([project, concurrent, scheduler], instrument) => {
    let i = 0;
    return [wrapResult(project, (x) => instrument(x, i++)), concurrent, scheduler];
  },
);

export const instrumentGroupByOperator = instrumentOperator();

export const instrumentMergeOperator = instrumentOperator();

export const instrumentMergeAllOperator = instrumentOperator();

export const instrumentMergeMapOperator = instrumentOperator(([project, resultSelector, concurrent], instrument) => {
    let i = 0;
    return [wrapResult(project, (x) => instrument(x, i++)), resultSelector, concurrent];
  },
);

export const instrumentMergeMapToOperator = instrumentOperator(([innerObservable, resultSelector, concurrent], instrument) => {
  return [instrument(innerObservable, 'inner'), resultSelector, concurrent];
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








