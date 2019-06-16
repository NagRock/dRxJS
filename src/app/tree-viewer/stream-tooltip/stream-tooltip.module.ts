import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StreamTooltipComponent} from './stream-tooltip.component';
import {StreamTooltipDirective} from './stream-tooltip.directive';

@NgModule({
  declarations: [StreamTooltipComponent, StreamTooltipDirective],
  imports: [
    CommonModule
  ],
  exports: [StreamTooltipDirective],
  entryComponents: [StreamTooltipComponent],
})
export class StreamTooltipModule {
}
