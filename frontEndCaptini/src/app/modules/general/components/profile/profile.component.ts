import { Component, OnInit } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserService } from '../../../../Shared/services/profile/user.service';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { LangService } from '../../../../Shared/services/lang.service';

function formatDate(year: number, month: number = 1, day: number = 1): string {
  const date = new Date(year, month - 1, day);
  return date.toISOString().split('T')[0];
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  Responsedata: any;
  loading = true;
  showMsg: boolean = false;
  errorMessage: string = '';
  msgContent: string = '';
  ResponsedataProfile: any;
  user: any;
  notification_setting_email: boolean = false;
  notification_setting_in_app: boolean = false;
  profilePicture: String = '';
  file: File | string = '';
  is_icelandic: boolean = false;
  constructor(
    private langService: LangService,
    private route: Router,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    let id = localStorage.getItem('id');
    this.loading = true;
    this.errorMessage = '';

    this.userService.UserDetailsCatchError(id!).subscribe((result) => {
      if (result != null) {
        this.Responsedata = result;
        this.loading = false;
        this.notification_setting_email = Boolean(
          this.Responsedata.notification_setting_email
        );
        this.notification_setting_in_app = Boolean(
          this.Responsedata.notification_setting_in_app
        );
        this.is_icelandic = Boolean(
          String(this.Responsedata.display_language) === 'icl'
        );
        this.profilForm.patchValue({
          id: String(this.Responsedata.id),
          first_name: String(this.Responsedata.first_name),
          last_name: String(this.Responsedata.last_name),
          username: String(this.Responsedata.username),
          email: String(this.Responsedata.email),
          birthday: new Date(this.Responsedata.birthday).getFullYear().toString(),
          nationality: String(this.Responsedata.nationality),
          native_language: String(this.Responsedata.native_language),
          gender:
              String(this.Responsedata.gender) === 'M' && String(this.Responsedata.display_language) === 'icl'
              ? 'Karl'
              : String(this.Responsedata.gender) === 'F' && String(this.Responsedata.display_language) === 'icl'
              ? 'Kona'
              : String(this.Responsedata.gender) === 'M' && String(this.Responsedata.display_language) === 'en'
              ? 'Male'
              : String(this.Responsedata.gender) === 'F' && String(this.Responsedata.display_language) === 'en'
              ? 'Female'
              : String(this.Responsedata.gender) === 'N' && String(this.Responsedata.display_language) === 'en'
              ? 'Other'
              : 'Annað',
          language_level: String(this.Responsedata.language_level),
          notification_setting_email: Boolean(
            this.Responsedata.notification_setting_email
          ),
          notification_setting_in_app: Boolean(
            this.Responsedata.notification_setting_in_app
          ),
          display_language: String(this.Responsedata.display_language),
          is_icelandic :
            String(this.Responsedata.display_language) === 'icl'
            ? true : false,
        });
        this.langService.useLanguage(this.Responsedata.display_language);
        this.profilePicture = this.Responsedata.profile_photo;
      }
    });
    const bodyElement = document.body;
    bodyElement.classList.remove('teacher-bird');

  }
  profilForm = this.formBuilder.group({
    id: [''],
    first_name: ['jhon', Validators.required],
    last_name: ['deo', Validators.required],
    username: ['JHON', Validators.required],
    email: ['jhondeo@domaincom', [Validators.required, Validators.email]],
    native_language: [''],
    gender: [''],
    birthday: [''],
    nationality: [''],
    language_level: [''],
    notification_setting_in_app: [false],
    notification_setting_email: [false],
    display_language:[''],
  });
  form = this.formBuilder.group({
    profile_photo: [''],
  });
  passwordForm = this.formBuilder.group({
    _oldPass: [''],
    _newPass: [''],
  });
  logOUt() {
    localStorage.clear();
    this.route.navigate(['login']);
  }
  
  updateProfil() {
    if (this.profilForm.valid) {
      const displayLanguageValue =
        this.is_icelandic
        ? 'icl'
        : 'en';
      const genderValue =
        this.profilForm.value.gender === 'Male'|| this.profilForm.value.gender === 'Karl'
          ? 'M'
          : this.profilForm.value.gender === 'Female'|| this.profilForm.value.gender === 'Kona'
          ? 'F'
          : 'N';


      // Store the year-only value before formatting the date
      const yearOnly = this.profilForm.value.birthday;

      // Format the birthday date
      const formattedBirthday = formatDate(yearOnly);

      // Update the gender field in the form with the mapped value
      this.profilForm.patchValue({
        gender: genderValue,
        birthday: formattedBirthday,
        display_language: displayLanguageValue,
        is_icelandic: this.is_icelandic,
        notification_setting_email: this.notification_setting_email,
        notification_setting_in_app: this.notification_setting_in_app,
      });
      this.userService
        .updateProfile(this.profilForm.value)
        .subscribe((profile) => {
          if (profile != null) {
            const genderValueEN =
              this.profilForm.value.gender === 'M'
                ? 'Male'
                : this.profilForm.value.gender === 'F'
                ? 'Female'
                : 'Other';
            const genderValueIS =
                this.profilForm.value.gender === 'M'
                  ? 'Karl'
                  : this.profilForm.value.gender === 'F'
                  ? 'Kona'
                  : 'Annað';
            const displayLanguageValue =
              this.profilForm.value.display_language === 'icl'
              ? true
              : false
            // Update the gender field in the form with the mapped value
            this.Responsedata = profile;
            this.profilForm.patchValue({
              gender:
              Boolean(displayLanguageValue)
              ? genderValueIS
              : genderValueEN,
              is_icelandic: displayLanguageValue,
              birthday: yearOnly,
            });
            this.msgContent = 'Profile updated!';
            this.showMsg = true;
          }
        });
    }
  }
  getYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 120; // Adjust the range as needed
    const endYear = currentYear - 4; // Adjust the range as needed

    // Generate an array of years in descending order
    return Array.from({ length: endYear - startYear + 1 }, (_, index) => endYear - index);
  }
  changePassword() {
    if (this.passwordForm.valid) {
      this.userService
        .updatePassword(this.profilForm.value)
        .subscribe((password) => {
          if (password != null) {
            this.showMsg = true;
          }
        });
    }
  }
  // Inside your component class
  toggleAppNotification() {
    //console.log(this.profilForm.value.notification_setting_in_app);
    this.notification_setting_in_app = !this.notification_setting_in_app;
    this.profilForm.patchValue({
      notification_setting_in_app: this.notification_setting_in_app,
    });
    //console.log(this.profilForm.value.notification_setting_in_app);
  }

  toggleEmailNotification() {
    this.notification_setting_email = !this.notification_setting_email;
    this.profilForm.patchValue({
      notification_setting_email: this.notification_setting_email,
    });
  }
  updateLanguageLevel(value: string) {
    this.profilForm.patchValue({
      language_level: value,
    });
  }

  onImageUpload(event: any) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    this.form.patchValue({
      profile_photo: event.target.files[0],
    });
    reader.onload = (e: any) => {
      // Update the profile_photo field in the form with the uploaded image
      this.profilePicture = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  saveProfilePicture() {
    if (this.file) {
      const formData = new FormData();
      formData.append('profile_photo', this.form.value.profile_photo);
      this.userService.updateProfilePicture(formData);

    }
  }
  cancel(){
    this.profilePicture = this.Responsedata.profile_photo;
  }
  switchLang()
  {
    if(!this.is_icelandic) {
      this.langService.useLanguage('icl');
    }
    else {
      this.langService.useLanguage('en');
    }
    this.is_icelandic = !this.is_icelandic;
    this.profilForm.patchValue({
      display_language:
        this.is_icelandic ? 'icl' : 'en'
    });
  }
}
