import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  HostBinding,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef
} from '@angular/core';

export const PROPERTY_VALUE = new InjectionToken<any>('PROPERTY_VALUE');

@Directive({
  selector: '[drPropertyExpand]'
})
export class PropertyExpandDirective implements OnInit, OnDestroy {
  constructor(
    private readonly parent: PropertyComponent,
    readonly templateRef: TemplateRef<{}>,
  ) {
  }

  ngOnInit(): void {
    this.parent.expand = this;
    this.parent.elementRef.nativeElement.classList.add('expandable');
  }

  ngOnDestroy(): void {
    this.parent.expand = undefined;
    this.parent.elementRef.nativeElement.classList.remove('expandable');
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

  constructor(
    readonly elementRef: ElementRef<HTMLElement>,
  ) {
  }
}
