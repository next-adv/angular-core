import {Inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CoreConfigService} from './core-config.service';
import {AuthWordpressService} from './authentication/auth.wordpress';
import {AuthPlainService} from './authentication/auth.plain';
import { ICoreConfig } from '../../shared/interfaces/config.interface';


@Injectable({
  providedIn: 'root'
})
export class GenericInterceptors implements HttpInterceptor {

  token: string;
  reqQueue: { req: HttpRequest<any>, next: HttpHandler }[] = [];

  constructor(
    private authWordpressService: AuthWordpressService,
    private authPlainService: AuthPlainService,
    @Inject(CoreConfigService) private config: ICoreConfig,
  ) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const locale = this.config.locale || 'en';
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
    if (req.url.indexOf('/mock') !== -1) {
      newReq = req.clone({
        url: this.config.restApi.mockRestEndpoint + req.url,
        headers
      });
    } else if (req.url.indexOf('/wp-api') !== -1) {
      headers = headers.delete('locale');
      newReq = req.clone({
        url: this.config.restApi.wordpressRestEndpoint + req.url.replace('/wp-api', ''),
        headers
      });
    } else {
      newReq = req.clone({
        url: this.config.restApi.restEndpoint + req.url,
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
