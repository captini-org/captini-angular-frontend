import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ForgetPasswordComponent } from './Auth/forget-password/forget-password.component';
import { TokenInterceptorService} from './Shared/services/token-interceptor.service';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ResetSucessComponent } from './Auth/reset-password/reset-sucess/reset-sucess.component';
import { CheckEmailComponent } from './Auth/reset-password/check-email/check-email.component';
import { DeactivateAccountComponent } from './Auth/deactivate-account/deactivate-account.component';
import { ActivateAccountComponent } from './Auth/activate-account/activate-account.component';
@NgModule({
  declarations: [
    AppComponent,
    ForgetPasswordComponent,
    ResetSucessComponent,
    CheckEmailComponent,
    DeactivateAccountComponent,
    ActivateAccountComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // ngx-translate and the loader module
    HttpClientModule,
    MdbCheckboxModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
        }
    }),
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule,
    NgxPageScrollCoreModule,
    NgxPageScrollModule
  ],
  providers: [ {provide:HTTP_INTERCEPTORS,useClass:TokenInterceptorService,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
