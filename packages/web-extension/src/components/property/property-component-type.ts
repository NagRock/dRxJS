import {Type} from '@angular/core';

export interface PropertyComponentType extends Type<unknown> {
  readonly TYPE: string;
}

export function Property() {
  return <U extends PropertyComponentType>(constructor: U) => {constructor};
}
