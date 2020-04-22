import {Directive, TemplateRef} from '@angular/core';
import {SourcecodeMarker} from './sourcecode-marker';

@Directive({
  selector: '[drSourcecodeMarkerDetails]'
})
export class SourcecodeMarkerDetailsDirective<T> {

  constructor(
    readonly templateRef: TemplateRef<SourcecodeMarker<T>>
  ) { }

}
