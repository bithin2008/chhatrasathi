import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutusComponent } from './aboutus.component';
import { IonicModule } from '@ionic/angular';
import { AboutusRoutingModule } from './aboutus-routing.module';


@NgModule({
  declarations: [AboutusComponent],
  imports: [
    CommonModule,
    IonicModule,
    AboutusRoutingModule
  ]
})
export class AboutusModule { }
