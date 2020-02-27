import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EventsViewerComponent} from './events-viewer.component';
import {MatListModule} from '@angular/material/list';
import {MatButtonToggleModule, MatIconModule} from '@angular/material';

@NgModule({
  declarations: [EventsViewerComponent],
  exports: [
    EventsViewerComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonToggleModule,
  ]
})
export class EventsViewerModule { }
