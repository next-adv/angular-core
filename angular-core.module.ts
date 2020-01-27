import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {Facebook} from '@ionic-native/facebook/ngx';

import {SignUpComponent} from './ionic-components/sign-up/sign-up.component';
import {LoginComponent} from './ionic-components/login/login.component';
import {ButtonSwitchComponent} from './pure-components/button-switch/button-switch.component';
import {AccordionComponent} from './ionic-components/accordion/accordion/accordion.component';
import {RestorePasswordComponent} from './ionic-components/restore-password/restore-password.component';
import {ChangePasswordComponent} from './ionic-components/change-password/change-password.component';
import {AuthFacebookService} from './services/authentication/auth.facebook';
import {AuthWordpressService} from './services/authentication/auth.wordpress';
import {AuthAppleService} from './services/authentication/auth.apple';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonicModule,
        TranslateModule,
        RouterModule
    ],
    declarations: [
        SignUpComponent,
        LoginComponent,
        ButtonSwitchComponent,
        AccordionComponent,
        RestorePasswordComponent,
        ChangePasswordComponent,
    ],
    providers: [
        Facebook,
        AuthFacebookService,
        AuthAppleService,
        AuthWordpressService,
    ],
    exports: [
        SignUpComponent,
        LoginComponent,
        ButtonSwitchComponent,
        AccordionComponent,
        RestorePasswordComponent,
        ChangePasswordComponent,
    ]
})
export class AngularCoreModule {
}
