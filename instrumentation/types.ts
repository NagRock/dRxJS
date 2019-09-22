import * as rx from 'instrumented-rxjs';

export interface ObserverWithDestination extends rx.Observer<any> {
  destination: ObserverWithDestination;
}

export interface Receiver extends ObserverWithDestination {
  __receiver_id__: number;

  __set_last_received_notification_id__(notificationId: number): void;
}

export interface Sender extends ObserverWithDestination {
  __sender_id__: number;
}
