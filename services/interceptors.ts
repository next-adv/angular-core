import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthAppleService } from '../services/authentication/auth.apple';
import { AuthFacebookService } from '../services/authentication/auth.facebook';
import { AuthWordpressService } from '../services/authentication/auth.wordpress';

@Injectable({
    providedIn: 'root'
})
export class GenericInterceptors implements HttpInterceptor {

    token: string;
    reqQueue: {req: HttpRequest<any>, next: HttpHandler}[] = [];

    constructor(
        private authAppleService: AuthAppleService,
        private authFacebookService: AuthFacebookService,
        private authWordpressService: AuthWordpressService,
        ) {
        this.token = this.authAppleService.token || this.authFacebookService.token || this.authWordpressService.token;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        let newReq: any;
        let headers: HttpHeaders;

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
                locale: environment.locale
            });
        } else {
            headers = new HttpHeaders({
                locale: environment.locale
            });
        }

        // HOST
        if (req.url.indexOf('/mock') !== -1) {
            newReq = req.clone({
                url: environment.mockApiEndpoint + req.url,
                headers
            });
        } else if (req.url.indexOf('/wp-api') !== -1) {
            headers = headers.delete('locale');
            newReq = req.clone({
                url: environment.wordpressApiEndpoint + req.url.replace('/wp-api', ''),
                headers
            });
        } else {
            newReq = req.clone({
                url: environment.apiEndpoint + req.url,
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
