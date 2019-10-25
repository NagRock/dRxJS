import {
  asapScheduler,
  asyncScheduler,
  BehaviorSubject,
  concat,
  ConnectableObservable,
  EMPTY,
  interval,
  Observable,
  of,
  onErrorResumeNext,
  range,
  Subject,
  throwError
} from 'rxjs';
import {
  concatAll,
  concatMap,
  delayWhen,
  distinctUntilChanged,
  expand,
  finalize,
  map, mapTo,
  mergeMap,
  observeOn,
  publish,
  repeat,
  share,
  subscribeOn,
  take,
  withLatestFrom
} from 'rxjs/operators';

export const runObservableExample = () => {
  const o = new Observable((s) => {
    s.next('sync');
    s.next('sync');
    setTimeout(() => {
      s.next('async');
      s.complete();
    });
  });

  const subject = new Subject();


  subject.subscribe((x) => console.log('sub1', x));
  subject.subscribe((x) => console.log('sub2', x));

  o.subscribe({
    next(value) {
      subject.next(value);
    },
    complete() {
      subject.complete();
    }
  });
  o.subscribe(subject);


};

export const runNestedSubscribesExample = () => {
  const o$ = of(1, 2);

  of('a', 'b').subscribe((a) => {
    o$.subscribe((n) => console.log(a, n));
  });
};

export const runNestedSubscribeWithSubjectExample = () => {
  const o$ = of(1, 2);
  const subject$ = new Subject();

  of('a', 'b').subscribe((a) => {
    o$.subscribe(subject$);
  });
};

export const runNestedSubscribeWithSubjectProxyExample = () => {
  const o$ = of(1, 2);
  const subject$ = new BehaviorSubject('');

  of('a', 'b').subscribe((a) => {
    o$.subscribe((n) => subject$.next(`${a}:${n}`));
  });
};

export const runWithLatestFromExample = () => {
  interval(66).pipe(
    withLatestFrom(
      interval(99).pipe(mapTo('a')),
      interval(33).pipe(mapTo('b')),
    ),
    take(10),
  ).subscribe();
};

export const runDelayExample = () => {
  of(1, 2, 3).pipe(
    delayWhen((n) => interval(n * 1000).pipe(take(n))),
  ).subscribe();
};

export const runIntervalExample = () => {
  interval(1000).pipe(
    finalize(() => console.log('finalize')),
    take(3),
    take(1),
  ).subscribe((x) => console.log(x));
};

export const runRepeatExample = () => {
  of(1, 2).pipe(
    // tap((x) => console.log('tap', x)),
    repeat(2),
  )
    .subscribe((x) => console.log('sub', x));
};

export const runSubscribeOnExample = () => {
  of(1, 2).pipe(
    mergeMap((n) => of(n).pipe(
      repeat(n),
      subscribeOn(asyncScheduler),
      observeOn(asyncScheduler)
    )),
  ).subscribe((n) => console.log(n));
};

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
  of(0, 1, 2)
    .pipe(
      concatMap(
        (i) => range(i)
          .pipe(
            map((j) => `${j} of ${i}`),
          ),
      )
    )
    .subscribe();
};

export const runConcatAllExample = () => {
  of(
    of(),
    of(0),
    of(1, 2),
  ).pipe(
    observeOn(asyncScheduler),
    concatAll(),
  ).subscribe((x) => console.log(x));
};


export const runExpandExample = () => {
  const stream$ = of(0, 1, 2).pipe(
    expand((x) => {
      if (x === 0) {
        return EMPTY;
      } else {
        return of(x - 1).pipe(repeat(x - 1));
      }
    })
  );

  stream$.subscribe((x) => console.log(x)).unsubscribe();
};

export const runConcatExample = () => {

  const a$ = of('a', 'aa')
    .pipe(
      map((x) => x.toUpperCase()),
    );
  const b$ = of('b', 'bb')
    .pipe(
      map((x) => x.toUpperCase()),
    );

  concat(
    a$,
    b$,
    asyncScheduler,
    // Promise.resolve(42),
  ).subscribe((x) => console.log(x));
};

export const runOnErrorResumeNextExample = () => {

  const a$ = of('a', 'aa', 'aaa')
    .pipe(
      map((x) => x.toUpperCase()),
    );

  const err$ = throwError('error!');

  const b$ = of('b', 'bb', 'bbb')
    .pipe(
      map((x) => x.toUpperCase()),
    );

  onErrorResumeNext(
    a$,
    err$,
    b$,
  ).subscribe((x) => console.log(x));
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

export const runSubjectExample = () => {
  const subject$ = new BehaviorSubject(42);
  const stream$ = subject$
    .pipe(
      map((FIRST) => FIRST),
      map((LAST) => LAST),
    );

  stream$.subscribe((x) => console.log('sub1:', x));

  subject$.next(1);
  subject$.next(2);
  subject$.next(3);

  stream$.subscribe((x) => console.log('sub2:', x));

  subject$.next(3);
  subject$.next(4);
  subject$.next(5);

  subject$.complete();
};


export const runShareExample = () => {
  const stream$ = of(1, 2, 3)
    .pipe(
      observeOn(asapScheduler),
      map((FIRST) => FIRST),
      // tap((x) => console.log('tap:', x)),
      share(),
    );

  stream$.subscribe(((x) => console.log('sub1:', x)));
  stream$.subscribe(((x) => console.log('sub2:', x)));
  stream$.subscribe(((x) => console.log('sub3:', x)));
};

export const runConnectableExample = () => {
  const stream$ = of(1, 2, 3)
    .pipe(
      // map((FIRST) => FIRST),
      // tap((x) => console.log('tap:', x)),
      publish(),
      // refCount(),
    ) as ConnectableObservable<any>;

  stream$
  // .pipe(map((AFTER_SHARE1) => AFTER_SHARE1))
    .subscribe(((x) => console.log('sub1:', x)));

  stream$
  // .pipe(map((AFTER_SHARE2) => AFTER_SHARE2))
    .subscribe(((x) => console.log('sub2:', x)));

  stream$.connect();
};
