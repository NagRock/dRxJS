import {instrumentedRx, rx} from './rx';
import {
  trackCompleteNotification,
  trackErrorNotification,
  trackInstance,
  trackNextNotification,
  trackSubjectComplete,
  trackSubjectDefinition,
  trackSubjectError,
  trackSubjectNext,
  trackSubscribe, trackUnsubscribe
} from './track';
import {Receiver, Sender} from './types';
import {Subscriber} from 'rxjs';

export function instrumentSubject(subject) {
  const instrumentedSubject = class InstrumentedSubject<T> extends subject {
    private readonly instance: number;

    constructor(...args) {
      super();
      const definition = trackSubjectDefinition(subject, args);
      this.instance = trackInstance(definition);
    }

    next(value?: T): void {
      trackSubjectNext(this.instance, value);
      super.next(value);
    }

    error(error: any): void {
      trackSubjectError(this.instance, error);
      super.error(error);
    }

    complete(): void {
      trackSubjectComplete(this.instance);
      super.complete();
    }

    subscribe(observerOrNext?, error?, complete?) {
      if (observerOrNext instanceof Subscriber) {
        return this.subscribeSubscriber(observerOrNext as any);
      } else {
        return super.subscribe(observerOrNext, error, complete);
      }
    }

    private subscribeSubscriber(subscriber: Receiver & Sender) {
      const senderId = this.instance;
      const receiverId = subscriber.__receiver_id__;

      trackSubscribe(senderId, receiverId);
      const subscription = super.subscribe({
        __skip_instrumentation__: true,
        next: (value) => {
          const notificationId = trackNextNotification(senderId, receiverId, value, undefined);
          subscriber.__set_last_received_notification_id__(notificationId);
          subscriber.next(value);
        },
        error: (error) => {
          const notificationId = trackErrorNotification(senderId, receiverId, error, undefined);
          subscriber.__set_last_received_notification_id__(notificationId);
          subscriber.error(error);
        },
        complete: () => {
          const notificationId = trackCompleteNotification(senderId, receiverId, undefined);
          subscriber.__set_last_received_notification_id__(notificationId);
          subscriber.complete();
        },
      } as any);
      return new rx.Subscription(() => {
        trackUnsubscribe(senderId, receiverId);
        subscription.unsubscribe();
      });
    }
  };

  Object.defineProperty(instrumentedRx, subject.name, {
    get() {
      return instrumentedSubject;
    },
  });
}

export function instrumentSubjects() {
  instrumentSubject(instrumentedRx.Subject);
  instrumentSubject(instrumentedRx.BehaviorSubject);
  instrumentSubject(instrumentedRx.ReplaySubject);
  instrumentSubject(instrumentedRx.AsyncSubject);
}
