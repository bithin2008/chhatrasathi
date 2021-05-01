import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../service/common-service';
import { ToastService } from '../service/toast.service';
import { ModalController } from '@ionic/angular';
import { MenuController, NavController } from '@ionic/angular';
import { LoadingService } from '../service/loading-service';
import { ToastModalComponent } from '../toast-modal/toast-modal.component'
import { Network } from '@ionic-native/network/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  message: string;
  submitted: boolean = false;
  loginForm: FormGroup;
  isBlur: boolean = false;
  placeHolderVal = 'Mobile Number';
  enableLoader: boolean = false;
  deviceId: any;
  token: any;
  messsageObj: any = {};
  defaultLanguage: any;
  showPass: boolean = false;
  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    route: ActivatedRoute,
    private httpClient: HttpClient,
    public _toastService: ToastService,
    public modalController: ModalController,
    private _commonService: CommonService,
    private alertController: AlertController,
    private menu: MenuController,
    public loading: LoadingService,
    private network: Network,
    private navCtrl: NavController
    // private uniqueDeviceID: UniqueDeviceID
  ) {

    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
      //this.planList = this.settings.plans
    });

    route.params.subscribe(val => {
      if (localStorage.getItem('language')) {
        this.defaultLanguage = localStorage.getItem('language');
      } else {
        //  this.defaultLanguage = 'en';
        //  localStorage.setItem('language', 'en');
      }
      this.loginForm = this.formBuilder.group({
        mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        // email: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    });


    // this.network.onConnect().subscribe(() => {
    //   setTimeout(() => {
    //     this.ngOnInit();
    //   }, 500);
    // });
  }
  goToSignUp() {
    this.router.navigate([`/register`]);
  }
  goToForgotPass() {
    this.router.navigate([`/forgot-password`]);
  }
  gotoOTp() {
    this.router.navigate([`/otp`]);
  }
  get f() { return this.loginForm.controls; }
  // getDeviceId(){
  //   this.uniqueDeviceID.get()
  // .then((uuid: any) => {
  //   console.log(uuid);
  //   this.deviceId=uuid;
  // })
  // .catch((error: any) => console.log(error));
  // }
  userLogin(data: any) {
    console.log('data', data);
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    //   data.deviceToken=this.deviceId;
    this.enableLoader = true;
    let url = "users/login";
    data.lang = localStorage.getItem('language');
    this._commonService.noTokenPost(url, data).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.success) {
        if (response.status == 1) {
          localStorage.setItem('token', response.result.token);
          localStorage.setItem('name', response.result.name);
          localStorage.setItem('mobile', response.result.mobile);
          localStorage.setItem('email', response.result.email);
          if (response.result.class) {
            localStorage.setItem('className', response.result.class.name);
            localStorage.setItem('classId', response.result.class._id);
            this.showToast('success', this.messsageObj.login.loginSuccess[this.defaultLanguage], this.messsageObj.login.enjoyLearning[this.defaultLanguage], 3500, '/dashboard');
          } else {
            this.showToast('warning', this.messsageObj.login.classSelect[this.defaultLanguage], this.messsageObj.login.selectClassAndLearning[this.defaultLanguage], 3500, '/class/' + response.result._id + '/' + true);
          }
        }
        if (response.status == 2) {
          this.showToast('warning', this.messsageObj.login.emailNotVerified[this.defaultLanguage], response.message, 3500, '/otp');
        }
        if (response.status == 3) {
          this.showToast('warning', this.messsageObj.login.accountInactive[this.defaultLanguage], response.message, 3500, '/otp');
        }
        if (response.status == 4) {
          this.logoutFromAllDevice(response.message);
        }
        if (response.status == 0) {
          this.showToast('warning', this.messsageObj.login.invalidMessage[this.defaultLanguage], response.message, 3500, '');
        }
      } else {
        if (response.status == 0) {
          this.showToast('error', this.messsageObj.login.invalidMessage[this.defaultLanguage], response.message, 3500, '');
        }
      }
    }, (error) => {
      this.enableLoader = false;
      console.log("error ts: ", error);
    });
  }





  ngOnInit() {
    this.menu.enable(false);
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.validateUser();
    }
    // this.getDeviceId();
  }
  async logoutFromAllDevice(message) {
    const alert = await this.alertController.create({
      cssClass: 'logout-all-box lang-' + this.defaultLanguage,
      header: this.defaultLanguage == 'en' ? 'Warning' : 'সতর্কীকরণ',
      message: message,
      buttons: [
        {
          text: this.messsageObj.login.allLogoutMessage[this.defaultLanguage],
          cssClass: 'logout-all lang-' + this.defaultLanguage,
          handler: () => {
            this.logOut();
          }
        },
        {
          text: this.messsageObj.login.cancelMessage[this.defaultLanguage],
          role: 'cancel',
          cssClass: 'logout-all lang-' + this.defaultLanguage,
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });
    await alert.present();
  }
  logOut() {
    //this.loginForm.value.email
    this.enableLoader = true;
    let url = "users/logout-all";
    this._commonService.noTokenPost(url, { mobile: this.loginForm.value.mobile, lang: localStorage.getItem('language') }).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.status == 1) {
        localStorage.setItem('token', '');
        this.showToast('success', this.messsageObj.login.logoutMessage[this.defaultLanguage], response.message, 2500, '/login');
      } else {
        localStorage.setItem('token', '');
        this.showToast('success', this.messsageObj.login.logoutMessage[this.defaultLanguage], response.message, 2500, '/login');
      }
    }, (error) => {
      this.enableLoader = false;
      console.log("error ts: ", error);
    });
  }
  validateUser() {
    let url = "users/me?lang=" + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      if (response.success) {
        console.log('navigate(dashboard) from login');
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      }
    }, (error) => {
      this.showToast('error', this.messsageObj.login.errorMessage[this.defaultLanguage], error, 3500, '');
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
