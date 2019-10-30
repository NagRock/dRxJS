import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {EventDataViewerComponent} from './event-data-viewer.component';
import {MatCardModule, MatExpansionModule} from '@angular/material';
import {PropertyNodeModule} from '../property-node/property-node.module';

@NgModule({
  declarations: [EventDataViewerComponent],
  exports: [
    EventDataViewerComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    MatExpansionModule,
    PropertyNodeModule,
  ]
})
export class EventDataViewerModule {
}

