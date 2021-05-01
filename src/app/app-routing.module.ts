import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: localStorage.getItem('language') ? localStorage.getItem('token') ? 'dashboard' : 'login' : 'intro',
    pathMatch: 'full'
  },
  {
    path: 'intro',
    loadChildren: () => import('./slides/slides.module').then(m => m.SlidesModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
  },
  {
    path: 'otp',
    loadChildren: () => import('./one-time-password/one-time-password.module').then(m => m.OneTimePasswordModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then(m => m.EditProfileModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'chapter/:subjectId',
    loadChildren: () => import('./chapter/chapter.module').then(m => m.ChapterModule)
  },
  {
    path: 'lesson/:subjectId/:subjectName/:chapterId',
    // path: 'lesson',
    loadChildren: () => import('./lesson/lesson.module').then(m => m.LessonModule)
  },
  {
    path: 'subscription',
    loadChildren: () => import('./subscription/subscription.module').then(m => m.SubscriptionModule)
  },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsModule)
  },
  {
    path: 'class/:userId',
    loadChildren: () => import('./class/class.module').then(m => m.ClassModule)
  },
  {
    path: 'class/:userId/:isclass',
    loadChildren: () => import('./class/class.module').then(m => m.ClassModule)
  },
  {
    path: 'aboutus',
    loadChildren: () => import('./aboutus/aboutus.module').then(m => m.AboutusModule)
  },
  {
    path: 'change-class',
    loadChildren: () => import('./change-class/change-class.module').then(m => m.ChangeClassModule)
  },
  {
    path: 'change-language',
    loadChildren: () => import('./change-language/change-language.module').then(m => m.ChangeLanguageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)
  },
  {
    path: 'ask-question',
    loadChildren: () => import('./ask-question/ask-question.module').then(m => m.AskQuestionModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule)
  },
  {
    path: 'notification/:userId',
    loadChildren: () => import('./noification/noification.module').then(m => m.NoificationModule)
  },
  {
    path: 'invite/:userId',
    loadChildren: () => import('./invite/invite.module').then(m => m.InviteModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
