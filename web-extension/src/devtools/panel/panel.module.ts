import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {PanelComponent} from './panel.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatIconModule, MatTreeModule} from '@angular/material';
import {TreeViewerModule} from './tree-viewer/tree-viewer.module';
import {OverlayModule} from '@angular/cdk/overlay';
import {EventsViewerModule} from './events-viewer/events-viewer.module';
import {InstanceSelectorModule} from './instance-selector/instance-selector.module';
import {EventDataViewerModule} from './event-data-viewer/event-data-viewer.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    TreeViewerModule,
    OverlayModule,
    EventsViewerModule,
    EventDataViewerModule,
    InstanceSelectorModule,
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

