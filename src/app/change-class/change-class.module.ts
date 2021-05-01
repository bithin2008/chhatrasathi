import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ChangeClassComponent } from './change-class.component';
import { ChangeClassRoutingModule } from './change-class-routing.module';


@NgModule({
  declarations: [ChangeClassComponent],
  imports: [
    CommonModule,
    IonicModule,
    ChangeClassRoutingModule
  ]
})
export class ChangeClassModule { }
