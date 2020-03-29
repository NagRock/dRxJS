import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root',
})
export class ResourcesService {

  constructor(
    private readonly matSnackBar: MatSnackBar,
  ) {
  }

  open(file: string, line: number) {
    // todo: because of the issue with BasicSourceMapConsumer (source-map package), relative url parts are truncated
    // todo: this should b fixed in the 0.8.0 version in source-map
    // @ts-ignore
    chrome.devtools.panels.openResource(file/*.replace('webpack:///', 'webpack:///./')*/, line - 1, (result) => {
      if (result.isError) {
        this.matSnackBar.open(`Could not open "${file}"`, undefined, {duration: 2000});
      }
    });
  }
}
