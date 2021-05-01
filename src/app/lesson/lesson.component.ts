import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../service/common-service';
import { ToastService } from '../service/toast.service';
import { MenuController } from '@ionic/angular';
import { LoadingService } from '../service/loading-service';
import { Network } from '@ionic-native/network/ngx';
import { ModalController } from '@ionic/angular';
import { ToastModalComponent } from '../toast-modal/toast-modal.component';
import { ShowImageModalComponent } from '../show-image-modal/show-image-modal.component';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit {
  public token: any;
  public enableSearchBar: boolean = false;
  public subjectId: string;
  public chapterId: string;
  public classId: string;
  public subjectName: string;
  public subjectHeadingName: string;
  public chapterName: string;
  public lessionList: any = [];
  public searchTxt: any = "";
  paginationObj: any = {};
  page: number = 1;
  pageSize: number = 5;
  enableLoader: boolean = false;
  showNoRecord: boolean = false;
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  constructor(
    public router: Router,
    route: ActivatedRoute,
    private httpClient: HttpClient,
    public _toastService: ToastService,
    private _commonService: CommonService,
    public _activatedRoute: ActivatedRoute,
    private menu: MenuController,
    public loading: LoadingService,
    public modalController: ModalController,
    private network: Network
  ) {
    // this.network.onConnect().subscribe(() => {
    //   this.token = localStorage.getItem('token');
    // if (!this.token) {
    //   this.router.navigate([`/login`]);
    // }else{
    //   this.validateUser(); 
    // }
    // this.menu.enable(true);
    // this.subjectId = this._activatedRoute.snapshot.paramMap.get("subjectId");
    // this.subject = this._activatedRoute.snapshot.paramMap.get("subject");
    // this.chapterId = this._activatedRoute.snapshot.paramMap.get("chapterId");
    // this.classId = localStorage.getItem('classId'); 
    // });
    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
      //this.planList = this.settings.plans
    });

    route.params.subscribe(val => {
      this.defaultLanguage = localStorage.getItem('language');
      this.token = localStorage.getItem('token');
      if (!this.token) {
        this.router.navigate([`/login`]);
      } else {
        this.validateUser();
      }
      this.menu.enable(true);
      this.subjectId = this._activatedRoute.snapshot.paramMap.get("subjectId");
      this.subjectHeadingName = this._activatedRoute.snapshot.paramMap.get("subjectName");
      this.chapterName = this._activatedRoute.snapshot.paramMap.get("chapterName");
      this.chapterId = this._activatedRoute.snapshot.paramMap.get("chapterId");
      this.classId = localStorage.getItem('classId');
    });

  }
  ngOnInit() {

  }

  async showLightBox(ev) {
    console.log(ev.srcElement.getAttribute("src"));
    event.preventDefault();
    const modal = await this.modalController.create({
      component: ShowImageModalComponent,
      cssClass: 'show-image',
      componentProps: {
        imagePath: ev.srcElement.getAttribute("src"),
      }
    });
    modal.onDidDismiss()
      .then((data) => {
      });
    return await modal.present();
  }

  validateUser() {
    let url = "users/me?lang=" + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      if (response.success) {
        this.getLessionList();
      } else {
        this.router.navigate([`/login`]);
      }
    }, (error) => {
      console.log("error ts: ", error);
    });
  }

  getLessionList() {
    if (this.page == 1) {
      this.enableLoader = true;
    }
    let data = {
      class: this.classId,
      subject: this.subjectId,
      chapter: this.chapterId,
      page: this.page,
      pageSize: this.pageSize,
      limit: 1,
      sortBy: 'displayOrder',
      sortOrder: 'ASC',
      searchText: this.searchTxt,
      lang: localStorage.getItem('language'),
      token: localStorage.getItem('token')
    }
    let url = "common/lesson";
    this._commonService.post(url, data).subscribe((response) => {
      //  this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      if (this.page == 1) {
        this.enableLoader = false;
      }
      if (response.status == 1) {
        this.paginationObj = response.pagination;
        this.lessionList = this.lessionList.concat(response.results);
        if (this.lessionList.length > 0) {
          this.showNoRecord = false;
          this.subjectName = this.lessionList[0].subject.name;
          //this.chapterName = this.lessionList[0].chapter.name;
        } else {
          this.showNoRecord = true;
        }
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.lesson.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.lesson.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      this.enableLoader = false;
      console.log("error ts: ", error);
    });
  }

  openSearchBar() {
    this.enableSearchBar = true;
  }

  closeSearchBar() {
    this.enableSearchBar = false;
    this.searchTxt = '';
    this.lessionList = [];
    this.page = 1;
    this.getLessionList()
  }

  clearSearchInput(ev) {
    ev.target.value = '';
    return false;
  }

  searchLesson($event) {
    console.log('event', $event.detail.value);
    this.searchTxt = $event.detail.value;
    this.lessionList = [];
    this.page = 1;
    this.getLessionList()
  }

  loadData(event) {
    this.enableSearchBar = false;
    setTimeout(() => {
      console.log('Done');
      this.page += 1;
      if (this.paginationObj.nextPage != 0) {
        this.getLessionList();
      }
      event.target.complete();
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
}
