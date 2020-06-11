import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[inputLabel]'
})
export class InputLabelDirective {

  @Input() title: string = "";
  @Input() marginTop: string = "";

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "inputLabel");
    this.renderer.addClass(this.elementRef.nativeElement, "form-field");
    
    var parentNode = this.elementRef.nativeElement.parentNode;

    var titleSpan = this.renderer.createElement("span");
    var textnode = document.createTextNode(this.title);
    titleSpan.appendChild(textnode);

    var wrapperDiv = this.renderer.createElement("div");
    wrapperDiv.style.marginTop = this.marginTop;
    this.renderer.addClass(wrapperDiv, "form-group");
    wrapperDiv.appendChild(titleSpan);
    wrapperDiv.appendChild(this.elementRef.nativeElement);

    this.renderer.appendChild(parentNode, wrapperDiv);
  }
}
