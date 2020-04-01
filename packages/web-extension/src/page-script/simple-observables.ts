import {Observable} from 'rxjs';

export type SimpleSubscribe<T> = (subscriber: SimpleSubscriber<T>) => void;

export interface SimpleSubscriber<T> {
  next(value: T): void;
}

export interface SimpleSubscriberFunction<T> {
  (value: T): void;
}

export type SimpleOperator<T, R> = (observable: SimpleObservable<T>) => SimpleObservable<R>;

export class SimpleObservable<T> {
  constructor(
    private readonly _subscribe: SimpleSubscribe<T>,
  ) {
  }

  subscribe(subscriber: SimpleSubscriber<T> | SimpleSubscriberFunction<T>) {
    if (typeof subscriber === 'function') {
      this._subscribe({next: subscriber});
    } else {
      this._subscribe(subscriber);
    }
  }

  pipe<R>(operator: SimpleOperator<T, R>): SimpleObservable<R> {
    return operator(this);
  }
}

export class SimpleSubject<T> extends SimpleObservable<T> implements SimpleSubscriber<T> {
  private readonly subscribers: SimpleSubscriber<T>[] = [];

  constructor() {
    super((subscriber) => this.subscribers.push(subscriber));
  }

  next(value: T): void {
    const length = this.subscribers.length;
    for (let i = 0; i < length; i++) {
      const subscriber = this.subscribers[i];
      subscriber.next(value);
    }
  }
}

class AsyncMapSubscriber<T, R> implements SimpleSubscriber<T> {
  private readonly queue: T[] = [];
  private awaiting = false;

  constructor(
    private readonly destination: SimpleSubscriber<R>,
    private readonly project: (value: T) => Promise<R>,
  ) {
  }

  next(value: T): void {
    if (this.awaiting) {
      this.queue.push(value);
    } else {
      this.awaitNext(value);
    }
  }

  private awaitNext(sourceValue: T) {
    this.awaiting = true;
    const promise = this.project(sourceValue);
    promise.then((destinationValue) => {
      this.destination.next(destinationValue);
      if (this.queue.length === 0) {
        this.awaiting = false;
      } else {
        this.awaitNext(this.queue.shift());
      }
    });
  }
}

export function asyncMap<T, R>(project: (value: T) => Promise<R>): SimpleOperator<T, R> {
  return (source) => new SimpleObservable((destination) => {
    source.subscribe(new AsyncMapSubscriber(destination, project));
  });
}

declare const Zone: any;

export function runInRootZone<T>(): SimpleOperator<T, T> {
  return (source) => new SimpleObservable((destination) => {
    source.subscribe((value) => Zone.root.run(() => destination.next(value)));
  });
}
