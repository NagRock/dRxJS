import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Instance, SourcePosition} from '../state';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-instance-selector',
  templateUrl: './instance-selector.component.html',
  styleUrls: ['./instance-selector.component.css']
})
export class InstanceSelectorComponent {
  private readonly instancesSubject = new BehaviorSubject<Instance[]>([]);
  private readonly phraseSubject = new BehaviorSubject<string>('');
  readonly hideEmptyReceiversSubject = new BehaviorSubject<boolean>(true);

  @Input()
  instance: Instance;

  @Input()
  set instances(instances: Instance[]) {
    this.instancesSubject.next(instances ? instances : []);
  }

  @Output()
  readonly instanceChange = new EventEmitter<Instance>();

  result$ = combineLatest([
    this.instancesSubject,
    this.phraseSubject,
    this.hideEmptyReceiversSubject,
  ]).pipe(
    map(([instances, phrase, hideEmptyReceivers]) => {
      console.log({instances, phrase});
      return instances
        .filter((instance) =>
          instance.definition.position.file.includes(phrase)
          || (instance.definition.position.functionName && instance.definition.position.functionName.includes(phrase))
          || instance.definition.name.includes(phrase)
        )
        .filter((instance) => hideEmptyReceivers ? instance.receivers.length > 0 : true)
        .reverse()
        .slice(0, 16);
    }),
  );

  search: boolean = true;
  hideEmptyReceivers = true;

  phraseChange(phrase: string) {
    this.phraseSubject.next(phrase);
  }

  instanceSelected(instance: Instance) {
    this.search = false;
    this.instanceChange.emit(instance);
  }

  onHideEmptyReceivers(state: boolean) {
    this.hideEmptyReceivers = state;
    this.hideEmptyReceiversSubject.next(state);
  }

  getFormattedPosition(position: SourcePosition) {
    const items : Array<string | number> = [position.file];

    if (position.line > 0) {
      items.push(position.line);
    }

    if (position.column > 0) {
      items.push(position.column);
    }

    return items.join(':');
  }
}
