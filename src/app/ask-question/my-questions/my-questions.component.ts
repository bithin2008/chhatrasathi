import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../service/loading-service';
import { CommonService } from '../../service/common-service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastService } from '../../service/toast.service';
import { ToastModalComponent } from '../../toast-modal/toast-modal.component';
import { ModalController } from '@ionic/angular';
import { HttpClient } from "@angular/common/http";
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-my-questions',
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.scss'],
})
export class MyQuestionsComponent implements OnInit {

  public myQuestionList: any = [];
  public subjectList: any = [];
  public chapterList: any = [];
  enableLoader: boolean = false;
  public paginationObj: any = {};
  public page: number = 1;
  public pageSize: number = 5;
  public subject: any = '';
  public chapter: any = '';
  public classes: any = [];
  public isFilterPanelOpen: boolean = false;
  public filterClass: any = '';
  public filterSubject: any = '';
  public filterChapter: any = '';
  public disableChapter: boolean = true;
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  constructor(
    public loading: LoadingService,
    private alertController: AlertController,
    route: ActivatedRoute,
    public router: Router,
    public _toastService: ToastService,
    public modalController: ModalController,
    private _commonService: CommonService,
    private network: Network,
    private httpClient: HttpClient
  ) {

    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
    });

    route.params.subscribe(val => {
      this.defaultLanguage = localStorage.getItem('language');
      this.myQuestionList = [];
      this.page = 1;
      this.getMyQuestionList();
    });
  }

  ngOnInit() {

  }



  getMyQuestionList() {
    if (this.page == 1) {
      this.enableLoader = true;
    }
    let url = "questions/my-questions" + '?class=' + localStorage.getItem('classId') + '&subject=' + this.subject + '&chapter=' + this.chapter + '&page=' + this.page + '&pageSize=' + this.pageSize + '&lang=' + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      if (this.page == 1) {
        this.enableLoader = false;
      }
      if (response.status == 1) {
        if (response.results.length > 0) {
          this.paginationObj = response.pagination;
          this.myQuestionList = this.myQuestionList.concat(response.results);
        }
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.myQuestion.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.myQuestion.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      this.enableLoader = false;
      console.log("error ts: ", error);
    });
  }

  expandFilterPanel() {
    this.isFilterPanelOpen = true;
    this.getClass();
  }

  closeFilterPanel() {
    this.isFilterPanelOpen = false;
  }

  getClass() {
    this.enableLoader = true;
    let url = "common/class?lang=" + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.noTokenGet(url).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.success) {
        response.results.forEach(element => {
          if (element.isActive) {
            this.classes.push({ value: element._id, text: element.name })
          }
        });
        setTimeout(() => {
          this.filterClass = localStorage.getItem('classId');
        }, 200);
        this.getSubjectList()
        console.log('this.classes', this.classes);
      } else {
      }
    }, (error) => {
      this.enableLoader = false;
      console.log("error ts: ", error);
    });
  }

  getSubjectList() {
    this.enableLoader = true;
    let url = "common/subject?class=" + localStorage.getItem('classId') + '&lang=' + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.status == 1) {
        this.subjectList = response.results;
        //  this.disableChapter = false;
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.myQuestion.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.myQuestion.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      this.enableLoader = false;
      console.log("error ts: ", error);
    });
  }

  getChapterList() {
    console.log('event', event)
    this.enableLoader = true;
    let url = "common/chapter?class=" + localStorage.getItem('classId') + '&subject=' + this.filterSubject + '&page=' + 1 + '&pageSize=' + 100 + '&lang=' + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.status == 1) {
        this.chapterList = response.results;
        this.disableChapter = false;
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.myQuestion.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.myQuestion.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      console.log("error ts: ", error);
      this.enableLoader = false;
    });
  }

  filterMyQuestion() {
    this.page = 1;
    this.subject = this.filterSubject;
    this.chapter = this.filterChapter;
    this.isFilterPanelOpen = false;
    this.myQuestionList = [];
    this.getMyQuestionList()
  }

  clearFilter() {
    this.page = 1;
    this.subject = '';
    this.chapter = '';
    this.filterSubject = '';
    this.filterChapter = '';
    this.myQuestionList = [];
    this.isFilterPanelOpen = false;
    this.getMyQuestionList()
  }

  async deleteQuestion(obj) {
    const alert = await this.alertController.create({
      header: this.messsageObj.myQuestion.alertMessage[this.defaultLanguage],
      message: this.messsageObj.myQuestion.deleteMessageText[this.defaultLanguage],
      cssClass: 'lang-' + this.defaultLanguage,
      buttons: [
        {
          text: this.messsageObj.myQuestion.cancelMessage[this.defaultLanguage],
          role: 'cancel',
          cssClass: 'alert-cancel ' + 'lang-' + this.defaultLanguage,
          handler: (blah) => {

          }
        }, {
          text: this.messsageObj.myQuestion.okMessage[this.defaultLanguage],
          cssClass: 'alert-ok ' + 'lang-' + this.defaultLanguage,
          handler: () => {
            this.enableLoader = true;
            let url = "questions/" + obj._id + "?lang=" + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
            this._commonService.delete(url).subscribe((response) => {
              console.log('response', response);
              this.enableLoader = false;
              if (response.status == 1) {
                this.showToast('success', this.messsageObj.myQuestion.deleteMessage[this.defaultLanguage], response.message, 3500, '/ask-question/my-questions')
                this.myQuestionList.forEach((element, indx) => {
                  if (element._id == obj._id) {
                    this.myQuestionList.splice(indx, 1)
                  }
                });
              } else if (response.status == 401) {
                this.showToast('error', this.messsageObj.myQuestion.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
              } else {
                this.showToast('error', this.messsageObj.myQuestion.errorMessage[this.defaultLanguage], response.message, 2500, '')
              }
            }, (error) => {
              this.enableLoader = false;
              console.log("error ts: ", error);
            });

          }
        }
      ]
    });
    await alert.present();
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      this.page += 1;
      if (this.paginationObj.nextPage != 0) {
        this.getMyQuestionList();
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

}
