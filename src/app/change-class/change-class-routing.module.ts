import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeClassComponent } from './change-class.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeClassComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeClassRoutingModule { }
