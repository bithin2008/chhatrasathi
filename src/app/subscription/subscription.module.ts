import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent} from './subscription.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionRoutingModule } from './subscription-routing.module';


@NgModule({
  declarations: [SubscriptionComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SubscriptionRoutingModule
  ]
})
export class SubscriptionModule { }
