import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgetPasswordComponent } from './Auth/forget-password/forget-password.component';
import {LoginComponent} from './Auth/login/login.component'
import {RegisterComponent} from './Auth/register/register.component'
import { AuthGuard } from './Shared/guard/auth.guard';
import { ResetPasswordComponent } from './Auth/reset-password/reset-password.component';
import { ResetSucessComponent } from './Auth/reset-password/reset-sucess/reset-sucess.component';
import { PrivacyPolicyComponent } from './Auth/register/policies/privacypolicy.component';
import { TermsOfUseComponent } from './Auth/register/policies/termsofuse.component';
import { DeactivateAccountComponent } from './Auth/deactivate-account/deactivate-account.component';
import { ActivateAccountComponent } from './Auth/activate-account/activate-account.component';
import { ReactivateAccountComponent } from './Auth/activate-account/reactivate-account/reactivate-account.component';
const routes: Routes = [

  {
    loadChildren: () => import('./modules/general/general.module')
    .then(mod => mod.GeneralModule),
    path:'',
    canActivate:[AuthGuard]
  },

  {
    component:LoginComponent,
    path:'login'
  },
  {
    component:RegisterComponent,
    path:'register'
  },
  {
    component:ForgetPasswordComponent,
    path:'reset'
  },
  {
    component:ResetPasswordComponent,
    path:'password-reset/:uid/:token'
  },
  {
    component:ResetSucessComponent,
    path:'password-reset'
  },
  {
    component: PrivacyPolicyComponent,
    path: 'privacypolicy',
  },
  {
    component: TermsOfUseComponent,
    path: 'termsofuse',
  },
  {
    component:DeactivateAccountComponent,
    path:'deactivate-account'
  },
  {
    component:ActivateAccountComponent,
    path:'activate-account'
  },
  {
    component:ReactivateAccountComponent,
    path:'reactivate-account/:uid/:token'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
