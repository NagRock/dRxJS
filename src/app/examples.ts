import {of} from 'instrumented-rxjs';
import {distinctUntilChanged, map} from 'instrumented-rxjs/operators';

export const runSimpleExample = () => {

  const source$ = of('a', 'b', 'c', 'd')
    .pipe(
      map((x0) => `${x0}:${x0}`),
      map((x1) => `${x1}:${x1}`),
      distinctUntilChanged(),
    );
  source$.subscribe(((x) => console.log('result:', x)));
};

export const runSimpleExample3 = () => {

  const source$ = of('a', 'b', 'c', 'd')
    .pipe(
      map((zeroMap) => `${zeroMap}:${zeroMap}`),
    );

  const stream$ = source$
    .pipe(
      map((firstMap) => `${firstMap}:${firstMap}`),
      // shareReplay(1),
      map((lastMap) => `${lastMap}:${lastMap}`),
    );

  stream$.subscribe(((x) => console.log('result:', x)));
  // stream$.subscribe(((x) => console.log('result:', x)));
};

export const runSimpleExample2 = () => {

  const stream$ = of('a', 'b', 'c', 'd')
    .pipe(
      map((zeroMap) => `${zeroMap}:${zeroMap}`),
      // mergeMap((mergeX) => {
      //   return of(mergeX, mergeX);
      // }),
      map((firstMap) => `${firstMap}:${firstMap}`),
      // tap(() => console.trace()),
      // delay(1000),
      // shareReplay(1),
      map((lastMap) => `${lastMap}:${lastMap}`),
    );

  stream$.subscribe(((x) => console.log('result:', x)));
  // stream$.subscribe(((x) => console.log('result:', x)));
};


export const runSimpleExampleWithPrimitives = () => {
  const stream$ = of('a', 'a', 'a', 'b', 'a', 'c', 'd')
    .pipe(
      map((FIRST) => FIRST),
      map((LAST) => LAST),
    );

  stream$.subscribe(((x) => console.log('result:', x)));
};
