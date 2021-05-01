import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassComponent } from './class.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClassRoutingModule } from './class-routing.module';


@NgModule({
  declarations: [ClassComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ClassRoutingModule
  ]
})
export class ClassModule { }
