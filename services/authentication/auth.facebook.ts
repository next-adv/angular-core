import {Injectable} from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {Storage} from '@ionic/storage';

import {NavService} from '../nav.service';
import {UIHelperService} from '../helpers/ui-helper.service';

@Injectable({
    providedIn: 'root'
})
export class AuthFacebookService {

    user: any;
    token: string;

    constructor(
        private platform: Platform,
        private fb: Facebook,
        private navService: NavService,
        private navCtrl: NavController,
        private httpClient: HttpClient,
        private storage: Storage,
        private uiHelper: UIHelperService,
    ) {
    }

    private loginAPI(data) {
        return this.httpClient.post('/wp-api/v1/loginfb', data);
    }

    public getUser() {
        return this.httpClient.post('/wp-api/wp/v2/users/me', '');
    }

    public login() {
        this.token = null;
        if (this.platform.is('cordova')) {
            this.fb.login(['public_profile', 'email'])
                .then((res: FacebookLoginResponse) => {
                    this.fb.api('me?fields=name,first_name,last_name,email', [])
                        .then(profile => {
                            if (res && res.authResponse) {
                                const objLogin = {
                                    userID: res.authResponse.userID,
                                    accessToken: res.authResponse.accessToken,
                                    email: profile.email
                                };
                                this.uiHelper.showLoader();
                                this.loginAPI(objLogin).subscribe((resp: any) => {
                                    if (resp) {
                                        if (resp.isNew) {
                                            this.uiHelper.dismissLoader();
                                            this.navService.data = {
                                                userID: res.authResponse.userID,
                                                first_name: profile.first_name,
                                                last_name: profile.last_name,
                                                email: profile.email,
                                                provider: 'facebook'
                                            };
                                            this.navCtrl.navigateForward('signup');
                                        } else {
                                            this.token = resp.token;
                                            this.storage.set('token', this.token);
                                            this.getUser().toPromise().then(res2 => {
                                                this.uiHelper.dismissLoader();
                                                if (res2) {
                                                    this.user = res2;
                                                    this.navCtrl.navigateRoot('tabs');
                                                }
                                            }, err => {
                                                this.uiHelper.dismissLoader();
                                                this.uiHelper.showToast();
                                            });
                                        }
                                    } else {
                                        this.uiHelper.showToast();
                                    }
                                }, (err) => {
                                    this.uiHelper.dismissLoader();
                                    this.uiHelper.showToast();
                                });
                            }
                        });
                })
                .catch(e => console.log('Error logging into Facebook', e));
        }
    }
}
