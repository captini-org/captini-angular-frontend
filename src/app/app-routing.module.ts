import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgetPasswordComponent } from './Auth/forget-password/forget-password.component';
import {LoginComponent} from './Auth/login/login.component'
import {RegisterComponent} from './Auth/register/register.component'
import { AuthGuard } from './Shared/guard/auth.guard';
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
