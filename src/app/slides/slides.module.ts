import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlidesRoutingModule } from './slides-routing.module';
import { SlidesComponent } from './slides.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SlidesComponent],
  imports: [
    IonicModule,
    CommonModule,
    SlidesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SlidesModule { }
