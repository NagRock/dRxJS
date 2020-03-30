import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {IconsRegistryModule} from './panel/icons/icons-registry.module';
import {PanelModule} from './panel/panel.module';
import {EAGER_SINGLETON, EagerSingletonsModule} from './eager-singletons';
import {InstrumentationStateService} from './services/instrumentation-state.service';
import {HomeModule} from './home/home.module';
import {InstrumentationStateRouterConnector} from './services/instrumentation-state-router-connector';

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
    IconsRegistryModule,
    EagerSingletonsModule.forRoot(),
    HomeModule,
    PanelModule,
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
