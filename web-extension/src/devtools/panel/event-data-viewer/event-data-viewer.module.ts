import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {EventDataViewerComponent} from './event-data-viewer.component';

@NgModule({
  declarations: [EventDataViewerComponent],
  exports: [
    EventDataViewerComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
  ]
})
export class EventDataViewerModule {
}

