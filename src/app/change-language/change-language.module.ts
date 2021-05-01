import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ChangeLanguageComponent } from './change-language.component';
import { ChangeLanguageRoutingModule } from './change-language-routing.module';


@NgModule({
  declarations: [ChangeLanguageComponent],
  imports: [
    CommonModule,
    IonicModule,
    ChangeLanguageRoutingModule
  ]
})
export class ChangeLanguageModule { }
