import {Component} from '@angular/core';
import {from, interval} from 'rxjs';
import {browser} from '../../types/webextension-polyfill-ts';
import {switchMap} from 'rxjs/operators';
import {EventService, RxInstanceInspectorEvent, RxSourceMappedInspectorEvent} from "../event.service";

@Component({
  selector: 'd-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class PanelComponent {
  events: Array<RxInstanceInspectorEvent | RxSourceMappedInspectorEvent> = [];

  counter = interval(1500)
    .pipe(switchMap(() => from(browser.devtools.inspectedWindow.eval('_dRxJS.getData()'))));

  constructor(private eventService: EventService) {
    this.eventService.event$.subscribe(events => {
      this.events = [...this.events, ...events];
    })
  }
}
