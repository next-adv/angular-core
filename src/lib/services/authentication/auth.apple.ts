import {Injectable} from '@angular/core';
import {NavController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';

import {NavService} from '../nav.service';
import { UIHelperService } from '../helpers/ui-helper.service';

@Injectable({
    providedIn: 'root'
})
export class AuthAppleService {

    token: string;
    user: any;

    constructor(
        private navService: NavService,
        private navCtrl: NavController,
        private uiHelper: UIHelperService,
        private httpClient: HttpClient,
        private storage: Storage,
    ) {
    }

    public getUser() {
        return this.httpClient.post('/wp-api/wp/v2/users/me', '');
    }

    public login() {
        this.token = undefined;
        // @ts-ignore
        window.cordova.plugins.SignInWithApple.signin(
            {requestedScopes: [0, 1]},
            async succ => {
                console.log('SignInWithApple', JSON.stringify(succ));

                await this.uiHelper.showLoader();
                this.httpClient.post('/wp-api/v1/verifyAppleID', {appleID: succ.user})
                .subscribe(async (resp: any) => {
                    console.log('signInWithApple', JSON.stringify(resp));
                    if (resp) {
                        if (resp.isNew) {
                            this.uiHelper.dismissLoader();
                            this.navService.data = {
                                appleID: succ.user,
                                first_name: succ.fullName.familyName,
                                last_name: succ.fullName.givenName,
                                email: succ.email,
                                provider: 'apple'
                            };
                            this.navCtrl.navigateForward('signup');
                        } else {
                            this.token = resp.token;
                            this.storage.set('token', this.token);
                            await this.getUser().toPromise().then(res2 => {
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
                }, err => {
                    this.uiHelper.dismissLoader();
                    this.uiHelper.showToast();
                    console.log('signInWithApple_err', JSON.stringify(err));
                });
            },
            err => {
                this.uiHelper.dismissLoader();
                this.uiHelper.showToast();
            }
        );
    }
}
