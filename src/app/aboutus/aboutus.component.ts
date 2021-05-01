import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../service/loading-service';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../service/common-service';
import { ModalController } from '@ionic/angular';
import { ToastService } from '../service/toast.service';
import { ToastModalComponent } from '../toast-modal/toast-modal.component';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss'],
})
export class AboutusComponent implements OnInit {
  public aboutUsObj: any = {};
  enableLoader: boolean = false;
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  constructor(
    public loading: LoadingService,
    route: ActivatedRoute,
    private httpClient: HttpClient,
    public modalController: ModalController,
    public _toastService: ToastService,
    private _commonService: CommonService,
    private network: Network
  ) {
    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
    });
    route.params.subscribe(val => {
    });
  }

  ngOnInit() {
    this.getAboutUs();
  }

  getAboutUs() {
    this.enableLoader = true;
    let url = "common/cms/about-us";
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.status == 1) {
        this.aboutUsObj = response.result;
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.aboutUs.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.aboutUs.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      this.enableLoader = false;
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
