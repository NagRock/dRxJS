let nextObservableId = 0;
let nextObservableInstanceId = 0;
let nextNotificationId = 0;

export function getNextObservableId() {
  return nextObservableId++;
}

export function getNextObservableInstanceId() {
  return nextObservableInstanceId++;
}

export function getNextNotificationId() {
  return nextNotificationId++;
}
