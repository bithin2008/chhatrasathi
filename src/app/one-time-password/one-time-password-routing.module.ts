import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OneTimePasswordComponent} from './one-time-password.component';

const routes: Routes = [
  {
    path: '',
    component: OneTimePasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OneTimePasswordRoutingModule { }
