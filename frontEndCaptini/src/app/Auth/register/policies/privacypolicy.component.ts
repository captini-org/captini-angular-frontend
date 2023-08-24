import { Component, Output, OnInit, EventEmitter } from '@angular/core'
import { DatePipe } from '@angular/common'
import { LangService } from '../../../Shared/services/lang.service'

@Component({
  selector: 'privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.css'],
  providers: [DatePipe],
})

export class PrivacyPolicyComponent implements OnInit {
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
