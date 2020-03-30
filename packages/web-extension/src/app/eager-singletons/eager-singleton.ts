import {InjectionToken} from '@angular/core';

export const EAGER_SINGLETON = new InjectionToken<EagerSingleton>('EAGER_SINGLETON');

export interface EagerSingleton {
  eagerSingletonInit(): void;
}
