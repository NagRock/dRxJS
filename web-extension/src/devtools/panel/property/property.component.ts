import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewRef
} from '@angular/core';

@Directive({
  selector: '[drPropertyExpandable]'
})
export class PropertyExpandableDirective {
  constructor(
    readonly templateRef: TemplateRef<{}>,
  ) {}
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dr-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
})
export class PropertyComponent {
  @Input()
  name: string;

  @Input()
  variant: 'primary' | 'secondary' = 'primary';

  @ContentChild(PropertyExpandableDirective)
  expandable: PropertyExpandableDirective;

  @ViewChild('outlet', {read: ViewContainerRef})
  outletViewContainerRef: ViewContainerRef;

  expanded = false;
  embeddedViewRef: ViewRef;

  constructor(
    private readonly cdr: ChangeDetectorRef,
  ) {}

  toggle() {
    if (this.expanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  private expand() {
    this.embeddedViewRef = this.outletViewContainerRef.createEmbeddedView(this.expandable.templateRef, {});
    this.expanded = true;
    this.embeddedViewRef.markForCheck();
    this.cdr.markForCheck();
  }

  private collapse() {
    this.embeddedViewRef.destroy();
    this.embeddedViewRef = undefined;
    this.expanded = false;
    this.cdr.markForCheck();
  }
}
