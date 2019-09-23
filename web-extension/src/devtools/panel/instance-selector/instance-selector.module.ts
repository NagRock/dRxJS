import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstanceSelectorComponent } from './instance-selector.component';
import {MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [InstanceSelectorComponent],
  exports: [
    InstanceSelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule
  ]
})
export class InstanceSelectorModule { }
