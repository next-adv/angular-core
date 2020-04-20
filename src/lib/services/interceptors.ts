import {Inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {CoreConfigService} from './core-config.service';
import {AuthWordpressService} from './authentication/auth.wordpress';
import {AuthPlainService} from './authentication/auth.plain';
import { ICoreConfig } from '../shared/interfaces/config.interface';


@Injectable()
export class GenericInterceptors implements HttpInterceptor {

  public static CUSTOM_PARAMS_NAME = 'CUSTOM_PARAMS';
  public static CUSTOM_PARAMS_VALUES = {
    NO_HEADERS: 'NO_HEADERS'
  };

  public token: string;
  public reqQueue: { req: HttpRequest<any>, next: HttpHandler }[] = [];

  constructor(
    private authWordpressService: AuthWordpressService,
    private authPlainService: AuthPlainService,
    @Inject(CoreConfigService) private config: ICoreConfig,
  ) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newReq: any;
    let headers: HttpHeaders;

    this.token = this.authWordpressService.token || this.authPlainService.token;
    // I18N
    if (req.url.indexOf('i18n') !== -1) {
      // TO MANAGE IT.json AND EN.json
      const newReq2 = req.clone({
        url: req.url
      });
      return next.handle(newReq2);
    }
    // HEADERS
    if (req.params.get(GenericInterceptors.CUSTOM_PARAMS_NAME) !== GenericInterceptors.CUSTOM_PARAMS_VALUES.NO_HEADERS &&  this.token) {
      headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.token
      });
    }
    // HOST
    if (req.url[0] !== '/') {
      throw new Error('Path non valido. Anteporre "/"');
    }
    const pathPrefix = req.url.split('/')[1];
    if (pathPrefix === 'mock') {
      newReq = req.clone({
        url: this.config.restApi.mockRestEndpoint + req.url,
        headers
      });
    } else {
      // looks for endpoint in module settings
      const endpoint = this.config.restApi.restEndpointList.find((value) => value.prefix === pathPrefix);

      if (!endpoint) {
        throw new Error('Endpoint non trovato. Inserirlo nelle configurazioni del modulo');
      }
      newReq = req.clone({
        url: endpoint.url + req.url.replace('/' + pathPrefix, ''),
        headers
      });
    }

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
