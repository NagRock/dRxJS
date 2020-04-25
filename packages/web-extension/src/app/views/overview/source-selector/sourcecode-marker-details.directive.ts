import {Directive, TemplateRef} from '@angular/core';
import {SourcecodeMarker} from './sourcecode-marker';

@Directive({
  selector: '[drSourcecodeMarkerDetails]'
})
export class SourcecodeMarkerDetailsDirective {

  constructor(
    readonly templateRef: TemplateRef<SourcecodeMarker>
  ) { }

}
