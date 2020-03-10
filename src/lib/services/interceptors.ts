import {Inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CoreConfigService} from './core-config.service';
import {AuthWordpressService} from './authentication/auth.wordpress';
import {AuthPlainService} from './authentication/auth.plain';
import { ICoreConfig } from '../shared/interfaces/config.interface';


@Injectable({
  providedIn: 'root'
})
export class GenericInterceptors implements HttpInterceptor {

  public token: string;
  public reqQueue: { req: HttpRequest<any>, next: HttpHandler }[] = [];

  constructor(
    private authWordpressService: AuthWordpressService,
    private authPlainService: AuthPlainService,
    @Inject(CoreConfigService) private config: ICoreConfig,
  ) {}

  private getUsersLocale(defaultValue: string): string {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return defaultValue;
    }
    const wn = window.navigator as any;
    let lang = wn.languages ? wn.languages[0] : defaultValue;
    lang = lang || wn.language || wn.browserLanguage || wn.userLanguage;
    return lang;
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const locale = this.getUsersLocale(this.config.locale) || 'en';
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
    if (this.token) {
      headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
        locale
      });
    } else {
      headers = req.headers.append('locale', locale);
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

  shouldBeIntercepted(event: HttpResponse<any>) {
    return event.url.indexOf('/mock') === -1;
  }
}
