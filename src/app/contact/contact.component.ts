import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { IonContent } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { CommonService } from '../service/common-service';
import { ToastService } from '../service/toast.service';
import { ModalController } from '@ionic/angular';
import { LoadingService } from '../service/loading-service';
import { ToastModalComponent } from '../toast-modal/toast-modal.component';
import { Network } from '@ionic-native/network/ngx';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  submitted = false;
  enableLoader: boolean = false;
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  constructor(
    public router: Router,
    route: ActivatedRoute,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    public _toastService: ToastService,
    private _commonService: CommonService,
    public modalController: ModalController,
    private menu: MenuController,
    public loading: LoadingService,
    private network: Network
  ) {

    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
    });

    route.params.subscribe(val => {

      this.defaultLanguage = localStorage.getItem('language');
      this.menu.enable(true);
      this.contactForm = this.formBuilder.group({
        name: [localStorage.getItem('name'), Validators.required],
        email: [localStorage.getItem('email'), [Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]],
        mobile: [localStorage.getItem('mobile'), [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        subject: ['', Validators.required],
        message: ['', [Validators.required, Validators.minLength(40)]],
      });

    });


  }

  ngOnInit() { }

  get f() { return this.contactForm.controls; }

  submitContactForm(data: any) {
    this.submitted = true;

    // stop here if form is invalid
    if (this.contactForm.invalid) {
      return;
    }
    this.enableLoader = true;
    let url = "common/contact";
    data.lang = localStorage.getItem('language');
    this._commonService.noTokenPost(url, data).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.status == 1) {
        this.contactForm.reset('');
        this.submitted = false;
        this.showToast('success', this.messsageObj.contactUs.submitMessage[this.defaultLanguage], response.message, 3000, '/contact')
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.contactUs.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.contactUs.errorMessage[this.defaultLanguage], response.message, 2500, '')
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
