import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SourceSelectorComponent } from './source-selector.component';
import {ButtonModule} from '../../../../components/button/button.module';

@NgModule({
  declarations: [SourceSelectorComponent],
  exports: [
    SourceSelectorComponent
  ],
  imports: [
    CommonModule,
    ButtonModule
  ]
})
export class SourceSelectorModule { }
