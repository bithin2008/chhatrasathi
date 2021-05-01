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
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss'],
})
export class SlidesComponent {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  public scrollTop: number = 0;
  defaultLanguage: any = '';
  language: any;
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

  }



  ngOnInit() {
    this.menu.enable(false);
    this.language = localStorage.getItem('language');
    // if (this.language) {
    //   this.router.navigate(['/login']);
    // }
  }

  setLanguage(lang) {
    localStorage.setItem('language', lang);
    this.defaultLanguage = localStorage.getItem('language');


  }

  continue() {
    if (!localStorage.getItem('language')) {
      this.showToast('warning', 'Warning', 'Please select app language', 3000, '')
      return;
    }

    if (this.defaultLanguage == 'beng') {
      this.showToast('success', 'সাফল্য', 'ভাষা নির্বাচন সম্পূর্ণ হয়েছে', 3000, '/login')
    } else {
      this.showToast('success', 'Success', 'Language selection completed', 3000, '/login')
    }
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
