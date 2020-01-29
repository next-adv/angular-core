

/*
 * Public API Surface of core
 */

export { AngularCoreModule } from './lib/angular-core.module';

// COMPONENTS - ANGULAR
export { ButtonSwitchComponent } from './lib/pure-components/button-switch/button-switch.component';
export { SamePasswordValidator } from './lib/directives/same-password/same-password.directive';

// COMPONENTS - IONIC
export { AccordionComponent } from './lib/ionic-components/accordion/accordion/accordion.component';
export { ChangePasswordComponent } from './lib/ionic-components/change-password/change-password.component';
export { LoginComponent } from './lib/ionic-components/login/login.component';
export { RestorePasswordComponent } from './lib/ionic-components/restore-password/restore-password.component';
export { SignUpComponent } from './lib/ionic-components/sign-up/sign-up.component';

// AUTH
export { AuthFacebookService } from './lib/services/authentication/auth.facebook';
export { AuthWordpressService } from './lib/services/authentication/auth.wordpress';
export { AuthAppleService } from './lib/services/authentication/auth.apple';
export { AuthPlainService } from './lib/services/authentication/auth.plain';

// HELPER
export { UIHelperService } from './lib/services/helpers/ui-helper.service';
export { DeviceHelperService } from './lib/services/helpers/device-helper.service';