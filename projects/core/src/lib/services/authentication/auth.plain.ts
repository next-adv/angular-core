import {Injectable} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class AuthPlainService {

    public token: string;
    public user: any;

    constructor(
        private httpClient: HttpClient,
        private storage: Storage,
    ) {
    }

    login(username: string, password: string) {
        this.token = undefined;
        return this.httpClient.post('API_ENDPOINT',
            {
                username,
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
