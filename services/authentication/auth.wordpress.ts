import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../../services/user.service';
import Constants from '../../Constants';
import {UtilsService} from '../../../services/utils/utils.service';
import {NotificationService} from '../../../services/notification/notification.service';
import {catchError, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class AuthWordpressService {

    constructor(
        private utils: UtilsService,
        private userService: UserService,
        private notificationService: NotificationService,
        private translate: TranslateService
    ) {
    }

    login(username: string, password: string) {
        Constants.token = null;
        this.utils.showLoader();
        return this.userService.login(
            {
                username,
                password
            })
            .pipe(
                catchError(async (e: any, caught: Observable<any>) => {
                    this.utils.dismissLoader();
                    await this.utils.showToast(await this.translate.get('WRONG_PWD').toPromise());
                    throw e;
                }),
                tap((data: any) => {
                    Constants.token = data.token;
                    this.userService.saveTokenInStorage();
                    return data;
                })
            );
    }
}
