import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Definition} from '../../../model/model';

@Component({
  selector: 'dr-definition-list',
  templateUrl: './definition-list.component.html',
  styleUrls: ['./definition-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefinitionListComponent implements OnInit {

  @Input()
  definitions: Definition[];

  constructor() {
  }

  ngOnInit() {
  }

}
