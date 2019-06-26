import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './timeline.component';
import {OverlayModule} from '../overlay/overlay.module';

@NgModule({
  declarations: [TimelineComponent],
  exports: [
    TimelineComponent
  ],
  imports: [
    CommonModule,
    OverlayModule
  ]
})
export class TimelineModule { }
