import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { CommonService } from '../service/common-service';
import { ToastService } from '../service/toast.service';
import { LoadingService } from '../service/loading-service';
import { ModalController } from '@ionic/angular';
import { TermsConditionComponent } from '../terms-condition/terms-condition.component';
import { ToastModalComponent } from '../toast-modal/toast-modal.component';
import { Network } from '@ionic-native/network/ngx';
import { MustMatch } from '../_helper/must-match.validator';
import * as moment from 'moment';
//import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  public scrollTop: number = 0;
  registerForm: FormGroup;
  submitted = false;
  isBlur: boolean = false;
  classes: any = [];
  placeHolderVal = 'Mobile Number';
  phoneNumber = "^[789]\d{9}$";
  deviceId: any;
  enableLoader: boolean = false;
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  showPass: boolean = false;
  showConfirmPass: boolean = false;
  constructor(
    public router: Router,
    route: ActivatedRoute,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    public _toastService: ToastService,
    public modalController: ModalController,
    private _commonService: CommonService,
    private menu: MenuController,
    public loading: LoadingService,
    private network: Network
    // private uniqueDeviceID: UniqueDeviceID
  ) {

    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
    });

    route.params.subscribe(val => {
      this.defaultLanguage = localStorage.getItem('language');

      this.registerForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]],
        mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        isAgree: [null, Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      }, {
        validator: MustMatch('password', 'confirmPassword')
      });
    });
  }

  get f() { return this.registerForm.controls; }

  ngOnInit() {
    this.menu.enable(false);
  }

  logScrolling(event) {
    console.log("logScrolling : When Scrolling", event.detail.scrollTop);
    if (event.detail.scrollTop > 20) {
      this.scrollTop = 1;
    } else {
      this.scrollTop = 0;
    }
  }

  goToLogin() {
    this.router.navigate([`/login`]);
  }
  otp() {
    this.router.navigate([`/otp`]);
  }

  async openTerms(event) {
    event.preventDefault();
    const modal = await this.modalController.create({
      component: TermsConditionComponent,
      cssClass: 'terms-conditions'
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log('this.registerForm', this.registerForm.controls.isAgree.value)
        console.log('terms data', data['data']); // Here's your selected user!
        this.registerForm.patchValue({
          isAgree: data['data'],
        });
      });
    return await modal.present();
  }

  userRegister(data: any) {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.enableLoader = true;
    // data.deviceToken=this.deviceId;
    let url = "users/signup";
    localStorage.setItem('mobile', data.mobile);
    data.lang = localStorage.getItem('language');
    this._commonService.noTokenPost(url, data).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.success) {
        //  this.registeredId = response.result._id;
        if (response.status == 1) {
          this.showToast('success', this.messsageObj.register.otpSent[this.defaultLanguage], this.messsageObj.register.checkMobile[this.defaultLanguage], 3500, '/otp')
        }
        if (response.status == 2) {
          this.showToast('warning', this.messsageObj.register.alreadyRegistered[this.defaultLanguage], this.messsageObj.register.nowLogin[this.defaultLanguage], 3500, '/login')
        }
        if (response.status == 3) {
          this.showToast('warning', this.messsageObj.register.mobNotVerified[this.defaultLanguage], this.messsageObj.register.otpMobileVerification[this.defaultLanguage], 4000, '/otp')
        }
        if (response.status == 0) {
          this.showToast('warning', this.messsageObj.register.termsConditions[this.defaultLanguage], response.message, 4000, '')
        }
      } else {
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
