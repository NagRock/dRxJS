import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SourcecodeComponent } from './sourcecode.component';
import {ButtonModule} from '../../../../components/button/button.module';
import { SourcecodeMarkerDetailsDirective } from './sourcecode-marker-details.directive';

@NgModule({
  declarations: [SourcecodeComponent, SourcecodeMarkerDetailsDirective],
  exports: [
    SourcecodeComponent,
    SourcecodeMarkerDetailsDirective,
  ],
  imports: [
    CommonModule,
    ButtonModule
  ]
})
export class SourceSelectorModule { }
