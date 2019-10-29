import {NgModule} from '@angular/core';
import {EventExplorerComponent} from './event-explorer.component';
import {MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import {PropertyExplorerModule} from '../property-explorer';
import {PropertyModule} from '../property';

@NgModule({
  declarations: [EventExplorerComponent],
  exports: [EventExplorerComponent],
  imports: [
    MatCardModule,
    MatExpansionModule,
    CommonModule,
    PropertyExplorerModule,
    MatButtonModule,
    MatIconModule,
    PropertyModule
  ]
})
export class EventExplorerModule {

}
