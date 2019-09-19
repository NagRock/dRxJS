import {
  getCause,
  trackCompleteNotification,
  trackCreatorDefinition,
  trackErrorNotification,
  trackInstance,
  trackNextNotification,
  trackSubscribe,
  trackUnsubscribe
} from '../track';
import {isScheduler, rx} from '../rx';
import {Receiver, Sender} from '../types';
import {RxCreator} from './types';
import {from, isObservable, ObservableInput} from 'instrumented-rxjs';

const instrumentObservableInputs =
  (args: any[], instrument: (input: ObservableInput<any>, inputKey: number | string) => ObservableInput<any>): any[] => {
    if (Array.isArray(args[0])) {
      const [first, ...rest] = args;
      return [
        first.map(instrument),
        ...rest,
      ];
    } else {
      return args.map(instrument);
    }
  };

export const instrumentCombiningCreator = (
  instrumentArgs = instrumentObservableInputs,
  onReceived?: (inputKey: number | string, senderId: number, notificationId: number) => void,
  onSend?: (receiverId: number, notificationId: number) => void,
) =>
  <OUT = any, ARGS extends any[] = any>(creator: RxCreator<OUT, ARGS>): RxCreator<OUT, ARGS> => {
    return (...args: ARGS) => {
      const definitionId = trackCreatorDefinition(creator, args);
      let lastReceivedNotificationId: number;
      return rx.Observable.create((observer: Receiver & Sender) => {
        const senderId = trackInstance(definitionId);
        const receiverId = observer.__receiver_id__;

        trackSubscribe(senderId, receiverId);
        const instrumentedArgs = instrumentArgs(
          args,
          (input, inputKey) => {
            const observableInput = isObservable(input) ? input : from(input);
            return rx.Observable.create((receiver: Receiver) => {
              receiver.__receiver_id__ = senderId;
              receiver.__set_last_received_notification_id__ = notificationId => lastReceivedNotificationId = notificationId;
              return observableInput.subscribe(receiver);
            });
          }
        ) as ARGS;
        const subscription = creator(...instrumentedArgs).subscribe({
          __skip_instrumentation__: true,
          next: (value) => {
            const notificationId = trackNextNotification(senderId, receiverId, value, getCause(lastReceivedNotificationId));
            observer.__set_last_received_notification_id__(notificationId);
            observer.next(value);
          },
          error: (error) => {
            const notificationId = trackErrorNotification(senderId, receiverId, error, getCause(lastReceivedNotificationId));
            observer.__set_last_received_notification_id__(notificationId);
            observer.error(error);
          },
          complete: () => {
            const notificationId = trackCompleteNotification(senderId, receiverId, getCause(lastReceivedNotificationId));
            observer.__set_last_received_notification_id__(notificationId);
            observer.complete();
          },
        } as any);
        return () => {
          trackUnsubscribe(senderId, receiverId);
          subscription.unsubscribe();
        };
      });
    };
  };

// ([$a, $b, ...]), (a$, b$, ...)!D, resultSelector!D, scheduler!D, P:lastValues
export const instrumentCombineLatest = instrumentCombiningCreator(
  ((args, instrument) => {
    let resultSelector;
    let scheduler;

    if (isScheduler(args[args.length - 1])) {
      scheduler = args.pop();
    }

    if (typeof args[args.length - 1] === 'function') {
      resultSelector = args.pop();
    }

    if (args.length === 1 && Array.isArray(args[0])) {
      return [
        args[0].map(instrument),
        ...resultSelector ? [resultSelector] : [],
        ...scheduler ? [scheduler] : [],
      ];
    } else {
      return [
        ...args.map(instrument),
        ...resultSelector ? [resultSelector] : [],
        ...scheduler ? [scheduler] : [],
      ];
    }
  })
);

// (a$, b$, ...), resultSelector!D, scheduler!D
export const instrumentConcat = instrumentCombiningCreator(
  ((args, instrument) => {
    let scheduler;

    if (isScheduler(args[args.length - 1])) {
      scheduler = args.pop();
    }

    return [
      ...args.map(instrument),
      ...scheduler ? [scheduler] : [],
    ];
  })
);

// ([a$, b$, ...]), (a$, b$, ...)!D
export const instrumentForkJoin = instrumentCombiningCreator(
  ((args, instrument) => {
    let resultSelector;

    if (typeof args[args.length - 1] === 'function') {
      resultSelector = args.pop();
    }

    if (args.length === 1 && typeof args[0] === 'object' && Object.getPrototypeOf(args[0]) === Object.prototype) {
      return [
        Object.entries(args[0]).reduce((o, [key, val]) => {
          o[key] = instrument(val as any, key);
          return o;
        }, {}),
        ...resultSelector ? [resultSelector] : [],
      ];
    } else if (args.length === 1 && Array.isArray(args[0])) {
      return [
        args[0].map(instrument),
        ...resultSelector ? [resultSelector] : [],
      ];
    } else {
      return [
        ...args.map(instrument),
        ...resultSelector ? [resultSelector] : [],
      ];
    }
  })
);

// (a$, b$, ..., concurrent?), scheduler!D
export const instrumentMerge = instrumentCombiningCreator(
  (((args, instrument) => {
    let concurrent = Number.POSITIVE_INFINITY;
    let scheduler = null;

    if (isScheduler(args[args.length - 1])) {
      scheduler = args.pop();
    }

    if (typeof args[args.length - 1] === 'number') {
      concurrent = args.pop();
    }

    return [
      ...args.map(instrument),
      ...concurrent !== undefined ? [concurrent] : [],
      ...scheduler !== undefined ? [scheduler] : [],
    ];
  }))
);

// (a$, b$, ...), ([a$, b$, ...])
export const instrumentOnErrorResumeNext = instrumentCombiningCreator(
  ((args, instrument) => {
    if (args.length === 1 && Array.isArray(args[0])) {
      return args[0].map(instrument);
    } else {
      return args.map(instrument);
    }
  })
);

// (a$, b$, ...), ([a$, b$, ...]), resultSelector!D, P:buffersPerInput
export const instrumentZip = instrumentCombiningCreator(
  ((args, instrument) => {
    let resultSelector;

    if (typeof resultSelector === 'function') {
      resultSelector = args.pop();
    }

    return [
      ...args.map(instrument),
      ...resultSelector ? [resultSelector] : [],
    ];
  })
);
