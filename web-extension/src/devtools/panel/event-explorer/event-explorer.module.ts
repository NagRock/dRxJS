import {NgModule} from '@angular/core';
import {EventExplorerComponent} from './event-explorer.component';
import {MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import {PropertyExplorerModule} from '../property-explorer';

@NgModule({
  declarations: [EventExplorerComponent],
  exports: [EventExplorerComponent],
  imports: [
    MatCardModule,
    MatExpansionModule,
    CommonModule,
    PropertyExplorerModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class EventExplorerModule {

}
