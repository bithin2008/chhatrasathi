import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChapterComponent} from './chapter.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChapterRoutingModule } from './chapter-routing.module';


@NgModule({
  declarations: [ChapterComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ChapterRoutingModule
  ]
})
export class ChapterModule { }
