import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  HostBinding,
  InjectionToken,
  Input,
  OnDestroy,
  TemplateRef
} from '@angular/core';

export const DATA = new InjectionToken<any>('DATA');

@Directive({
  selector: '[drPropertyExpand]'
})
export class PropertyExpandDirective implements OnDestroy {
  constructor(
    private readonly parent: PropertyComponent,
    readonly templateRef: TemplateRef<{}>,
  ) {
    parent.expand = this;
    parent.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.parent.expand = undefined;
    this.parent.cdr.markForCheck();
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
  primary = true;

  @Input()
  type: string;

  @Input()
  data: any;

  expand?: PropertyExpandDirective;

  @HostBinding('class.expanded')
  expanded = false;

  @HostBinding('class.expandable')
  get expandable() {
    return this.expand !== undefined;
  }

  constructor(
    readonly cdr: ChangeDetectorRef,
  ) {
  }
}
