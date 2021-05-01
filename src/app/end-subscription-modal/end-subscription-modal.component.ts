import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../service/common-service';
import { ToastService } from '../service/toast.service';
import { ModalController } from '@ionic/angular';
import { LoadingService } from '../service/loading-service';
import { ToastModalComponent } from '../toast-modal/toast-modal.component';
import * as moment from 'moment';
@Component({
  selector: 'app-end-subscription-modal',
  templateUrl: './end-subscription-modal.component.html',
  styleUrls: ['./end-subscription-modal.component.scss'],
})
export class EndSubscriptionModalComponent implements OnInit {
  daysToGo: number;
  expireDate: any;
  constructor(
    private httpClient: HttpClient,
    public _toastService: ToastService,
    private _commonService: CommonService,
    public modalController: ModalController,
    route: ActivatedRoute,
    public router: Router,
    public loading: LoadingService
  ) { }

  ngOnInit() {
    this.validateUser();
  }

  validateUser() {
    let url = "users/me?lang=" + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      if (response.success) {
        if (response.result.hasOwnProperty('endDate')) {
          if (response.result.endDate) {
            var a = moment(response.result.endDate, "x");
            this.expireDate = a.format("DD MMM, YYYY");
            var b = moment();
            var dayDifference = a.diff(b, 'days');
            if (dayDifference <= 3) {
              this.daysToGo = dayDifference;
            }
          }

        }

      } else {
        console.log('navigate(login) from dashboard');
        this.router.navigate([`/login`]);
      }
    }, (error) => {
      console.log("error ts: ", error);
    });
  }

  confirm() {
    this.modalController.dismiss(true);
  }

}
