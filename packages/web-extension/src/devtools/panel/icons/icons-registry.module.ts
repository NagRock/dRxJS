import {NgModule} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {browser} from '../../../types/webextension-polyfill-ts';

@NgModule({
})
export class IconsRegistryModule {
  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    const icons = [
      'arrow-back',
      'more-vert',
      'mail',
    ];

    icons.forEach((icon) => {
      const url = browser.extension.getURL(`/assets/mat-icon/${icon.replace(/-/g, '_')}-24px.svg`);
      console.log(`${icon} -> ${url}`);
      iconRegistry.addSvgIcon(icon, sanitizer.bypassSecurityTrustResourceUrl(url));
    });

    // iconRegistry.getNamedSvgIcon('arrow-back').subscribe({
    //   next(val) {
    //     console.log('icon', val);
    //   },
    //   error(err) {
    //     console.error('icon error', err);
    //   }
    // })
  }
}
