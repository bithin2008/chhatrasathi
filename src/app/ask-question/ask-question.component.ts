import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../service/loading-service';
import { CommonService } from '../service/common-service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.scss'],
})
export class AskQuestionComponent implements OnInit {
  public classes: any = [];
  public subjectList: any = [];
  enableLoader: boolean = false;
  userClass: any = ''
  userSubject: any = '';
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  constructor(
    public loading: LoadingService,
    private _commonService: CommonService,
    route: ActivatedRoute,
    private httpClient: HttpClient,
  ) {

    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
    });

    route.params.subscribe(val => {
      this.defaultLanguage = localStorage.getItem('language');
    })
  }

  ngOnInit() {

  }



}
