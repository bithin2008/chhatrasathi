import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from '../service/common-service';
import { ToastService } from '../service/toast.service';
import { ModalController } from '@ionic/angular';
import { LoadingService } from '../service/loading-service';
import { ToastModalComponent } from '../toast-modal/toast-modal.component';

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.scss'],
})
export class TermsConditionComponent implements OnInit {
  enableLoader: boolean = false;
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  termsObj: any = {};
  constructor(
    private httpClient: HttpClient,
    public _toastService: ToastService,
    private _commonService: CommonService,
    public modalController: ModalController,
    public loading: LoadingService
  ) {
    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
    });
    this.defaultLanguage = localStorage.getItem('language');
    this.getTermsContent()
  }

  ngOnInit() {

  }

  getTermsContent() {
    this.enableLoader = true;
    let url = "common/cms/terms-conditions";
    this._commonService.noTokenGet(url).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.status == 1) {
        this.termsObj = response.result;
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

  confirmTerms() {
    this.modalController.dismiss(true);
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
