import {Injectable} from '@angular/core';
import Constants from '../angular-core/Constants';
import {UtilsService} from './utils/utils.service';
import {Storage} from '@ionic/storage';
import {NavController, Platform} from '@ionic/angular';
import {Push} from '@ionic-native/push/ngx';
import {Device} from '@ionic-native/device/ngx';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';

/**
 * @deprecated
 * use the auth service instead
 */
@Injectable({
    providedIn: 'root'
})
export class UserService {
    loginEndpoint: any = '/wp-api/jwt-auth/v1/token';
    signupEndpoint: any = '/wp-api/v1/register';
    autologinEndpoint: any = '/wp-api/jwt-auth/v1/token/validate';
    getUserEndpoint: any = '/wp-api/wp/v2/users/me';
    updateUserEndpoint: any = '/wp-api/v1/update';
    loginFbEndpoint: any = '/wp-api/v1/loginfb';
    changePasswordEndpoint: any = '/wp-api/v1/change_password';
    restorePasswordEndpoint: any = '/wp-api/v1/restore_password';
    updateDeviceEndpoint: any = '/wp-api/v1/update_device';
    regDeviceEndpoint: any = '/wp-api/v1/reg_device';
    unregDeviceEndpoint: any = '/wp-api/v1/unreg_device';
    verifyAppleUserEndpoint: any = '/wp-api/v1/verifyAppleID';

    user: any = {};

    constructor(
        public httpClient: HttpClient,
        public storage: Storage,
        public utils: UtilsService,
        public navCtrl: NavController,
        public push: Push,
        public platform: Platform,
        public device: Device
    ) {
    }

    autologin() {
        return this.httpClient.post(this.autologinEndpoint, '', {
            headers: {
                Authorization: 'Bearer ' + Constants.token
            }
        });
    }

    login(data) {
        return this.httpClient.post(this.loginEndpoint, data)
            .pipe(
                tap((data2: any) => {
                    this.user.email = data2.user_email;
                })
            );
    }

    saveTokenInStorage() {
        this.storage.set('token', Constants.token);
    }

    signup(data) {
        return this.httpClient.post(this.signupEndpoint, data);
    }

    getUser() {
        return this.httpClient.post(this.getUserEndpoint, '', {
            headers: {
                Authorization: 'Bearer ' + Constants.token
            }
        });
    }

    loginFb(data) {
        return this.httpClient.post(this.loginFbEndpoint, data);
    }

    updateUser() {
        const obj = {
            email: this.user.email,
            first_name: this.user.first_name,
            last_name: this.user.last_name,
        };
        return this.httpClient.post(this.updateUserEndpoint, obj);
    }

    changePassword(newPassword) {
        const obj = {
            email: this.user.email,
            password: newPassword
        };
        return this.httpClient.post(this.changePasswordEndpoint, obj);
    }

    restorePassword(mEmail) {
        const obj = {
            email: mEmail
        };
        return this.httpClient.post(this.restorePasswordEndpoint, obj);
    }

    registerDevice(obj: any) {
        return this.httpClient.post(this.regDeviceEndpoint, obj);
    }

    updateDevice(map) {
        const obj = {
            topics: map,
            userID: this.user.id,
            device: {
                uuid: this.device.uuid,
                regId: Constants.registrationId,
                platform: Constants.isIOS ? 'iOS' : 'Android'
            }
        };
        return this.httpClient.post(this.updateDeviceEndpoint, obj);
    }

    unregisterDevice() {
        const obj = {
            userID: this.user.id,
            uuid: this.device.uuid,
        };
        return this.httpClient.post(this.unregDeviceEndpoint, obj).subscribe();
    }

    signInWithApple(obj) {
        return this.httpClient.post(this.verifyAppleUserEndpoint, obj);
    }

}
