import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../service/common-service';
import { ToastService } from '../service/toast.service';
import { MenuController } from '@ionic/angular';
import { LoadingService } from '../service/loading-service';
import { ModalController } from '@ionic/angular';
import { SharedService } from "../service/shared.service";
import { ToastModalComponent } from '../toast-modal/toast-modal.component';
import { Network } from '@ionic-native/network/ngx';
@Component({
  selector: 'app-change-class',
  templateUrl: './change-class.component.html',
  styleUrls: ['./change-class.component.scss'],
})
export class ChangeClassComponent implements OnInit {
  public token: any;
  userObj: any = {};
  classes: any = [];
  classObj: any = {};
  disableFinish: boolean = true;
  userId: string;
  isSelectClass: any;
  enableLoader: boolean = false;
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  constructor(
    public router: Router,
    route: ActivatedRoute,
    private httpClient: HttpClient,
    public _toastService: ToastService,
    public modalController: ModalController,
    public _activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private _commonService: CommonService,
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
      this.token = localStorage.getItem('token');
      if (!this.token) {
        this.router.navigate([`/login`]);
      } else {
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
        this.userObj = response.result;
        // this.hasSubscription = this.userObj.hasSubscription;
        this.getClass();
      } else {
        console.log('navigate(login) from dashboard');
        this.router.navigate([`/login`]);
      }
    }, (error) => {
      console.log("error ts: ", error);
    });
  }


  getClass() {
    // if (!this.userObj.hasSubscription) {
    //   this.showToast('error', this.messsageObj.changeClass.subscriptionMessage[this.defaultLanguage], this.messsageObj.changeClass.subscriptionChangeClassMessage[this.defaultLanguage], 3500, '');
    // } else {
    this.enableLoader = true;
    let url = "common/class?lang=" + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.noTokenGet(url).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.status == 1) {
        this.classes = response.results;
        this.classes.forEach(element => {
          if (element._id == this.userObj.class._id) {
            element.isSelected = true;
          }
        });
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.changeClass.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.changeClass.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      console.log("error ts: ", error);
    });

    //  }
  }

  selectClass(obj) {
    this.classes.forEach(element => {
      element.isSelected = false;
    });
    obj.isSelected = true;
    this.classObj = obj;
    this.disableFinish = false;
  }


  changeClass() {
    if (!this.userObj.hasSubscription) {
      this.showToast('error', this.messsageObj.changeClass.subscriptionMessage[this.defaultLanguage], this.messsageObj.changeClass.subscriptionChangeClassMessage[this.defaultLanguage], 3500, '');
      this.getClass();
      return;
    }
    let classObj = {
      class: this.classObj._id,
      className: this.classObj.name,
      lang: localStorage.getItem('language'),
      token: localStorage.getItem('token')
    }
    let url = "users/change-class";
    this.enableLoader = true;
    this._commonService.post(url, classObj).subscribe((response) => {
      this.enableLoader = false;
      if (response.status == 1) {
        this.userObj.class = this.classObj._id;
        this.userObj.className = this.classObj.name;
        this.sharedService.updateData(this.userObj);
        localStorage.setItem('className', this.classObj.name)
        localStorage.setItem('classId', this.classObj._id)
        this.showToast('success', this.messsageObj.changeClass.changeMessage[this.defaultLanguage], response.message, 3500, '/dashboard')
      } else if (response.status == 401) {
        this.getClass();
        this.showToast('error', this.messsageObj.changeClass.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.getClass();
        this.showToast('error', this.messsageObj.changeClass.errorMessage[this.defaultLanguage], response.message, 6000, '')
      }
    }, (error) => {
      console.log("error ts: ", error);
    });

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
