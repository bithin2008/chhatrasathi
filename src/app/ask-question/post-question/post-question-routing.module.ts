import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostQuestionComponent } from './post-question.component';

const routes: Routes = [
  {
    path: '',
    component: PostQuestionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostQuestionRoutingModule { }
