import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PropertiesTreeNode} from './properties-tree-node';
import {Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dr-properties-tree',
  templateUrl: './properties-tree.component.html',
  styleUrls: ['./properties-tree.component.scss'],
})
export class PropertiesTreeComponent implements OnInit {

  @Input()
  node: PropertiesTreeNode;

  expanded = false;
  evaluated = false;
  evaluationError: string;
  children: Observable<PropertiesTreeNode[]>;

  ngOnInit(): void {
    this.children = this.node.getChildren().pipe(shareReplay(1));
  }

  getState(): 'lazy' | 'leaf' | 'tree' {
    return (this.node.isLazy() && !this.evaluated) ? 'lazy' : (this.node.isExpandable() ? 'tree' : 'leaf');
  }

  getType() {
    const type = this.node.getType();
    if (typeof type === 'string') {
      return type;
    } else {
      return type[0];
    }
  }

  getDecorator() {
    const type = this.node.getType();
    if (typeof type === 'string') {
      return {prefix: '', suffix: ''};
    } else {
      return type[1];
    }
  }

  eval() {
    this.node.eval().subscribe({
      error: (error) => {
        this.evaluationError = error;
      },
      complete: () => {
        this.evaluated = true;
      }
    });
  }
}
