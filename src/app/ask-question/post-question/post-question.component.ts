import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../service/loading-service';
import { MenuController } from '@ionic/angular';
import { CommonService } from '../../service/common-service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastModalComponent } from '../../toast-modal/toast-modal.component';
import { ToastService } from '../../service/toast.service';
import { ModalController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-post-question',
  templateUrl: './post-question.component.html',
  styleUrls: ['./post-question.component.scss'],
})
export class PostQuestionComponent implements OnInit {
  submitted = false;
  enableChapter: boolean = true;
  public classes: any = [];
  public subjectList: any = [];
  public chapterList: any = [];
  enableLoader: boolean = false;
  public token: any;
  questionObj: any = {};
  userClass: any = ''
  userSubject: any = '';
  questionId: any = '';
  submitQuestionForm: FormGroup;
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    route: ActivatedRoute,
    public _toastService: ToastService,
    private _commonService: CommonService,
    public modalController: ModalController,
    public loading: LoadingService,
    private network: Network,
    private menu: MenuController,
    private httpClient: HttpClient,
  ) {


    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
    });




    route.params.subscribe(val => {
      this.defaultLanguage = localStorage.getItem('language');
      this.questionId = route.snapshot.paramMap.get('questionId');
      this.submitQuestionForm = this.formBuilder.group({
        class: ['', Validators.required],
        subject: ['', Validators.required],
        chapter: ['', Validators.required],
        question: ['', [Validators.required]],
      });

      this.token = localStorage.getItem('token');
      if (!this.token) {
        this.router.navigate([`/login`]);
      } else {
        this.validateUser();
      }
    });
  }

  ngOnInit() {
  }

  validateUser() {
    let url = "users/me?lang=" + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      if (response.success) {
        if (this.questionId) {
          this.getQuestion(this.questionId);
        } else {
          this.getClass();
        }
      } else {
        console.log('navigate(login) from dashboard');
        this.router.navigate([`/login`]);
      }
    }, (error) => {
      console.log("error ts: ", error);
    });
  }

  getClass() {
    this.enableLoader = true;
    let url = "common/class?lang=" + localStorage.getItem('language');
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
          this.submitQuestionForm.patchValue({
            class: localStorage.getItem('classId')
          });
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
        if (this.questionId) {
          this.enableChapter = false;
          setTimeout(() => {
            this.submitQuestionForm.value.subject = this.questionObj.subject._id;
          }, 500);
          this.getChapterList()
        }
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.postQuestion.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.postQuestion.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      this.enableLoader = false;
      console.log("error ts: ", error);
    });
  }

  getChapterList() {
    console.log('event', event)
    this.enableLoader = true;
    if (!this.questionId) {
      if (this.submitQuestionForm.value.subject) {
        this.enableChapter = false;
      } else {
        this.showToast('warning', this.messsageObj.postQuestion.warningMessage[this.defaultLanguage], this.messsageObj.postQuestion.selectSubject[this.defaultLanguage], 3000, '/ask-question/post-question');
        return false;
      }
    }
    let url = "common/chapter?class=" + localStorage.getItem('classId') + '&subject=' + this.submitQuestionForm.value.subject + '&page=' + 1 + '&pageSize=' + 100 + '&lang=' + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.status == 1) {
        this.chapterList = response.results;
        setTimeout(() => {
          if (this.questionId) {
            this.submitQuestionForm.patchValue({
              class: localStorage.getItem('classId'),
              subject: this.questionObj.subject,
              chapter: this.questionObj.chapter,
              question: this.questionObj.question
            });
          }
        }, 500);
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.postQuestion.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.postQuestion.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      console.log("error ts: ", error);
      this.enableLoader = false;
    });
  }

  getQuestion(questionId) {
    let url = "questions/" + questionId + "?lang=" + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.status == 1) {
        this.questionObj = response.result;
        this.getClass();
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.postQuestion.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.postQuestion.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      this.enableLoader = false;
      console.log("error ts: ", error);
    });
  }

  get f() { return this.submitQuestionForm.controls; }

  submitQuestion(data: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.submitQuestionForm.invalid) {
      return;
    }
    this.enableLoader = true;
    // data.deviceToken=this.deviceId;
    if (this.questionId) {
      let url = "questions/" + this.questionId;
      data.lang = localStorage.getItem('language');
      data.token = localStorage.getItem('token');
      this._commonService.put(url, data).subscribe((response) => {
        console.log('response', response);
        this.enableLoader = false;
        if (response.success) {
          if (response.status == 1) {
            this.submitQuestionForm.reset('');
            this.submitted = false;
            this.showToast('success', this.messsageObj.postQuestion.updatedMessage[this.defaultLanguage], response.message, 3500, '/ask-question/my-questions')
          } else {
            this.showToast('error', this.messsageObj.postQuestion.invalidMessage[this.defaultLanguage], response.message, 2500, '/ask-question/post-question')
          }
        } else {
        }
      }, (error) => {
        console.log("error ts: ", error);
      });
    } else {
      let url = "questions";
      data.lang = localStorage.getItem('language');
      data.token = localStorage.getItem('token');
      this._commonService.post(url, data).subscribe((response) => {
        console.log('response', response);
        this.enableLoader = false;
        if (response.success) {
          if (response.status == 1) {
            this.submitQuestionForm.reset('');
            this.submitted = false;
            this.showToast('success', this.messsageObj.postQuestion.submittedMessage[this.defaultLanguage], response.message, 3500, '/ask-question/my-questions')
          } else {
            this.showToast('error', this.messsageObj.postQuestion.invalidMessage[this.defaultLanguage], response.message, 2500, '/ask-question/post-question')
          }
        } else {
        }
      }, (error) => {
        console.log("error ts: ", error);
      });
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
