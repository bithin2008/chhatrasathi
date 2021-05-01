import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-noification',
  templateUrl: './noification.component.html',
  styleUrls: ['./noification.component.scss'],
})
export class NoificationComponent implements OnInit {
  public faqList:any=[];
  constructor() {
    this.faqList=[
      {
        id:'faq01',
        question:'What are the benefits of this app?',
        answer:'For every subscription using your referral code, you earn 20% of the suscription amount up to 10,000',
        isExpand:false
      },
      {
        id:'faq02',
        question:'What are the benefits of this app?',
        answer:'For every subscription using your referral code, you earn 20% of the suscription amount up to 10,000',
        isExpand:false
      },
      {
        id:'faq03',
        question:'What are the benefits of this app?',
        answer:'For every subscription using your referral code, you earn 20% of the suscription amount up to 10,000',
        isExpand:false
      },
      {
        id:'faq04',
        question:'What are the benefits of this app?',
        answer:'For every subscription using your referral code, you earn 20% of the suscription amount up to 10,000',
        isExpand:false
      }
    ]
   }

  ngOnInit() {}

}
