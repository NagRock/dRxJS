import {Observable, ObservableFromConstructor, ObservableFromOperator, ObservableFromSubscribe} from './model';

export function getObservablesChain(observable: Observable): string[] {
  if (observable instanceof ObservableFromConstructor) {
    return [observable.constructor.name];
  } else if (observable instanceof ObservableFromOperator) {
    return [...getObservablesChain(observable.source), observable.operator.name];
  } else if (observable instanceof ObservableFromSubscribe) {
    return ['.subscribe'];
  }
}
