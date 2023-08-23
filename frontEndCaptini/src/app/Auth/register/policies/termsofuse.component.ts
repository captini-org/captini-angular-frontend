import { Component, Output, OnInit, EventEmitter } from '@angular/core'
import { DatePipe } from '@angular/common'
import { LangService } from '../../../Shared/services/lang.service'

@Component({
  selector: 'termsofuse',
  templateUrl: './termsofuse.component.html',
  styleUrls: ['./termsofuse.component.css'],
  providers: [DatePipe],
})

export class TermsOfUseComponent implements OnInit {
  constructor(
    private langService: LangService
  ) {}

  isChecked: boolean = false;
  isModalOpen: boolean = false;
  is_icelandic: boolean = false;

  @Output() closeModalEvent = new EventEmitter<void>();



  switchLang(lang: string) {
    this.langService.useLanguage(lang)
    this.is_icelandic = !this.is_icelandic
  }

  ngOnInit(): void {}
}
