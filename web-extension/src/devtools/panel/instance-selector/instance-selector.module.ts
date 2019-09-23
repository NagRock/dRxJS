import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstanceSelectorComponent } from './instance-selector.component';
import {MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule} from '@angular/material';

@NgModule({
  declarations: [InstanceSelectorComponent],
  exports: [
    InstanceSelectorComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class InstanceSelectorModule { }
