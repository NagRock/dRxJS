import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstanceSelectorComponent } from './instance-selector.component';
import {MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';

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
    MatInputModule,
    MatCardModule,
  ]
})
export class InstanceSelectorModule { }
