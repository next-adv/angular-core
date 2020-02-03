import {Injectable, Inject} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

/*import { environment } from '../../environments/environment';
import { AuthAppleService } from './authentication/auth.apple';
import { AuthFacebookService } from './authentication/auth.facebook';*/
import { CoreConfigService } from './core-config.service';
import { AuthWordpressService } from './authentication/auth.wordpress';

export interface ICoreConfig {
    restEndpoint: string;
    mockRestEndpoint?: string;
    wordpressRestEndpoint?: string;
    locale: string;
}

@Injectable({
    providedIn: 'root'
})
export class GenericInterceptors implements HttpInterceptor {

    token: string;
    reqQueue: {req: HttpRequest<any>, next: HttpHandler}[] = [];

    constructor(
        //private authAppleService: AuthAppleService,
        //private authFacebookService: AuthFacebookService,
        private authWordpressService: AuthWordpressService,
        @Inject(CoreConfigService) private config: ICoreConfig,
        ) {
        this.token = /*this.authAppleService.token || this.authFacebookService.token || */this.authWordpressService.token;
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
                locale: this.config.locale
            });
        } else {
            headers = new HttpHeaders({
                locale: this.config.locale
            });
        }

        // HOST
        if (req.url.indexOf('/mock') !== -1) {
            newReq = req.clone({
                url: this.config.mockRestEndpoint + req.url,
                headers
            });
        } else if (req.url.indexOf('/wp-api') !== -1) {
            headers = headers.delete('locale');
            newReq = req.clone({
                url: this.config.wordpressRestEndpoint + req.url.replace('/wp-api', ''),
                headers
            });
        } else {
            newReq = req.clone({
                url: this.config.restEndpoint + req.url,
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