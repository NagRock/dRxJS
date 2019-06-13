import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {pipe} from "rxjs";
import {tap} from "rxjs/operators";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


(window as any).__instrument__ = (operator, fileName, expr, line, char) => {
  return pipe(operator, tap((x => console.log(`${fileName} (${line}:${char}) | ${expr}`, x))));
};
