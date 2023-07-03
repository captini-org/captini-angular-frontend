import { Directive,ElementRef } from '@angular/core';

@Directive({
  selector: '[appRecPplayState]'
})
export class RecPplayStateDirective {

  private _rec = false;
  constructor(private el: ElementRef) {
    this.setup();
   }
   toggle(button: HTMLElement) {
    this._rec = !this._rec;
    if (this._rec) {
      this.el.nativeElement?.classList.add("recording")
    } else {
      this.el.nativeElement.classList.remove("recording");
    }
  }
   setup() {
    const parent = this.el.nativeElement;
    parent.addEventListener('click', () => {
      this.toggle(parent);
    });
   
  }

}
