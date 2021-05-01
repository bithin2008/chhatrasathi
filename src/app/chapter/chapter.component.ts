import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../service/common-service';
import { ToastService } from '../service/toast.service';
import { LoadingService } from '../service/loading-service';
import { SharedService } from "../service/shared.service";
import { Network } from '@ionic-native/network/ngx';
import { ModalController } from '@ionic/angular';
import { ToastModalComponent } from '../toast-modal/toast-modal.component';
@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss'],
})
export class ChapterComponent implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  public classId: any;
  public userId: any;
  public chapterList: any = [];
  public subjectId: any;
  public subjectName: any;
  public token: any;
  public userName: string;
  public className: string;
  public paginationObj: any = {};
  public page: number = 1;
  public pageSize: number = 10;
  public scrollTop: number = 0;
  public hasSubscription: boolean = false;
  public enableLoader: boolean = false;
  showNoRecord: boolean = false;
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  constructor(
    public router: Router,
    route: ActivatedRoute,
    private httpClient: HttpClient,
    public modalController: ModalController,
    public _toastService: ToastService,
    public _activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private _commonService: CommonService,
    public loading: LoadingService,
    private network: Network
  ) {
    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
    });

    route.params.subscribe(val => {
      this.defaultLanguage = localStorage.getItem('language');
      console.log('ngOnInit from Chapter');
      this.token = localStorage.getItem('token');
      if (!this.token) {
        this.router.navigate([`/login`]);
      } else {
        this.chapterList = [];
        this.page = 1;
        this.validateUser();
      }
      this.sharedService.sharedData.subscribe((data: any) => {
        this.userName = data.name;
        this.className = data.className;
      })
      if (!this.userName) {
        this.userName = localStorage.getItem('name');
      }
      if (!this.className) {
        this.className = localStorage.getItem('className');
      }
      this.classId = localStorage.getItem('classId');
      this.subjectId = this._activatedRoute.snapshot.paramMap.get("subjectId");
      console.log('subjectId', this.subjectId)
    });


  }
  ngOnInit() {

  }
  navigateNotification() {
    this.router.navigate(['/notification/' + this.userId]);
  }
  logScrolling(event) {
    console.log("logScrolling : When Scrolling", event.detail.scrollTop);
    if (event.detail.scrollTop > 45) {
      this.scrollTop = 1;
    } else {
      this.scrollTop = 0;
    }
  }
  validateUser() {
    let url = "users/me?lang=" + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      // this.loading.dismiss();
      if (response.success) {
        this.getChapterList();
        this.hasSubscription = response.result.hasSubscription;
        this.userId = response.result._id;
      } else {
        console.log('navigate(login) from Chapter');
        this.router.navigate([`/login`]);
      }
    }, (error) => {
      // this.enableLoader=false;
      console.log("error ts: ", error);
    });
  }
  getChapterList() {
    if (this.page == 1) {
      this.enableLoader = true;
    }
    let url = "common/chapter?class=" + this.classId + '&subject=' + this.subjectId + '&page=' + this.page + '&pageSize=' + this.pageSize + '&lang=' + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.status == 1) {
        this.paginationObj = response.pagination;
        this.chapterList = this.chapterList.concat(response.results);
        if (this.chapterList.length > 0) {
          this.showNoRecord = false;
          this.subjectName = this.chapterList[0].subject.name;
          this.chapterList.forEach((element, index) => {
            if (element.isFree) {
              element.isEnable = true;
            }
            if (this.hasSubscription) {
              element.isEnable = true;
            }
          });
        }
        else {
          this.showNoRecord = true;
        }
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.chapter.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.chapter.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      console.log("error ts: ", error);
      this.enableLoader = false;
    });
  }
  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      this.page += 1;
      if (this.paginationObj.nextPage != 0) {
        this.getChapterList();
      }
      event.target.complete();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.paginationObj.nextPage == 0) {
        event.target.disabled = true;
      }
    }, 500);
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
  goToChapter(obj) {
    if (obj.isEnable) {
      this.router.navigate(['/lesson/' + this.subjectId + '/' + obj.subject.name + '/' + obj._id, { 'chapterName': obj.name }]);
    } else {
      this.showToast('error', this.messsageObj.chapter.pleaseSubscribe[this.defaultLanguage], this.messsageObj.chapter.subscribeEnjoy[this.defaultLanguage], 3500, '');
    }
  }
}
