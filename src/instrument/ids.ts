let nextDefinitionId = 0;
let nextInstanceId = 0;
let nextNotificationId = 0;

export function getNextDefinitionId() {
  return nextDefinitionId++;
}

export function getNextInstanceId() {
  return nextInstanceId++;
}

export function getNextNotificationId() {
  return nextNotificationId++;
}
