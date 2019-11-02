import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {browser} from '../../../types/webextension-polyfill-ts';

@Injectable({
  providedIn: 'root',
})
export class ResourcesService {

  constructor(
    private readonly matSnackBar: MatSnackBar,
  ) {
  }

  open(file: string, line: number) {
    // @ts-ignore
    browser.devtools.panels.openResource(file/*.replace('webpack:///', 'webpack:///./')*/, line - 1, (result) => {
      if (result.isError) {
        this.matSnackBar.open(`Could not open "${file}"`, undefined, {duration: 2000});
      }
    });
  }
}
