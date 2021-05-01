import { NgModule } from '@angular/core';
import { OneTimePasswordRoutingModule } from './one-time-password-routing.module';
import { CommonModule } from '@angular/common';
import { OneTimePasswordComponent} from './one-time-password.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from  'ng-otp-input';

@NgModule({
  declarations: [OneTimePasswordComponent],
  imports: [
    CommonModule,    
    IonicModule,
    FormsModule,
    NgOtpInputModule,
    ReactiveFormsModule,
    OneTimePasswordRoutingModule
  ]
})
export class OneTimePasswordModule { }
