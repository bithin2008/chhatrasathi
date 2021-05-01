import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoificationComponent} from './noification.component';

const routes: Routes = [
  {
    path: '',
    component: NoificationComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoificationRoutingModule { }
