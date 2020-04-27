import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import {PropertyComponentClassType} from './property-component-class';

export const PROPERTY_COMPONENT = new InjectionToken<PropertyComponentClassType>('PROPERTY_COMPONENT');

@Injectable({providedIn: 'root'})
export class PropertyComponentsRegistry {

  constructor(
    @Optional() @Inject(PROPERTY_COMPONENT) private readonly components: PropertyComponentClassType[],
  ) {
  }

  get(value: any) {
    const component = this.components.reduce((max, comp) => {
      const test = comp.TEST(value);
      return test > max.test ? {test, comp} : max;
    }, {test: -Infinity, comp: undefined} as {test: number, comp: PropertyComponentClassType | undefined});
    if (component.comp) {
      return component.comp;
    } else {
      throw new Error(`Not found property component for value '${value}'`);
    }
  }
}
