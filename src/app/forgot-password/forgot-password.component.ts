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
import { ToastModalComponent } from '../toast-modal/toast-modal.component';
import { Network } from '@ionic-native/network/ngx';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  public scrollTop: number = 0;
  forgotPassForm: FormGroup;
  submitted = false;
  isBlur: boolean = false;
  classes: any = [];
  placeHolderVal = 'Mobile Number';
  phoneNumber = "^[789]\d{9}$";
  deviceId: any;
  enableLoader: boolean = false;
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
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
      //this.planList = this.settings.plans
    });



    route.params.subscribe(val => {
      this.defaultLanguage = localStorage.getItem('language');
      this.menu.enable(false);
      this.forgotPassForm = this.formBuilder.group({
        // email: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]],
        mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      });
    });
  }

  get f() { return this.forgotPassForm.controls; }

  ngOnInit() {

  }

  logScrolling(event) {
    console.log("logScrolling : When Scrolling", event.detail.scrollTop);
    if (event.detail.scrollTop > 45) {
      this.scrollTop = 1;
    } else {
      this.scrollTop = 0;
    }
  }

  goToLogin() {
    this.router.navigate([`/login`]);
  }

  submitEmailForm(data: any) {
    this.submitted = true;

    if (this.forgotPassForm.invalid) {
      return;
    }
    this.enableLoader = true;
    let url = "users/forgot-password";
    data.lang = localStorage.getItem('language');
    this._commonService.noTokenPost(url, data).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;

      if (response.success) {
        this.showToast('success', this.messsageObj.forgotPass.newPasswordSent[this.defaultLanguage], response.message, 3500, '/login')
      } else {
        this.showToast('error', this.messsageObj.forgotPass.invalidMessage[this.defaultLanguage], response.message, 2500, '/forgot-password')
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
