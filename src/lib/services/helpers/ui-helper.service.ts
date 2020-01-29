import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LoadingController, ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class UIHelperService {

    public loading: any;
    public currentViewToDismiss: any;

    constructor(
        private translate: TranslateService,
        private loadingController: LoadingController,
        private toastController: ToastController
        ) {
    }

    async showLoader(msg?) {
        if (!this.loading) {
            if (!msg) {
                msg = await this.translate.get('LOADING').toPromise();
            } else {
                msg = await this.translate.get(msg).toPromise();
            }

            this.loading = await this.loadingController.create({
                message: msg,
                spinner: 'bubbles'
            });
            await this.loading.present();
            this.loading.onDidDismiss().then(res => {
                this.currentViewToDismiss = null;
            });
            this.currentViewToDismiss = this.loading;
        }
    }

    dismissLoader() {
        this.loadingController.dismiss().then(() => {
            this.currentViewToDismiss = null;
            this.loading = null;
        });
    }

    async showToast(msg?, color?, position?) {
        if (!position) {
            position = 'bottom';
        }
        if (!color) {
            color = 'danger';
        }
        if (!msg) {
            await this.translate.get('GENERIC_ERROR').subscribe(async res => {
                msg = res;
                const toast = await this.toastController.create({
                    message: res,
                    duration: 2000,
                    color
                });
                await toast.present();
            });
        } else {
            await this.translate.get(msg).subscribe(async res => {
                const toast = await this.toastController.create({
                    message: res,
                    duration: 2000,
                    position,
                    color
                });
                await toast.present();
            });
        }
    }
}