import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NavService {
    data: any;

    setData<T>(data: T | any) {
        this.data = data;
    }

    getData<T>(): T | any {
        const dataToReturn = this.data;
        this.data = undefined;
        return dataToReturn;
    }

    clearData() {
        this.data = undefined;
    }
}
