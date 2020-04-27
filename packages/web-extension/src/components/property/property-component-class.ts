import {Type} from '@angular/core';

export interface PropertyComponentClassType extends Type<unknown> {
  readonly TEST: (value: any) => number | boolean;
}

export function PropertyComponentClass() {
  return <U extends PropertyComponentClassType>(constructor: U) => {constructor};
}
