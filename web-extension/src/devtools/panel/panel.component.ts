import {Component} from '@angular/core';
import {from, interval} from 'rxjs';
import {browser} from '../../types/webextension-polyfill-ts';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'd-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class PanelComponent {
  counter = interval(1500)
    .pipe(switchMap(() => from(browser.devtools.inspectedWindow.eval('_dRxJS.getData()'))));
}
