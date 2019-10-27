import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {EventDataViewerComponent} from './event-data-viewer.component';
import {MatCardModule} from '@angular/material';
import {PropertyExplorerModule} from '../property-explorer';

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
  ]
})
export class EventDataViewerModule {
}

