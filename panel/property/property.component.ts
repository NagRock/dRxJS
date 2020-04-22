import {ChangeDetectionStrategy, Component, ContentChild, Directive, Input, TemplateRef, HostBinding} from '@angular/core';

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
  primary: boolean = true;

  @ContentChild(PropertyExpandDirective, {static: true})
  expand: PropertyExpandDirective;

  @HostBinding('class.expanded')
  expanded = false;

  @HostBinding('class.expandable')
  get expandable() {
    return this.expand !== undefined;
  }
}
