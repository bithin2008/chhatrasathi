import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../service/common-service';
import { ToastService } from '../service/toast.service';
import { MenuController } from '@ionic/angular';
import { LoadingService } from '../service/loading-service';
import { ModalController } from '@ionic/angular';
import { ToastModalComponent } from '../toast-modal/toast-modal.component'
import { Network } from '@ionic-native/network/ngx';
@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
})
export class ClassComponent implements OnInit {
  classes: any = [];
  classObj: any = {};
  disableFinish: boolean = true;
  userId: string;
  public token: any;
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
    private _commonService: CommonService,
    private network: Network,
    private menu: MenuController,
    public loading: LoadingService
  ) {
    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
    });

    route.params.subscribe(val => {
      this.menu.enable(false);
      this.defaultLanguage = localStorage.getItem('language');
      this.userId = this._activatedRoute.snapshot.paramMap.get("userId");
      this.isSelectClass = this._activatedRoute.snapshot.paramMap.get("isclass");
      this.getClass()
    });

  }

  ngOnInit() {


  }


  // validateUser() {

  //   let url = "users/me";
  //   this._commonService.get(url).subscribe((response) => {
  //     console.log('response', response);
  //     // this.loading.dismiss();
  //     if (response.success) {
  //       this.getClass();
  //     } else {
  //       console.log('navigate(login) from Chapter');
  //       this.router.navigate([`/login`]);
  //     }
  //   }, (error) => {
  //     // this.enableLoader=false;
  //     console.log("error ts: ", error);
  //   });
  // }

  getClass() {
    this.enableLoader = true;
    let url = "common/class?lang=" + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.noTokenGet(url).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.status == 1) {
        this.classes = response.results;
        this.classes.forEach(element => {
          element.isSelected = false;
        });
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.class.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.class.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      console.log("error ts: ", error);
    });
  }

  ionViewDidEnter() {
    document.addEventListener("backbutton", function (e) {
      console.log("disable back button")
    }, false);
  }

  selectClass(obj) {
    this.classes.forEach(element => {
      element.isSelected = false;
    });
    obj.isSelected = true;
    this.classObj = obj;
    this.disableFinish = false;
  }


  completeRegistration() {
    this.loading.present();
    // data.deviceToken=this.deviceId;
    let url = "users/signup-step3";
    let data = {
      _id: this.userId,
      class: this.classObj._id,
      lang: localStorage.getItem('language')
    }
    this._commonService.noTokenPost(url, data).subscribe((response) => {
      console.log('response', response);
      this.loading.dismiss();
      if (response.status == 1) {
        //  this.registeredId = response.result._id;
        var selectClassObj = {
          id: '',
          name: ''
        };
        this.classes.forEach(element => {
          if (element._id == this.classObj._id) {
            selectClassObj.id = element._id;
            selectClassObj.name = element.name;
          }
        });
        if (this.isSelectClass) {
          localStorage.setItem('className', selectClassObj.name);
          localStorage.setItem('classId', selectClassObj.id);
          this.showToast('success', this.messsageObj.class.successLogin[this.defaultLanguage], this.messsageObj.class.enjoyLearning[this.defaultLanguage], 3500, '/dashboard');
        } else {
          this.showToast('success', this.messsageObj.class.completeRegistration[this.defaultLanguage], this.messsageObj.class.congratsMessage[this.defaultLanguage], 4000, '/login')
        }
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.class.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.class.errorMessage[this.defaultLanguage], response.message, 2500, '')
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
