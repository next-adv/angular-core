import {NgModule,  ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {IonicStorageModule} from '@ionic/storage';
import {RouterModule} from '@angular/router';
import {HttpClientModule, HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { CoreConfigService } from './services/core-config.service';
import { ICoreConfig } from './shared/interfaces/config.interface';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        IonicStorageModule.forRoot(),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
    ],
    declarations: [],
    providers: [],
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

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
  }
