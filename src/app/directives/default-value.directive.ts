import { Directive, Input, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[defaultValue]',
})
export class DefaultValueDirective {

  @Input() defaultValue: any;

  constructor(@Optional() @Self() private ngControl: NgControl) { }

  @HostListener('blur') onBlur() {
    if (this.ngControl?.control && !this.ngControl.control.value && this.defaultValue) {
      this.ngControl.control.setValue(this.defaultValue);
    }
  }
}