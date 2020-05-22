import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class GenericInterceptors implements HttpInterceptor {

  public static CUSTOM_PARAMS_NAME = 'CUSTOM_PARAMS';
  public static CUSTOM_PARAMS_VALUES = {
    NO_HEADERS: 'NO_HEADERS'
  };

  public reqQueue: { req: HttpRequest<any>, next: HttpHandler }[] = [];
  public token: string;

  constructor(
  ) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newReq: any;
    let headers: HttpHeaders;

    if (req.url.indexOf('http') !== -1) {
      return next.handle(req);
    }
    this.token = undefined; // set with the authService token
    // HEADERS
    if (req.params.get(GenericInterceptors.CUSTOM_PARAMS_NAME) !== GenericInterceptors.CUSTOM_PARAMS_VALUES.NO_HEADERS && this.token) {
      headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
      });
    }
    // HOST
    if (req.url[0] !== '/') {
      throw new Error('Path non valido. Anteporre "/"');
    }
    const pathPrefix = req.url.split('/')[1];
    // looks for endpoint in module settings
    const endpoint = environment['ngc:restEndpointList'].find((value) => value.prefix === pathPrefix);

    if (!endpoint) {
    console.warn('Endpoint non trovato. Inserirlo nelle configurazioni del modulo');
    }
    newReq = req.clone({
    url: endpoint.url + req.url.replace('/' + pathPrefix, ''),
    headers
    });

    return next.handle(newReq)
      .pipe(
        map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse && this.shouldBeIntercepted(event)) {
              event = event.clone({body: event.body});
            }
            return event;
          }
        )
      );
  }

  private shouldBeIntercepted(event: HttpResponse<any>): boolean {
    return event.url.indexOf('/mock') === -1;
  }
}
