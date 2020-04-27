import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {EAGER_SINGLETON, EagerSingletonsModule} from './eager-singletons';
import {InstrumentationStateService} from './services/instrumentation-state.service';
import {HomeModule} from './home/home.module';
import {InstrumentationStateRouterConnector} from './services/instrumentation-state-router-connector';
import {ReferencePropertyModule} from '../components/reference-property';
import {DefaultPropertyModule} from '../components/default-property/default-property.module';
import {ModelPropertyModule} from '../components/model-property/model-property.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    EagerSingletonsModule.forRoot(),
    HomeModule,
    DefaultPropertyModule.forRoot(),
    ModelPropertyModule.forRoot(),
    ReferencePropertyModule.forRoot(),
  ],
  providers: [
    {
      provide: EAGER_SINGLETON,
      multi: true,
      useExisting: InstrumentationStateService,
    },
    {
      provide: EAGER_SINGLETON,
      multi: true,
      useExisting: InstrumentationStateRouterConnector,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
