import {ChangeDetectionStrategy, Component, ContentChild, Directive, Input, TemplateRef} from '@angular/core';

@Directive({
  selector: '[drPropertyExpand]'
})
export class PropertyExpandDirective {
  constructor(
    readonly templateRef: TemplateRef<{}>,
  ) {
  }
}

@Component({
  selector: 'dr-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyComponent {

  @Input()
  key: string;

  @Input()
  primary: boolean;

  @ContentChild(PropertyExpandDirective)
  expand: PropertyExpandDirective;

  expanded = false;

  get expandable() {
    return this.expand !== null;
  }
}
