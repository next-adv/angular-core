import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { SamePasswordValidator } from './same-password.directive';

@Component({
  selector: 'nxt-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {

  @Output()
  formSubmit = new EventEmitter();

  formGroup: FormGroup;

  constructor() {}

  ngOnInit() {
      this.formGroup = new FormGroup({
          currentPwd: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]),
          newPwd: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]),
          confirmPwd: new FormControl('', [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(10),
          ]),
      }, SamePasswordValidator('newPwd', 'confirmPwd'));
  }

  doAction() {
    this.formSubmit.emit(this.formGroup.value);
  }

}
