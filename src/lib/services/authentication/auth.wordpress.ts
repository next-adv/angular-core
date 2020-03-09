import {Injectable, Inject} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';

import { CoreConfigService } from '../core-config.service';
import { ICoreConfig } from '../../shared/interfaces/config.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthWordpressService {

  public token: string;
  public user: any;

  constructor(
    private httpClient: HttpClient,
    private storage: Storage,
    @Inject(CoreConfigService) private config: ICoreConfig,
  ) {
  }

  public login(email: string, password: string): Observable<any> {
    const authPath = this.config.restApi.restPathList
    .filter(value => value.prefix === 'wp-api')
    .find(value => value.type === 'auth');

    this.token = undefined;
    return this.httpClient.post(`/${authPath.prefix}/${authPath.url}`,
      {
        email,
        password
      })
      .pipe(
        catchError(async (e: any, caught: Observable<any>) => {
          throw e;
        }),
        tap((data: any) => {
          this.user.email = data.user_email;
          this.token = data.token;
          this.storage.set('token', this.token);
          return data;
        })
      );
  }
}
