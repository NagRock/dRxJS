import { Component, OnInit } from '@angular/core';
import {EventsService} from '../services/events.service';
import {ModelService} from '../services/model.service';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  constructor(
    private readonly eventsService: EventsService,
    private readonly modelService: ModelService,
  ) { }

  ngOnInit() {
    // this.eventsService.events$.subscribe((event) => console.log(event));
    this.modelService.model$
      .pipe(debounceTime(1000))
      .subscribe((model) => console.log(model));
  }

}
