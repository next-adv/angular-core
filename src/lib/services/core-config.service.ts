import { InjectionToken } from '@angular/core';
import { ICoreConfig } from '../shared/interfaces/config.interface';

/**
 * This is not a real service, but it looks like it from the outside.
 * It's just an InjectionTToken used to import the config object, provided from the outside
 */
export const CoreConfigService = new InjectionToken<ICoreConfig>('CoreConfigService');
