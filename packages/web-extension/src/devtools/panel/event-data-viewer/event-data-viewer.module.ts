import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {EventDataViewerComponent} from './event-data-viewer.component';
import {MatCardModule, MatExpansionModule} from '@angular/material';
import {StatePropertyModule} from '../state-property';

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
    StatePropertyModule,
  ]
})
export class EventDataViewerModule {
}

