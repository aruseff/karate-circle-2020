import { Directive, Input, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[maxValue]',
})
export class MaxValueDirective {

  @Input() maxValue: any;

  constructor(@Optional() @Self() private ngControl: NgControl) { }

  @HostListener('input') onBlur() {
    if (this.ngControl?.control && this.maxValue && this.ngControl.control.value > this.maxValue) {
      this.ngControl.control.setValue(this.maxValue);
    }
  }
}