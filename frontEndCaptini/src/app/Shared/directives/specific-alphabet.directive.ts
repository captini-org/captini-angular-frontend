import { Directive ,ElementRef} from '@angular/core';

@Directive({
  selector: '[appSpecificAlphabet]'
})
export class SpecificAlphabetDirective {

  constructor(private el: ElementRef) {
    const node =this.el.nativeElement;
    const bold = node.querySelectorAll(".letter");
    console.warn(bold);
    
   }

}
