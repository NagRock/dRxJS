import {Observable} from 'rxjs';

export type RxCreator<OUT = any, ARGS extends any[] = any[]> = (...args: ARGS) => Observable<OUT>;
export type InstrumentRxCreator = <OUT, ARGS extends any[]>(creator: RxCreator<OUT, ARGS>) => RxCreator<OUT, ARGS>;

export const instrumentCreator =
  <OUT = any, ARGS extends any[] = any>(creator: RxCreator<OUT, ARGS>): RxCreator<OUT, ARGS> => {
    return (...args: ARGS) => {
      return creator(...args);
    };
  };
