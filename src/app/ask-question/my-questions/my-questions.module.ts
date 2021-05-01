import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MyQuestionsComponent } from './my-questions.component';
import { MyQuestionsRoutingModule } from './my-questions-routing.module';


@NgModule({
  declarations: [MyQuestionsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    MyQuestionsRoutingModule
  ]
})
export class MyQuestionsModule { }
