import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'nxt-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    @Output() formSubmit = new EventEmitter();

    loginFormGroup: FormGroup;

    constructor() {
    }

    ngOnInit() {
        // TODO remove fool data
        this.loginFormGroup = new FormGroup({
            password: new FormControl('aaaaa', [Validators.required, Validators.minLength(5)]),
            email: new FormControl('coco@next.sa.it', [Validators.required, Validators.email]),
        });
    }

    doAction() {
        this.formSubmit.emit(this.loginFormGroup.value);
    }
}
