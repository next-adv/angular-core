import {Injectable} from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import {UserService} from '../../../services/user.service';
import {UtilsService} from '../../../services/utils/utils.service';
import {NotificationService} from '../../../services/notification/notification.service';
import {NavService} from '../../../services/nav/nav.service';
import Constants from '../../Constants';

@Injectable()
export class AuthApple {

    constructor(
        private platform: Platform,
        private utils: UtilsService,
        private userService: UserService,
        private notificationService: NotificationService,
        private navService: NavService,
        private navCtrl: NavController
    ) {
    }

    public login() {
        Constants.token = null;
        // @ts-ignore
        window.cordova.plugins.SignInWithApple.signin(
            {requestedScopes: [0, 1]},
            async succ => {
                console.log('SignInWithApple', JSON.stringify(succ));

                await this.utils.showLoader();
                this.userService.signInWithApple({appleID: succ.user}).toPromise().then(async (resp: any) => {
                    console.log('signInWithApple', JSON.stringify(resp));
                    if (resp) {
                        if (resp.isNew) {
                            this.utils.dismissLoader();
                            this.navService.data = {
                                appleID: succ.user,
                                first_name: succ.fullName.familyName,
                                last_name: succ.fullName.givenName,
                                email: succ.email,
                                provider: 'apple'
                            };
                            this.navCtrl.navigateForward('signup');
                        } else {
                            Constants.token = resp.token;
                            this.userService.saveTokenInStorage();
                            await this.userService.getUser().toPromise().then(res2 => {
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
                }, err => {
                    this.utils.dismissLoader();
                    this.utils.showToast();
                    console.log('signInWithApple_err', JSON.stringify(err));
                });
            },
            err => {
                this.utils.dismissLoader();
                this.utils.showToast();
            }
        );
    }
}
