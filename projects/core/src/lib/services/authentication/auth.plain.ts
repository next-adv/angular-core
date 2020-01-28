import {Injectable} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';

//import { UIHelperService } from '../helpers/ui-helper.service';

@Injectable({
    providedIn: 'root'
})
export class AuthPlainService {

    public token: string;
    public user: any;

    constructor(
        private translate: TranslateService,
        private httpClient: HttpClient,
        //private uiHelper: UIHelperService,
        //private storage: Storage,
    ) {
    }

    login(username: string, password: string) {
        this.token = undefined;
        //this.uiHelper.showLoader();
        return this.httpClient.post('API_ENDPOINT',
            {
                username,
                password
            })
            .pipe(
                catchError(async (e: any, caught: Observable<any>) => {
                    //this.uiHelper.dismissLoader();
                    //await this.uiHelper.showToast(await this.translate.get('WRONG_PWD').toPromise());
                    throw e;
                }),
                tap((data: any) => {
                    this.user.email = data.user_email;
                    this.token = data.token;
                    //this.storage.set('token', this.token);
                    return data;
                })
            );
    }
}
