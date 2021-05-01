import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../service/common-service';
import { ToastService } from '../service/toast.service';
import { MenuController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ToastModalComponent } from '../toast-modal/toast-modal.component';
import { Network } from '@ionic-native/network/ngx';
import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';
@Component({
  selector: 'app-one-time-password',
  templateUrl: './one-time-password.component.html',
  styleUrls: ['./one-time-password.component.scss'],
})
export class OneTimePasswordComponent implements OnInit {
  @ViewChild('ngOtpInput', { static: false }) ngOtpInputRef: any;
  optForm: FormGroup;
  emailForm: FormGroup;
  submitted = false;
  isOpenEmail: boolean = false;
  disableSubmit: boolean = true;
  otpValue: number;
  enableOverlay: boolean = false;
  successModal: boolean = false;
  veriedfiedModal: boolean = false;
  invalidModal: boolean = false;
  emailSentModal: boolean = false;
  enableLoader: boolean = false;
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  public smsTextmessage: string = '';
  public appHashString: string = '';
  public otpCode: any;
  constructor(
    public router: Router,
    route: ActivatedRoute,
    private httpClient: HttpClient,
    private smsRetriever: SmsRetriever,
    private formBuilder: FormBuilder,
    public _toastService: ToastService,
    public modalController: ModalController,
    private _commonService: CommonService,
    private menu: MenuController,
    private network: Network
  ) {

    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
    });

    route.params.subscribe(val => {
      this.optForm = new FormGroup({
        verifyCode: new FormControl('', Validators.compose([
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.required
        ]))
      });
    });
  }

  ionViewDidEnter() {
    document.addEventListener("backbutton", function (e) {
      console.log("disable back button")
    }, false);
  }

  ngOnInit() {
    this.menu.enable(false);
  }

  onOtpChange($event) {
    console.log('$event', $event);
    if ($event.length == 6) {
      this.disableSubmit = false;
      this.otpValue = $event;
    }
  }

  otpSubmit() {
    let data = {
      code: this.otpValue,
      mobile: localStorage.getItem('mobile'),
      lang: localStorage.getItem('language')
    }
    let url = "users/verify-mobile";
    this._commonService.noTokenPost(url, data).subscribe((response) => {
      console.log('response', response);
      this.enableOverlay = true;
      if (response.success) {
        if (response.status == 1) {
          this.ngOtpInputRef.setValue('');
          this.showToast('success', this.messsageObj.otpPage.verifiedMessage[this.defaultLanguage], response.message, 3500, '/class/' + response.result._id)
        }
      } else {
        if (response.status == 0) {
          this.ngOtpInputRef.setValue('');
          this.showToast('error', this.messsageObj.otpPage.invalidMessage[this.defaultLanguage], response.message, 3500, '/otp')
        }
        if (response.status == 2) {
          this.showToast('warning', this.messsageObj.otpPage.alreadyVerifiedMessage[this.defaultLanguage], this.messsageObj.otpPage.enjoyLearningMessage[this.defaultLanguage], 3500, '/login');
        }
      }
    }, (error) => {
      console.log("error ts: ", error);
    });
  }

  getHashCode() {
    this.smsRetriever.getAppHash()
      .then((res: any) => {
        this.appHashString = res;
        console.log(res);
      })
      .catch((error: any) => console.error(error));
  }

  get f() { return this.emailForm.controls; }

  getSMS() {
    this.smsRetriever.startWatching()
      .then((res: any) => {
        console.log(res);
        this.smsTextmessage = res.Message;
        let splitText = this.smsTextmessage.split(':')[1];
        this.otpCode = splitText.substring(0, 6);
        this.otpValue = parseInt(this.otpCode);
        this.ngOtpInputRef.setValue(this.otpValue);
        setTimeout(() => {
          this.otpSubmit();
        }, 500);
      })
      .catch((error: any) => console.error(error));
  }

  openEmail() {
    this.isOpenEmail = true;
    this.emailForm = this.formBuilder.group({
      mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    });
  }

  emailSubmit(data: any) {
    console.log('data', data);
    this.submitted = true;

    // stop here if form is invalid
    if (this.emailForm.invalid) {
      return;
    }
    let url = "users/resend-otp";
    data.lang = localStorage.getItem('language');
    this._commonService.noTokenPost(url, data).subscribe((response) => {
      console.log('response', response);
      if (response.status == 1) {
        this.isOpenEmail = false;
        this.showToast('success', this.messsageObj.otpPage.otpSend[this.defaultLanguage], response.message, 3500, '');
        this.getSMS();
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.otpPage.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.otpPage.warningMessage[this.defaultLanguage], response.message, 2500, '')
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
