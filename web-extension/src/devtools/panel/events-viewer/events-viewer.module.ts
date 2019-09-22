import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsViewerComponent } from './events-viewer.component';

@NgModule({
  declarations: [EventsViewerComponent],
  exports: [
    EventsViewerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class EventsViewerModule { }
