

/*
 * Public API Surface of core
 */

export { AngularCoreModule } from './lib/angular-core.module';

// COMPONENTS
export { SamePasswordValidator } from './lib/directives/same-password/same-password.directive';

// AUTH
export { AuthWordpressService } from './lib/services/authentication/auth.wordpress';
export { AuthPlainService } from './lib/services/authentication/auth.plain';

// HELPER
export { UIHelperService } from './lib/services/helpers/ui-helper.service';
