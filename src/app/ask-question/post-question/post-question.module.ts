import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostQuestionComponent } from './post-question.component';
import { PostQuestionRoutingModule } from './post-question-routing.module';


@NgModule({
  declarations: [PostQuestionComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    PostQuestionRoutingModule
  ]
})
export class PostQuestionModule { }
