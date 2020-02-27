import {Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {Overlay, OverlayPositionBuilder, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';

@Directive({
  selector: '[appOverlay]'
})
export class OverlayDirective<T> implements OnInit, OnDestroy {

  private overlayRef: OverlayRef;

  @Input('appOverlay')
  templateRef: TemplateRef<{ $implicit: T }>;

  @Input('appOverlayData')
  data: T;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly overlayPositionBuilder: OverlayPositionBuilder,
    private readonly overlay: Overlay,
    private readonly viewContainerRef: ViewContainerRef,
  ) {
  }

  ngOnInit() {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
      }]);
    this.overlayRef = this.overlay.create({positionStrategy});
  }

  ngOnDestroy(): void {
    this.hide();
  }

  @HostListener('mouseenter')
  show() {
    const overlayPortal = new TemplatePortal(this.templateRef, this.viewContainerRef, {$implicit: this.data});
    this.overlayRef.attach(overlayPortal);
  }

  @HostListener('mouseout')
  hide() {
    this.overlayRef.detach();
  }
}
