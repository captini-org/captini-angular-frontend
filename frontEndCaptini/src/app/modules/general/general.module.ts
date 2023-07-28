import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general-routing.module';
import { LayoutComponent } from './components/layout/layout.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { TopicsComponent } from './components/topics/topics.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {ProfileComponent} from './components/profile/profile.component';
// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import { LessonComponent } from './components/topics/lesson/lesson.component';
import { AllLanguagesDirective } from '../../Shared/directives/all-languages.directive';
import {RecPplayStateDirective} from '../../Shared/directives/rec-pplay-state.directive';
import {SpecificAlphabetDirective} from '../../Shared/directives/specific-alphabet.directive';

import { LessonDetailsComponent } from './components/topics/lesson/lesson-details/lesson-details.component';
import { RegisterComponent } from 'src/app/Auth/register/register.component';
import { AllNationalitiesEnglishDirective } from 'src/app/Shared/directives/all-nationalitiesEN.directive';
import { BirthYearsDirective } from 'src/app/Shared/directives/birth-years.directive';
import { LoginComponent } from 'src/app/Auth/login/login.component';
import { ShowPasswordDirective } from 'src/app/Shared/directives/show-password.directive';
import { AllNationalitiesIcelandicDirective } from 'src/app/Shared/directives/all-nationalitiesIS.directive';
import { CommunityComponent } from './components/community/community.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    TopicsComponent,
    ProfileComponent,
    LessonComponent,
    AllLanguagesDirective,
    AllNationalitiesIcelandicDirective,
    AllNationalitiesEnglishDirective,
    BirthYearsDirective,
    RecPplayStateDirective,
    SpecificAlphabetDirective,
    ShowPasswordDirective,
    LessonDetailsComponent,
    CommunityComponent,
      ],
  imports: [
    CommonModule,
    GeneralRoutingModule,SweetAlert2Module.forRoot(),
    TranslateModule.forChild({
      loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    },
    isolate: false
}),
ReactiveFormsModule
  ]
})
export class GeneralModule {

}
