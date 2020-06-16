import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[inputLabel]'
})
export class InputLabelDirective {

  @Input() title: string = "";
  @Input() marginTop: string = "";

  wrapperDiv: any;
  parentNode: any;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "inputLabel");
    this.renderer.addClass(this.elementRef.nativeElement, "form-field");

    this.parentNode = this.elementRef.nativeElement.parentNode;

    var titleSpan = this.renderer.createElement("span");
    var textnode = document.createTextNode(this.title);
    titleSpan.appendChild(textnode);

    this.wrapperDiv = this.renderer.createElement("div");
    this.wrapperDiv.style.marginTop = this.marginTop;
    this.renderer.addClass(this.wrapperDiv, "form-group");
    this.wrapperDiv.appendChild(titleSpan);
    this.wrapperDiv.appendChild(this.elementRef.nativeElement);

    this.renderer.appendChild(this.parentNode, this.wrapperDiv);
  }

  ngOnDestroy() {
    this.renderer.removeChild(this.parentNode, this.wrapperDiv);
  }
}
