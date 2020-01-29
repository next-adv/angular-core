
import { ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';

export function SamePasswordValidator(newPwdControl: string, confirmPwdControl: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return (control.get(newPwdControl).value !== control.get(confirmPwdControl).value ? {samePassword: false} : null);
  };
}