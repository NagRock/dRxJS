import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PanelComponent} from './panel.component';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTreeModule
} from '@angular/material';
import {TreeViewerModule} from './tree-viewer/tree-viewer.module';
import {OverlayModule} from '@angular/cdk/overlay';
import {EventsViewerModule} from './events-viewer/events-viewer.module';
import {InstanceSelectorModule} from './instance-selector/instance-selector.module';
import {EventDataViewerModule} from './event-data-viewer/event-data-viewer.module';

@NgModule({
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    TreeViewerModule,
    OverlayModule,
    EventsViewerModule,
    EventDataViewerModule,
    InstanceSelectorModule,
    MatMenuModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ],
  declarations: [
    PanelComponent
  ],
  exports: [
    PanelComponent
  ]
})
export class PanelModule {
}
