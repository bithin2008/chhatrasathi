import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteRoutingModule } from './invite-routing.module';
import { InviteComponent} from './invite.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [InviteComponent],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    InviteRoutingModule
  ]
})
export class InviteModule { }
