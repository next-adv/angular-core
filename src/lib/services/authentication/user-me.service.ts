import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoreConfigService } from '../core-config.service';
import { ICoreConfig } from '../../shared/interfaces/config.interface';

@Injectable({
    providedIn: 'root'
})
export class UserMeService {

    constructor(
        private httpClient: HttpClient,
        @Inject(CoreConfigService) private config: ICoreConfig,
    ) {}

    public getUserMe(token?: string, body?: any, options?: any): Promise<any> {
        const userMePath = this.config.restApi
        .restPathList.filter(value => value.prefix === 'main-api')
        .find(value => value.type === 'userMe');
        const opt = {
            headers: {
                authorization: 'Bearer ' + token
            },
            ...options
        };

        return this.httpClient.post(`/${userMePath.prefix}${userMePath.url}`, body, opt).toPromise();
    }
}
