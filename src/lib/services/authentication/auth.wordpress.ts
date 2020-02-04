import {Injectable} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthWordpressService {

  public token: string;
  public user: any;

  constructor(
    private httpClient: HttpClient,
    private storage: Storage,
  ) {
  }

  login(email: string, password: string) {
    this.token = undefined;
    return this.httpClient.post('/wp-api/jwt-auth/v1/token',
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
