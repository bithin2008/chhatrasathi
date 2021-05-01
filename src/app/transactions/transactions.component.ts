import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { IonContent } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { CommonService } from '../service/common-service';
import { ToastService } from '../service/toast.service';
import { MenuController } from '@ionic/angular';
import { LoadingService } from '../service/loading-service';
import { SharedService } from "../service/shared.service";
import { ModalController } from '@ionic/angular';
import { ToastModalComponent } from '../toast-modal/toast-modal.component';
import { Network } from '@ionic-native/network/ngx';
import * as moment from 'moment';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  enableLoader: boolean = false;
  public transactionList: any = [];
  public activeSubscriptionObj: any = {};
  paginationObj: any = {};
  page: number = 1;
  pageSize: number = 5;
  token: any = '';
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  constructor(
    public router: Router,
    private platform: Platform,
    route: ActivatedRoute,
    private httpClient: HttpClient,
    public modalController: ModalController,
    public _toastService: ToastService,
    private _commonService: CommonService,
    private sharedService: SharedService,
    private menu: MenuController,
    public loading: LoadingService,
    private network: Network
  ) {

    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
      //this.planList = this.settings.plans
    });

    route.params.subscribe(val => {
      this.defaultLanguage = localStorage.getItem('language');
      this.menu.enable(true);
      console.log('this.router.url', this.router.url)
      this.token = localStorage.getItem('token');
      if (!this.token) {
        this.router.navigate([`/login`]);
      } else {
        this.transactionList = [];
        this.page = 1;
        this.validateUser();
      }
    });
  }

  ngOnInit() {
  }

  validateUser() {
    let url = "users/me?lang=" + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      if (response.success) {
        this.getTransactionList();
      } else {
        console.log('navigate(login) from dashboard');
        this.router.navigate([`/login`]);
      }
    }, (error) => {
      console.log("error ts: ", error);
    });
  }


  getTransactionList() {
    this.transactionList = [];
    if (this.page == 1) {
      this.enableLoader = true;
    }
    let url = 'users/transactions?page=' + this.page + '&pageSize=' + this.pageSize + '&lang=' + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.status == 1) {
        this.paginationObj = response.pagination;
        //  this.transactionList = this.transactionList.concat(response.results);
        this.transactionList = this.transactionList.concat(response.results);
        response.results.forEach((element, index) => {
          element.startDate = moment(parseInt(element.startDate)).format("DD.MM.YYYY hh:mm A");
          element.endDate = moment(parseInt(element.endDate)).format("DD.MM.YYYY hh:mm A");
          //  this.transactionList.push(element);
          if (element.isActive) {
            this.activeSubscriptionObj = element;
          }
        });
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.subscription.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.subscription.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      this.enableLoader = false;
      console.log("error ts: ", error);
    });
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      this.page += 1;
      if (this.paginationObj.nextPage != 0) {
        this.getTransactionList();
      }
      event.target.complete();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.paginationObj.nextPage == 0) {
        event.target.disabled = true;
      }
    }, 500);
  }

  navigatePlan() {
    this.router.navigate(['/subscription']);
  }

  async showToast(status, message, submessage, timer, redirect) {
    const modal = await this.modalController.create({
      component: ToastModalComponent,
      cssClass: 'toast-modal',
      componentProps: {
        status: status,
        message: message,
        submessage: submessage,
        timer: timer,
        redirect: redirect
      }
    });
    return await modal.present();
  }
}
