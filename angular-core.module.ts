import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';

import {SignUpComponent} from './components/sign-up/sign-up.component';
import {LoginComponent} from './components/login/login.component';
import {DatePipe} from './pipes/date/date.pipe';
import {ButtonSwitchComponent} from './components/button-switch/button-switch/button-switch.component';
import {AccordionComponent} from './components/accordion/accordion/accordion.component';
import {TimingItemComponent} from './components/timing-item/timing-item.component';
import {Facebook} from '@ionic-native/facebook/ngx';
import {Push} from '@ionic-native/push/ngx';
import {AuthGuardService} from '../services/auth-guard';
import {RestorePasswordComponent} from './components/restore-password/restore-password.component';
import {ChangePasswordComponent} from './components/change-password/change-password.component';
import {AuthFacebookService} from './services/authentication/auth.facebook';
import {AuthWordpressService} from './services/authentication/auth.wordpress';
import {AuthApple} from './services/authentication/auth.apple';

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
        DatePipe,
        ButtonSwitchComponent,
        AccordionComponent,
        TimingItemComponent,
        RestorePasswordComponent,
        ChangePasswordComponent,
    ],
    providers: [
        Facebook,
        Push,
        AuthGuardService,
        AuthFacebookService,
        AuthApple,
        AuthWordpressService,
    ],
    exports: [
        SignUpComponent,
        LoginComponent,
        DatePipe,
        ButtonSwitchComponent,
        AccordionComponent,
        TimingItemComponent,
        RestorePasswordComponent,
        ChangePasswordComponent,
    ]
})
export class AngularCoreModule {
}
