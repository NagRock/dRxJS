import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {EventDataViewerComponent} from './event-data-viewer.component';
import {MatCardModule, MatExpansionModule} from '@angular/material';
import {PropertyExplorerModule} from '../property-explorer';
import {EventExplorerModule} from '../event-explorer';

@NgModule({
  declarations: [EventDataViewerComponent],
  exports: [
    EventDataViewerComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    PropertyExplorerModule,
    EventExplorerModule,
    MatExpansionModule,
  ]
})
export class EventDataViewerModule {
}

