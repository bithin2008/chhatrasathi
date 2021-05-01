import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonRoutingModule } from './lesson-routing.module';
import { LessonComponent } from './lesson.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LessonComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LessonRoutingModule
  ]
})
export class LessonModule { }
