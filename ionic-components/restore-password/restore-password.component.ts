import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'nxt-restore-password',
    templateUrl: './restore-password.component.html',
    styleUrls: ['./restore-password.component.scss'],
})
export class RestorePasswordComponent implements OnInit {

    @Output()
    formSubmit = new EventEmitter();

    formGroup: FormGroup;

    constructor() {
    }

    ngOnInit() {
        this.formGroup = new FormGroup({
            email: new FormControl('', [Validators.email, Validators.required])
        });
    }

    doAction() {
        this.formSubmit.emit(this.formGroup.value);
    }

}
