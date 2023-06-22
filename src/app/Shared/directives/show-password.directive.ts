import { Directive ,ElementRef} from '@angular/core';

@Directive({
  selector: '[appShowPassword]'
})
export class ShowPasswordDirective {
  private _shown = false;
  constructor(private el: ElementRef) {
    this.setup();
   }
   toggle(span: HTMLElement) {
    this._shown = !this._shown;
    if (this._shown) {
      this.el.nativeElement.setAttribute('type', 'text');
      span.innerHTML = '<span id="basic-addon1"><i class="ri-eye-line"></i></span>';
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      span.innerHTML = '<span id="basic-addon1"><i class="ri-eye-off-line"></i></span>';
    }
  }
   setup() {
    const parent = this.el.nativeElement.parentNode;
    const span = document.createElement('div');
    span.className="input-group-text";
    span.innerHTML = `<span id="basic-addon1"><i class="ri-eye-off-line"></i></span>`;
    span.addEventListener('click', (event) => {
      this.toggle(span);
    });
    parent.appendChild(span);
  }
}
