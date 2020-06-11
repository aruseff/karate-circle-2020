import { Directive, ElementRef, Renderer2, Input, ViewChild } from '@angular/core';

@Directive({
  selector: '[divLabel]'
})
export class DivLabelDirective {

  @Input() title: string = "";

  secondary_color_3: string = "#48a868";

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.elementRef.nativeElement.style.border = "1px solid " + this.secondary_color_3;
    this.elementRef.nativeElement.style.borderRadius = "3px";
    this.elementRef.nativeElement.style.padding = "10px";

    var titleDiv = this.renderer.createElement("div");
    titleDiv.style.color = this.secondary_color_3;
    titleDiv.style.fontWeight = "bold";
    var textnode = document.createTextNode(this.title);
    titleDiv.appendChild(textnode);

    this.renderer.addClass(titleDiv, "titlebox");
    this.elementRef.nativeElement.insertBefore(titleDiv, this.elementRef.nativeElement.firstChild);
  }
}
