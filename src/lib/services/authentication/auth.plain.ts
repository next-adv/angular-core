import {Inject, Injectable} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {CoreConfigService} from '../core-config.service';
import {ICoreConfig} from '../interceptors';

@Injectable(/*{
    providedIn: 'root'
}*/)
export class AuthPlainService {

  public token: string;
  public user: any;

  constructor(
    private httpClient: HttpClient,
    private storage: Storage,
    @Inject(CoreConfigService) private config: ICoreConfig,
  ) {
  }

  public logout() {
    this.user = null;
    this.token = null;
    this.storage.clear();
  }

  public autoLogin() {
    return this.storage.get('token').then(async token => {
      if (token) {
        this.token = token;
        return await this.httpClient.get(this.config.restApi.autoLoginRestEndpoint || '/users/me/', {
          headers: {
            authorization: 'Bearer ' + token
          }
        })
          .pipe(
            catchError(async (e: any, caught: Observable<any>) => {
              throw e;
            }),
            tap((data: any) => {
              this.user = data.user;
              return data;
            })
          ).toPromise();
      }
    });
  }

  public login(email: string, password: string) {
    return this.httpClient.post('/auth',
      {
        email,
        password
      })
      .pipe(
        catchError(async (e: any, caught: Observable<any>) => {
          throw e;
        }),
        tap((data: any) => {
          this.user = data.user;
          this.token = data.token;
          this.storage.set('token', this.token);
          return data;
        })
      );
  }

  public forgotPwd(email: string) {
    return this.httpClient.post('/forgotPwd',
      {
        email
      })
      .pipe(
        catchError(async (e: any, caught: Observable<any>) => {
          throw e;
        }),
        tap((data: any) => {
          return data;
        })
      );
  }
}
