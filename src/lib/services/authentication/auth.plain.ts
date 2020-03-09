import {Inject, Injectable} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';

import {CoreConfigService} from '../core-config.service';
import { ICoreConfig } from '../../shared/interfaces/config.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthPlainService {

  public token: string;
  public user: any;

  constructor(
    private httpClient: HttpClient,
    private storage: Storage,
    @Inject(CoreConfigService) private config: ICoreConfig,
  ) {
    this.initToken();
  }

  public async initToken(): Promise<string> {
    this.token = await this.storage.get('token');
    return this.token;
  }

  public logout(): void {
    this.user = null;
    this.token = null;
    this.storage.clear();
  }

  public autoLogin(): Promise<any> {
    return this.storage.get('token').then(async token => {
      if (token) {
        const userMePath = this.config.restApi
        .restPathList.filter(value => value.prefix === 'main-api')
        .find(value => value.type === 'userMe');

        this.token = token;
        return await this.httpClient.get(`/${userMePath.prefix}/${userMePath.url}`, {
          headers: {
            authorization: 'Bearer ' + token
          }
        })
          .pipe(
            tap((data: any) => {
              this.user = data.user;
              return data;
            })
          ).toPromise();
      }
    });
  }

  public login(id: string, password: string): Promise<any> {
    const payload: any = {};
    const authPath = this.config.restApi.restPathList.filter(value => value.prefix === 'main-api').find(value => value.type === 'auth');

    payload[this.config.auth ? this.config.auth.idField : 'username'] = id;
    payload[this.config.auth ? this.config.auth.pwdField : 'password'] = password;
    return this.httpClient.post(`/${authPath.prefix}/${authPath.url}`, payload)
    .pipe(
      tap((data: any) => {
        this.user = data.user;
        this.token = data.token;
        this.storage.set('token', this.token);
        return data;
      })
    )
    .toPromise();
  }

  public forgotPwd(id: string): Promise<any> {
    const payload: any = {};
    const forgotPwdPath = this.config.restApi.restPathList
    .filter(value => value.prefix === 'main-api')
    .find(value => value.type === 'forgotPwd');

    payload[this.config.auth ? this.config.auth.idField : 'username'] = id;
    return this.httpClient.post(`/${forgotPwdPath.prefix}${forgotPwdPath.url}`,
      payload
      )
      .pipe(
        catchError(async (e: any, caught: Observable<any>) => {
          throw e;
        }),
        tap((data: any) => {
          return data;
        })
      )
      .toPromise();
  }
}
