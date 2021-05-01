import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeLanguageComponent } from './change-language.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeLanguageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeLanguageRoutingModule { }
