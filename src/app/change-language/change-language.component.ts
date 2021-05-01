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
  selector: 'app-change-language',
  templateUrl: './change-language.component.html',
  styleUrls: ['./change-language.component.scss'],
})
export class ChangeLanguageComponent implements OnInit {
  language = [
    {
      name: 'English',
      code: 'en',
      isSelected: false
    },
    {
      name: 'বাংলা',
      code: 'beng',
      isSelected: false
    },
  ]
  defaultLanguage: any = 'beng';
  messsageObj: any = {};
  langObj: any = {};
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
    private network: Network,
  ) {
    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
      //this.planList = this.settings.plans
    });
    route.params.subscribe(val => {
      this.defaultLanguage = localStorage.getItem('language');
      this.language.forEach(element => {
        if (element.code == this.defaultLanguage) {
          element.isSelected = true;
        }
      });
      this.menu.enable(true);
    });
  }

  ngOnInit() {

  }

  selectLanguage(obj) {
    this.language.forEach(element => {
      element.isSelected = false;
    });
    obj.isSelected = true;
    this.langObj = obj;
  }

  changeLanguage() {
    console.log('this.langObj', this.langObj)
    localStorage.setItem('language', this.langObj.code);
    this.sharedService.updateLanguage(this.langObj);
    this.showToast('success', this.messsageObj.changeLanguage.languageChanged[this.langObj.code], this.messsageObj.changeLanguage.languageChangedTo[this.langObj.code] + ' ' + this.langObj.name, 3500, '/dashboard')
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
