import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NoificationRoutingModule } from './noification-routing.module';
import { NoificationComponent} from './noification.component';

@NgModule({
  declarations: [NoificationComponent],
  imports: [
    IonicModule,
    CommonModule,
    NoificationRoutingModule
  ]
})
export class NoificationModule { }
