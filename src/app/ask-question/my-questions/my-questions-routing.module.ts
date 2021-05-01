import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyQuestionsComponent } from './my-questions.component';

const routes: Routes = [
  {
    path: '',
    component: MyQuestionsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyQuestionsRoutingModule { }
