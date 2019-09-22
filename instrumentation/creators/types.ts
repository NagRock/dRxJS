import {Observable} from 'instrumented-rxjs';

export type RxCreator<OUT = any, ARGS extends any[] = any[]> = (...args: ARGS) => Observable<OUT>;
export type InstrumentRxCreator = <OUT, ARGS extends any[]>(creator: RxCreator<OUT, ARGS>) => RxCreator<OUT, ARGS>;
