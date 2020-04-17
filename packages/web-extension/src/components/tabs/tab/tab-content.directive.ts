import {Directive, TemplateRef} from '@angular/core';

@Directive({
  selector: '[drTabContent]',
})
export class TabContentDirective {

  constructor(
    readonly templateRef: TemplateRef<void>
  ) {
  }

}
