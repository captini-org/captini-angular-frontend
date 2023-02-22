import { Directive ,ElementRef} from '@angular/core';

@Directive({
  selector: '[appBirthYears]'
})
export class BirthYearsDirective {

  constructor(private el: ElementRef) {
    const parent = this.el.nativeElement; 
   // const select =parent.document.createElement('option');
   parent.innerHTML = `<option selected>choose...</option>`;
    //parent.appendChild(select);
    let currentYear = new Date().getFullYear();    
    let earliestYear = 1970;     
  while (currentYear >= earliestYear) {      
    let dateOption = document.createElement('option');          
    dateOption.text = currentYear.toString();      
    dateOption.value = currentYear.toString();        
    parent.add(dateOption);  
    currentYear -= 1;    
  }
    
   }
 
}
