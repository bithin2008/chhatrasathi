import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { IonContent, } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { CommonService } from '../service/common-service';
import { ToastService } from '../service/toast.service';
import { MenuController } from '@ionic/angular';
import { LoadingService } from '../service/loading-service';
import { SharedService } from "../service/shared.service";
import { ModalController } from '@ionic/angular';
import { ToastModalComponent } from '../toast-modal/toast-modal.component';
import { EndSubscriptionModalComponent } from '../end-subscription-modal/end-subscription-modal.component';
import * as moment from 'moment';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  public classId: any;
  public userId: any;
  public subjectList: any = [];
  public token: any;
  isLoading = false;
  userName: string;
  profileImage: string;
  className: string;
  public scrollTop: number = 0;
  enableLoader: boolean = false;
  public pageTitle: any;
  public selectedLanguage: string;
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  remainingDays: any;
  expiryDate: any;
  isAboutExpire: boolean = false;
  isExpired: boolean = false;
  expireMessage: any;
  constructor(
    public router: Router,
    private changeRef: ChangeDetectorRef,
    private zone: NgZone,
    private platform: Platform,
    private httpClient: HttpClient,
    public modalController: ModalController,
    route: ActivatedRoute,
    public _toastService: ToastService,
    private _commonService: CommonService,
    private sharedService: SharedService,
    private menu: MenuController,
    public loading: LoadingService
  ) {
    route.params.subscribe(val => {
      this.suncribeRouteParams();
      this.changeRef.detectChanges();
    });
  }
  ngOnInit() {
  }
  async suncribeRouteParams() {
    this.menu.enable(true);
    if (localStorage.getItem('language')) {
      this.defaultLanguage = localStorage.getItem('language');
    } else {
      this.defaultLanguage = 'en';
      localStorage.setItem('language', 'en');
    }
    this.messsageObj = await this.getMessageData();
    console.log(' this.messsageObj', this.messsageObj);
    this.zone.run(() => {
      this.pageTitle = this.messsageObj.dashboard.pageTitle[this.defaultLanguage];
    });
    console.log('this.router.url', this.router.url)
    this.token = localStorage.getItem('token');
    if (!this.token) {
      this.router.navigate([`/login`]);
    } else {
      this.validateUser();
    }
  }
  getMessageData() {
    return new Promise(resolve => {
      this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
        resolve(data);
      });
    });
  }
  logScrolling(event) {
    console.log("logScrolling : When Scrolling", event.detail.scrollTop);
    if (event.detail.scrollTop > 45) {
      this.scrollTop = 1;
    } else {
      this.scrollTop = 0;
    }
  }
  goToPlan() {
    this.router.navigate(['/subscription']);
  }
  validateUser() {
    this.isExpired = false;
    this.isAboutExpire = false;
    let url = "users/me?lang=" + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      if (response.success) {
        this.userId = response.result._id;
        this.profileImage = response.result.profileimage;
        this.classId = localStorage.getItem('classId');
        this.userName = response.result.name;
        localStorage.setItem('name', response.result.name);
        this.className = localStorage.getItem('className');
        this.sharedService.updateData({ name: response.result.name, profileimage: response.result.profileimage, className: response.result.class.name, lang: this.defaultLanguage });
        this.getSubjectList();
        if (response.result.hasSubscription) {
          if (response.result.hasOwnProperty('endDate')) {
            if (response.result.endDate) {
              var a = moment(response.result.endDate, "x");
              var b = moment();
              var dayDifference = a.diff(b, 'days');
              if (dayDifference <= 3) {
                this.isAboutExpire = true;
                this.remainingDays = dayDifference;
                let expire = moment(a).format("DD MMM, YYYY");
                this.expiryDate = moment(expire).add(1, 'h').format("DD MMM, YYYY");
                this.expireMessage = this.messsageObj.dashboard.upgragePlanOn[this.defaultLanguage].replace('#', this.expiryDate);
              }
            }
          }
        } else {
          if (response.result.subscriptionCount > 0) {
            this.isExpired = true;
          }
        }
      } else {
        console.log('navigate(login) from dashboard');
        this.router.navigate([`/login`]);
      }
    }, (error) => {
      console.log("error ts: ", error);
    });
  }
  async openSubscriptionExpireWarningModal() {
    const modal = await this.modalController.create({
      component: EndSubscriptionModalComponent,
      cssClass: 'subscription-modal'
    });
    modal.onDidDismiss()
      .then((data) => {
      });
    return await modal.present();
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
  getSubjectList() {
    this.enableLoader = true;
    let url = "common/subject?class=" + this.classId + '&lang=' + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.status == 1) {
        this.subjectList = response.results;
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.dashboard.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.dashboard.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      this.enableLoader = false;
      console.log("error ts: ", error);
    });
  }
  goToChapter(item) {
    this.router.navigate(['/chapter/' + item._id]);
  }
}
