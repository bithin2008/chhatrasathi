import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AllQuestionsComponent } from './all-questions.component';
import { AllQuestionsRoutingModule } from './all-questions-routing.module';


@NgModule({
  declarations: [AllQuestionsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    AllQuestionsRoutingModule
  ]
})
export class AllQuestionsModule { }
