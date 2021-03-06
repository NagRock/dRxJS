import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EventsViewerComponent} from './events-viewer.component';
import {MatListModule} from '@angular/material/list';

@NgModule({
  declarations: [EventsViewerComponent],
  exports: [
    EventsViewerComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
  ]
})
export class EventsViewerModule { }
