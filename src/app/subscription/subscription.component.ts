import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from "../service/common-service";
import { ToastService } from "../service/toast.service";
import { MenuController } from "@ionic/angular";
import { LoadingService } from "../service/loading-service";
import { Network } from "@ionic-native/network/ngx";
import { ModalController } from "@ionic/angular";
import { ToastModalComponent } from "../toast-modal/toast-modal.component";
import { UniqueDeviceID } from "@ionic-native/unique-device-id/ngx";
import * as moment from 'moment';
declare var RazorpayCheckout: any;
@Component({
  selector: "app-subscription",
  templateUrl: "./subscription.component.html",
  styleUrls: ["./subscription.component.scss"],
})
export class SubscriptionComponent implements OnInit {
  public planList: any = [];
  public deviceId: any;
  enableLoader: boolean = false;
  token: any = '';
  settingsObj: any = {};
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  constructor(
    public router: Router,
    private httpClient: HttpClient,
    route: ActivatedRoute,
    public _toastService: ToastService,
    private _commonService: CommonService,
    public modalController: ModalController,
    private menu: MenuController,
    public loading: LoadingService,
    private network: Network,
    private uniqueDeviceID: UniqueDeviceID
  ) {

    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
    });

    route.params.subscribe(val => {

      this.defaultLanguage = localStorage.getItem('language');
      this.menu.enable(true);
      console.log('this.router.url', this.router.url);
      this.getSettings();
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
        this.getPlans();
      } else {
        console.log('navigate(login) from dashboard');
        this.router.navigate([`/login`]);
      }
    }, (error) => {
      console.log("error ts: ", error);
    });
  }

  userRegister(data: any) {
    console.log("data", data);
  }

  getPlans() {
    this.enableLoader = true;
    let url = "common/package?lang=" + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.get(url).subscribe(
      (response) => {
        console.log("response", response);
        this.enableLoader = false;
        if (response.status == 1) {
          this.planList = response.results;
          this.planList.forEach((element) => {
            if (element.offerPrice == 0) {
              element.offerPrice = element.price;
              element.dummyOfferPrice = 0;
            }
          });
        } else if (response.status == 401) {
          this.showToast('error', this.messsageObj.plan.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
        } else {
          this.showToast('error', this.messsageObj.plan.errorMessage[this.defaultLanguage], response.message, 2500, '')
        }
      },
      (error) => {
        console.log("error ts: ", error);
      }
    );
  }

  getSettings() {
    this.enableLoader = true;
    let url = "common/settings?id=razorpay";
    this._commonService.get(url).subscribe(
      (response) => {
        console.log("response", response);
        this.enableLoader = false;
        if (response.status == 1) {
          this.settingsObj = response.result;
        } else {
          this.showToast('error', this.messsageObj.plan.errorMessage[this.defaultLanguage], response.message, 2500, '')
        }
      },
      (error) => {
        console.log("error ts: ", error);
      }
    );
  }

  buyPlan(object) {
    this.enableLoader = true;
    let data = {
      packageId: object._id,
      amount: object.offerPrice * 100,
      lang: localStorage.getItem('language'),
      token: localStorage.getItem('token')
    };
    let url = "users/subscription";
    this._commonService.post(url, data).subscribe(
      (response) => {
        this.enableLoader = false;
        console.log("response", response);
        // this.loading.dismiss();
        if (response.status == 1) {

          var options = {
            description: `Subcrption for ${object.duration} months`,
            image: "https://chhatrasathi.in:6002/razorpay-chhatrasathi-icon.png",
            currency: "INR", // your 3 letter currency code
            key: this.settingsObj.key_id, // your Key Id from Razorpay dashboard  //rzp_test_a3mI6L2qtvBXSF   //rzp_live_j32lzE3Haz8pZd
            order_id: response.result.orderId,
            amount: response.result.amount, // Payment amount in smallest denomiation e.g. cents for USD
            name: "CHHATRASATHI",
            prefill: {
              email: localStorage.getItem("email") ? localStorage.getItem("email") : 'chhatrasathi2020@gmail.com',
              contact: localStorage.getItem("mobile"),
              name: localStorage.getItem("name"),
            },
            theme: {
              color: "#621647",
            },
            modal: {
              ondismiss: function () {
                //  alert("dismissed");
              },
            },
          };
          var _this = this;
          var successCallback = function (success) {
            console.log("payment_id: ", success);
            _this.successPayment(success);
          };
          var cancelCallback = function (error) {
            //////////////////////
            //PASS ORDERID & ERROR OBJECT TO BACKEND
            /////////////////////
            console.log("description: ", error);
          };
          RazorpayCheckout.on("payment.success", successCallback);
          RazorpayCheckout.on("payment.cancel", cancelCallback);
          RazorpayCheckout.open(options);
        } else if (response.status == 401) {
          this.showToast('error', this.messsageObj.plan.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
        } else {
          this.showToast('error', this.messsageObj.plan.errorMessage[this.defaultLanguage], response.message, 5000, '')
        }
      },
      (error) => {
        this.enableLoader = false;
        console.log("error ts: ", error);
      }
    );
  }

  successPayment(razorPay) {
    console.log("data", razorPay);
    razorPay.deviceId = this.deviceId;
    // this.loading.present();
    let url = "users/payment-success";
    razorPay.lang = localStorage.getItem('language');
    razorPay.token = localStorage.getItem('token');
    razorPay.startDate = moment().startOf('day');
    this._commonService.post(url, razorPay).subscribe(
      (response) => {
        console.log("response", response);
        this.enableLoader = false;
        if (response.success) {
          this.showToast(
            "success",
            this.messsageObj.plan.paymentSuccess[this.defaultLanguage],
            this.messsageObj.plan.enjoyLearning[this.defaultLanguage],
            3500,
            "/dashboard"
          );
        } else {
          this.showToast("error", this.messsageObj.plan.paymentFailed[this.defaultLanguage], response.message, 3500, "");
        }
      },
      (error) => {
        this.enableLoader = false;
        console.log("error ts: ", error);
      }
    );
  }

  async showToast(status, message, submessage, timer, redirect) {
    const modal = await this.modalController.create({
      component: ToastModalComponent,
      cssClass: "toast-modal",
      componentProps: {
        status: status,
        message: message,
        submessage: submessage,
        timer: timer,
        redirect: redirect,
      },
    });
    return await modal.present();
  }
}
