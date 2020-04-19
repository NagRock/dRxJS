import {Injectable, NgZone} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

type Resource = chrome.devtools.inspectedWindow.Resource;



@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  readonly resources$: Observable<Resource[]>;

  constructor(private readonly ngZone: NgZone) {
    this.resources$ = new Observable<Resource[]>(
      (observer) => {
        chrome.devtools.inspectedWindow.getResources((rs) => {
          const resources = rs.filter((r) => !r.url.startsWith('debugger:///'));
          ngZone.run(() => observer.next(resources));
          chrome.devtools.inspectedWindow.onResourceAdded.addListener((r) => {
            if (!r.url.startsWith('debugger:///')) {
              resources.push(r);
              ngZone.run(() => observer.next(resources));
            }
          });
        });
      },
    );
  }

  getContent(url: string): Observable<string | undefined> {
    return this.resources$.pipe(
      map((resources) => resources.find((resource) => resource.url === url)),
      switchMap((resource) => resource !== undefined
        ? this.getResourceContent(resource)
        : of(undefined))
    );
  }

  getResourceContent(resource: Resource): Observable<string> {
    return new Observable((observer) => {
      resource.getContent((content) => {
        this.ngZone.run(() => {
          observer.next(content);
          observer.complete();
        });
      });
    });
  }

}
