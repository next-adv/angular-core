import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NavService} from '../../services/nav.service';
import {NavController} from '@ionic/angular';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';

@Component({
    selector: 'nxt-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
    @Input() additionalData: any;
    @Output() formSubmit = new EventEmitter();

    signupFormGroup: FormGroup;

    constructor(
        private navService: NavService,
        private navCtrl: NavController,
        private iab: InAppBrowser
    ) {
    }

    ngOnInit() {
        this.signupFormGroup = new FormGroup({
            first_name: new FormControl(this.additionalData ? this.additionalData.first_name : '', [Validators.required, Validators.minLength(2)]),
            last_name: new FormControl(this.additionalData ? this.additionalData.last_name : '', [Validators.required, Validators.minLength(2)]),
            password: new FormControl('', [Validators.required, Validators.minLength(5)]),
            email: new FormControl(this.additionalData ? this.additionalData.email : '', [Validators.required, Validators.email]),
            appleID: new FormControl(this.additionalData ? this.additionalData.appleID : null),
            disclaimer: new FormControl(false, [Validators.requiredTrue])
        });

        // TODO mettere "disclaimer" obbligatorio

        this.detectClickOnDisclaimer();
    }

    doAction() {
        this.formSubmit.emit({data: this.signupFormGroup.value, source: ''});
    }

    goBack() {
        this.navCtrl.pop();
    }

    detectClickOnDisclaimer() {
        setTimeout(() => {
            const detectClick1: any = document.getElementsByClassName('detect_click_1')[0];
            const detectClick2: any = document.getElementsByClassName('detect_click_2')[0];
            detectClick1.style.color = '#4f8af2';
            detectClick1.addEventListener('click', async () => {
                // TODO impostare Termini e Condizioni URL
                this.iab.create('http://google.it', '_system',
                    'clearsessioncache=yes,clearcache=yes,hardwareback=yes,location=no,hideurlbar=yes');
            });
            detectClick2.style.color = '#4f8af2';
            detectClick2.addEventListener('click', async () => {
                // TODO impostare Privacy Policy URL
                this.iab.create('http://google.it', '_system',
                    'clearsessioncache=yes,clearcache=yes,hardwareback=yes,location=no,hideurlbar=yes');
            });
        });
    }
}

export interface ISignUpData {
    data: {
        first_name: string,
        last_name: string,
        password: string,
        email: string,
        provider: string
    };
    source: 'FB' | 'APP';
}
