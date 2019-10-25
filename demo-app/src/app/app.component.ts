import {Component} from '@angular/core';
import * as examples from './examples';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  examples = Object.entries(examples).map(([name, run]) => ({name, run}));
}
