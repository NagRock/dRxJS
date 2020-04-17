import {ChangeDetectionStrategy, Component, EventEmitter, HostBinding, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {TabsComponent} from '../tabs.component';
import {Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'button[dr-tab]',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent<T> implements OnInit, OnDestroy {

  @Input('dr-tab')
  value: T;

  @HostBinding('class.selected')
  selected: boolean;

  selectedChange = new EventEmitter<boolean>();

  private readonly destroySubject = new Subject<void>();

  constructor(
    private readonly tabs: TabsComponent<T>,
  ) {
  }

  ngOnInit(): void {
    this.tabs.addTab(this.value)
      .pipe(
        map((value) => value === this.value),
        takeUntil(this.destroySubject),
      ).subscribe((selected) => {
        this.selected = selected;
        this.selectedChange.emit(selected);
    });
  }

  @HostListener('click')
  onClick() {
    this.tabs.setTab(this.value);
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
