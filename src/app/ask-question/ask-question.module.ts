import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AskQuestionComponent } from './ask-question.component';
import { IonicModule } from '@ionic/angular';
import { AskQuestionRoutingModule } from './ask-question-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AskQuestionComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    AskQuestionRoutingModule
  ]
})
export class AskQuestionModule { }
