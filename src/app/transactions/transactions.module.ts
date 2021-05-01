import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [TransactionsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TransactionsRoutingModule
  ]
})
export class TransactionsModule { }
