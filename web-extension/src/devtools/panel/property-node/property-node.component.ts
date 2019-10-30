import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PropertyNode} from './property-node';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dr-properties-tree',
  templateUrl: './property-node.component.html',
  styleUrls: ['./property-node.component.scss'],
})
export class PropertyNodeComponent {

  @Input()
  node: PropertyNode;

  expanded = false;

  evaluationResult: PropertyNode;
  evaluationError: any;

  eval() {
    if (this.node.lazy) {
      this.node.eval().subscribe({
        next: (result) => {
          this.evaluationResult = result;
        },
        error: (error) => {
          this.evaluationError = error;
        }
      });
    }
  }
}
