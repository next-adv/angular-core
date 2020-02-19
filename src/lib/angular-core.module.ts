import {NgModule,  ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { GenericInterceptors } from './services/interceptors';
import { CoreConfigService } from './services/core-config.service';
import { ICoreConfig } from './shared/interfaces/config.interface';


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
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: GenericInterceptors,
            multi: true
        }
    ],
    exports: []
})
export class AngularCoreModule {

    public static setConfig(config: ICoreConfig): ModuleWithProviders {
        return {
            ngModule: AngularCoreModule,
            providers: [
                {
                    provide: CoreConfigService,
                    useValue: config
                }
            ]
        };
    }
}
