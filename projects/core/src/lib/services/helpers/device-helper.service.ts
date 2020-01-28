import {Injectable} from '@angular/core';
import {Device} from '@ionic-native/device/ngx';

interface IDevice {
    regId: string;
    uuid: string;
    platform: string;
    version: string;
    manufacturer: string;
    model: string;
    serial: string;
    locale: string;
}

@Injectable({
    providedIn: 'root'
})
export class DeviceHelperService {

    constructor(
        private device: Device
    ) {}

    getDeviceObject(registrationId?: string, locale?: string): IDevice {
        return {
            regId: registrationId,
            uuid: this.device.uuid,
            platform: this.device.platform,
            version: this.device.version,
            manufacturer: this.device.manufacturer,
            model: this.device.model,
            serial: this.device.serial,
            locale: locale
        };
    }
}
