import { Directive, Input, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[max]',
})
export class MaxValueDirective {

  @Input() max: any;

  constructor(@Optional() @Self() private ngControl: NgControl) { }

  @HostListener('input') onBlur() {
    if (this.ngControl?.control && this.max && this.ngControl.control.value > this.max) {
      this.ngControl.control.setValue(this.max);
    }
  }
}