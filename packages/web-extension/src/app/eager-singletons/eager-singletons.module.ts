import {ModuleWithProviders, NgModule, Optional} from '@angular/core';
import {EagerSingletonsInitializer} from './eager-singletons-initializer';

@NgModule({})
export class EagerSingletonsModule {
  static forRoot(): ModuleWithProviders<EagerSingletonsModule> {
    return {
      ngModule: EagerSingletonsModule,
      providers: [EagerSingletonsInitializer],
    };
  }

  constructor(
    @Optional() eagerSingletonsInitializer: EagerSingletonsInitializer,
  ) {
  }
}
