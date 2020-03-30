import {Inject, Injectable, Optional} from '@angular/core';
import {EAGER_SINGLETON, EagerSingleton} from './eager-singleton';

@Injectable({
  providedIn: 'root'
})
export class EagerSingletonsInitializer {

  constructor(
    @Optional() @Inject(EAGER_SINGLETON) eagerSingletons: Array<EagerSingleton>,
  ) {
    if (eagerSingletons !== null) {
      eagerSingletons.forEach((eagerSingleton) => eagerSingleton.eagerSingletonInit());
    }
  }
}
