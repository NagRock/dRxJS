import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Declaration} from '../../../model/model';

@Component({
  selector: 'dr-declaration-list',
  templateUrl: './declaration-list.component.html',
  styleUrls: ['./declaration-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclarationListComponent implements OnInit {

  @Input()
  declarations: Declaration[];

  constructor() {
  }

  ngOnInit() {
  }

}
