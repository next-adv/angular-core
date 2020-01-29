import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {Facebook} from '@ionic-native/facebook/ngx';
import {HttpClientModule} from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import {SignUpComponent} from './ionic-components/sign-up/sign-up.component';
import {LoginComponent} from './ionic-components/login/login.component';
import {ButtonSwitchComponent} from './pure-components/button-switch/button-switch.component';
import {AccordionComponent} from './ionic-components/accordion/accordion/accordion.component';
import {RestorePasswordComponent} from './ionic-components/restore-password/restore-password.component';
import {ChangePasswordComponent} from './ionic-components/change-password/change-password.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonicModule,
        TranslateModule,
        RouterModule,
        HttpClientModule,
        IonicStorageModule.forRoot()
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
