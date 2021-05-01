import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AskQuestionComponent } from './ask-question.component';

const routes: Routes = [
  {
    path: '',
    component: AskQuestionComponent,
    children: [
      {
        path: 'post-question',
        loadChildren: () => import('../ask-question/post-question/post-question.module').then(m => m.PostQuestionModule)
      },
      {
        path: 'post-question/:questionId',
        loadChildren: () => import('../ask-question/post-question/post-question.module').then(m => m.PostQuestionModule)
      },
      {
        path: 'my-questions',
        loadChildren: () => import('../ask-question/my-questions/my-questions.module').then(m => m.MyQuestionsModule)
      },
      {
        path: 'all-questions',
        loadChildren: () => import('../ask-question/all-questions/all-questions.module').then(m => m.AllQuestionsModule)
      },
      {
        path: '',
        redirectTo: '/ask-question/post-question',
        pathMatch: 'full'
      }
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AskQuestionRoutingModule { }
