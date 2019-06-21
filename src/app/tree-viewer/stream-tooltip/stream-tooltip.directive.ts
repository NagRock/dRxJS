import {ComponentRef, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {Overlay, OverlayPositionBuilder, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {StreamTooltipComponent} from './stream-tooltip.component';
import {StreamModel} from '../../model';

@Directive({
  selector: '[appStreamTooltip]'
})
export class StreamTooltipDirective implements OnInit, OnDestroy {

  private overlayRef: OverlayRef;

  @Input('appStreamTooltip')
  data: StreamModel;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly overlayPositionBuilder: OverlayPositionBuilder,
    private readonly overlay: Overlay,
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
    const tooltipPortal = new ComponentPortal(StreamTooltipComponent);
    const tooltipRef: ComponentRef<StreamTooltipComponent> = this.overlayRef.attach(tooltipPortal);
    tooltipRef.instance.data = this.data;
  }

  @HostListener('mouseout')
  hide() {
    this.overlayRef.detach();
  }

}
