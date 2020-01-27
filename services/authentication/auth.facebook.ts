import {Injectable} from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import {UserService} from '../../../services/user.service';
import Constants from '../../Constants';
import {UtilsService} from '../../../services/utils/utils.service';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {NotificationService} from '../../../services/notification/notification.service';
import {NavService} from '../../../services/nav/nav.service';

@Injectable()
export class AuthFacebookService {

    constructor(
        private platform: Platform,
        private fb: Facebook,
        private utils: UtilsService,
        private userService: UserService,
        private notificationService: NotificationService,
        private navService: NavService,
        private navCtrl: NavController
    ) {
    }

    public login() {
        Constants.token = null;
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
                                this.utils.showLoader();
                                this.userService.loginFb(objLogin).subscribe((resp: any) => {
                                    if (resp) {
                                        if (resp.isNew) {
                                            this.utils.dismissLoader();
                                            this.navService.data = {
                                                userID: res.authResponse.userID,
                                                // accessToken: res.authResponse.accessToken,
                                                first_name: profile.first_name,
                                                last_name: profile.last_name,
                                                email: profile.email,
                                                provider: 'facebook'
                                            };
                                            this.navCtrl.navigateForward('signup');
                                        } else {
                                            Constants.token = resp.token;
                                            this.userService.saveTokenInStorage();
                                            this.userService.getUser().toPromise().then(res2 => {
                                                this.utils.dismissLoader();
                                                if (res2) {
                                                    this.userService.user = res2;
                                                    this.navCtrl.navigateRoot('tabs');
                                                }
                                            }, err => {
                                                this.utils.dismissLoader();
                                                this.utils.showToast();
                                            });
                                        }
                                    } else {
                                        this.utils.showToast();
                                    }
                                }, (err) => {
                                    this.utils.dismissLoader();
                                    this.utils.showToast();
                                });
                            }
                        });
                })
                .catch(e => console.log('Error logging into Facebook', e));
        }
    }
}
