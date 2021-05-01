import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MenuController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from '../service/loading-service';
import { CommonService } from '../service/common-service';
import { ModalController } from '@ionic/angular';
import { ToastModalComponent } from '../toast-modal/toast-modal.component';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  public token: any;
  public faqList: any = [];
  enableLoader: boolean = false;
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  constructor(
    public loading: LoadingService,
    public router: Router,
    route: ActivatedRoute,
    private menu: MenuController,
    private httpClient: HttpClient,
    private _commonService: CommonService,
    public modalController: ModalController,
    private network: Network
  ) {
    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
      //this.planList = this.settings.plans
    });

    route.params.subscribe(val => {

      this.defaultLanguage = localStorage.getItem('language');
      this.menu.enable(true);
      this.token = localStorage.getItem('token');
      if (!this.token) {
        this.router.navigate([`/login`]);
      } else {
        this.getFaqList();
      }
    });
  }

  ngOnInit() {
    // this.getFaqList();
  }

  expandQuestion(item) {
    console.log('item', item);
    let cloneItem = Object.assign({}, item);
    var itemIndex = 0;
    this.faqList.forEach((element, index) => {
      element.isExpand = false;
      if (element._id == item._id) {
        itemIndex = index;
      }
    });
    this.faqList[itemIndex].isExpand = !cloneItem.isExpand;
  }


  getFaqList() {
    this.enableLoader = true;
    let url = "common/faqs?lang=" + localStorage.getItem('language');
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.status == 1) {
        this.faqList = response.results;
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.faq.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.faq.errorMessage[this.defaultLanguage], response.message, 2500, '')
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
