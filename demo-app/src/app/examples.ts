import {asapScheduler, combineLatest, concat, EMPTY, identity, of, range} from 'instrumented-rxjs';
import {distinctUntilChanged, map, concatMap, repeat, expand, concatAll} from 'instrumented-rxjs/operators';

export const runSimpleExample = () => {

  const source$ = of('a', 'b', 'c', 'd')
    .pipe(
      map((x0) => `${x0}:${x0}`),
      map((x1) => `${x1}:${x1}`),
      distinctUntilChanged(),
    );
  source$.subscribe(((x) => console.log('result:', x)));
};

export const runConcatMapExample = () => {
  of(0, 1, 2).pipe(
    concatMap((i) => range(i).pipe(map((j) => `${j} of ${i}`)))
  ).subscribe();
};

export const runConcatAllExample = () => {
  of(
    // of(0),
    // of(0, 1),
    // of(0, 1, 2),
  ).pipe(
    concatAll(),
  ).subscribe((x) => console.log(x));
};


export const runExpandExample = () => {
  const stream$ = of(0, 1, 2).pipe(
    expand((x) => {
      if (x == 0) {
        return EMPTY;
      } else {
        return of(x - 1).pipe(repeat(x - 1));
      }
    })
  );

  stream$.subscribe((x) => console.log(x));
};

export const runCombineExample = () => {

  const a$ = of('a', 'aa', 'aaa')
    .pipe(
      map((x) => x.toUpperCase()),
    );
  const b$ = of('b', 'bb', 'bbb')
    .pipe(
      map((x) => x.toUpperCase()),
    );

  const c$ = combineLatest(a$, b$);

  concat(a$, b$, c$, Promise.resolve(42)).subscribe((x) => console.log(x));
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