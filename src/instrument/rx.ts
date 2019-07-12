import * as instrumentedRx from 'instrumented-rxjs';
import * as instrumentedRxOperators from 'instrumented-rxjs/operators';

export {instrumentedRx, instrumentedRxOperators};

export type Rx = typeof instrumentedRx;
export type RxOperators = typeof instrumentedRxOperators;

export const rx: Rx = {...instrumentedRx};
export const rxOperators: RxOperators = {...instrumentedRxOperators};
