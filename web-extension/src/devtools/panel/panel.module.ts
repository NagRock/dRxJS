import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {PanelComponent} from './panel.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
  ],
  declarations: [
    PanelComponent
  ],
  bootstrap: [PanelComponent]
})
export class PanelModule {
}

platformBrowserDynamic().bootstrapModule(PanelModule)
  .catch((err): void => {
    console.log(err);
  });

