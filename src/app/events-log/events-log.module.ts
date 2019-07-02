import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsLogComponent } from './events-log.component';

@NgModule({
  declarations: [EventsLogComponent],
  exports: [
    EventsLogComponent
  ],
  imports: [
    CommonModule
  ]
})
export class EventsLogModule { }
