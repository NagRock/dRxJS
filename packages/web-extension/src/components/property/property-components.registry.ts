import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import {PropertyComponentType} from './property-component-type';

export const PROPERTY_COMPONENT = new InjectionToken<PropertyComponentType>('PROPERTY_COMPONENT');

@Injectable({providedIn: 'root'})
export class PropertyComponentsRegistry {

  private readonly components: Record<string, PropertyComponentType> = {};

  constructor(
    @Optional() @Inject(PROPERTY_COMPONENT) components: PropertyComponentType[],
  ) {
    this.components = components !== null
      ? components.reduce((cs, c) => {
        cs[c.TYPE] = c;
        return cs;
      }, {})
      : [];
  }

  get(type: string) {
    const component = this.components[type];
    if (component) {
      return component;
    } else {
      throw new Error(`Not found property component for type '${type}'`);
    }
  }
}
