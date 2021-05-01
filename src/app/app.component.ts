import { Component, OnInit, DoCheck } from '@angular/core';
import { Platform, DomController } from '@ionic/angular';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { CommonService } from './service/common-service';
import { ToastService } from './service/toast.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AlertController } from '@ionic/angular';
import { SharedService } from "./service/shared.service";
import { ModalController } from '@ionic/angular';
import { ToastModalComponent } from './toast-modal/toast-modal.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Network } from "@ionic-native/network/ngx";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  enableLoader: boolean = false;
  public rootPage: any;
  public selectedIndex = 0;
  public appPages = [

  ];

  public userName;
  public className;
  public disconnectSubscription: any;
  public profileImage: string;
  public token: any;
  public backPressCount: number = 0;
  public selectedLanguage: string;
  public isEnableMenu: boolean = true;
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  language: any;
  settingsObj: any = {};
  constructor(
    private platform: Platform,
    private httpClient: HttpClient,
    private network: Network,
    route: ActivatedRoute,
    private socialSharing: SocialSharing,
    private sharedService: SharedService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private alertController: AlertController,
    public _toastService: ToastService,
    private _commonService: CommonService,
    public modalController: ModalController,
    private domCtrl: DomController
  ) {

    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
    });

    this.network.onDisconnect().subscribe(() => {
      this.showToast('error', this.messsageObj.appComponent.noInternetMessage[this.defaultLanguage], this.messsageObj.appComponent.noInternetMessageText[this.defaultLanguage], 3500, '');
      return false;
    });
    this.initializeApp();

    route.params.subscribe(val => {
      this.defaultLanguage = localStorage.getItem('language') ? localStorage.getItem('language') : 'en';
      this.sharedService.sharedData.subscribe((data: any) => {
        if (Object.keys(data).length != 0) {
          this.userName = data.name;
          this.className = data.className;
          this.profileImage = data.profileimage;
          if (data.lang) {
            this.defaultLanguage = data.lang;
          }

        } else {
          if (localStorage.getItem('language')) {
            if (localStorage.getItem('token')) {
              this.validateUser()
            } else {
              this.router.navigate([`/login`]);
            }
          } else {
            this.router.navigate([`/intro`]);
          }

        }

      })

      if (!this.userName) {
        this.userName = localStorage.getItem('name');
      }
      if (!this.className) {
        this.className = localStorage.getItem('className');
      }
      this.backPressCount = 0;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('platform.ready()');
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#621647');
      this.backPressCount = 0;
      setTimeout(() => {
        this.splashScreen.hide();
      }, 1200);
      setTimeout(() => {
        console.log('Before this.backPressCount', this.backPressCount);
        if (this.backPressCount == 0) {
          this.platform.backButton.subscribe(async () => {
            console.log('platform.backButton');
            if (this.router.url === '/dashboard' || this.router.url === '/' || this.router.url === '/login') {
              console.log('isActive(dashboard)');
              console.log('After this.backPressCount', this.backPressCount);
              this.backPressCount = this.backPressCount + 1;

              const alert = await this.alertController.create({
                message: this.messsageObj.appComponent.closeApp[this.defaultLanguage],
                cssClass: 'close-app lang-' + this.defaultLanguage,
                buttons: [
                  {
                    text: this.messsageObj.appComponent.noMessage[this.defaultLanguage],
                    role: 'cancel',
                    cssClass: 'alert-cancel ' + 'lang-' + this.defaultLanguage,
                    handler: () => {
                      this.backPressCount = 0;
                    }
                  }, {
                    text: this.messsageObj.appComponent.yesMessage[this.defaultLanguage],
                    cssClass: 'alert-ok ' + 'lang-' + this.defaultLanguage,
                    handler: () => {
                      navigator['app'].exitApp();
                    }
                  }
                ]
              });
              await alert.present();
            }

          });
        }
      }, 10);

    });
  }


  ngOnInit() {
    this.defaultLanguage = localStorage.getItem('language') ? localStorage.getItem('language') : 'en';
    this.sharedService.sharedLandData.subscribe((data: any) => {
      console.log('initializeApp', data);
      if (data.code) {
        this.isEnableMenu = false;
        this.defaultLanguage = data.code;
        this.isEnableMenu = true;
      }
    })
    this.getSettings();
  }

  validateUser() {
    let url = "users/me?lang=" + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      if (response.success) {
        this.profileImage = response.result.profileimage;
        this.userName = response.result.name;
        this.className = response.result.class.name;
      } else {
        console.log('navigate(login) from dashboard');
        this.router.navigate([`/login`]);
      }
    }, (error) => {
      console.log("error ts: ", error);
    });
  }

  getSettings() {
    this.enableLoader = true;
    let url = "common/settings?id=share_text";
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

  socialShare() {
    var options = {
      message: this.settingsObj.message, // not supported on some apps (Facebook, Instagram)
      url: this.settingsObj.link,
    };
    this.socialSharing.shareWithOptions(options);
  }

  async logout(event) {
    event.preventDefault()
    const alert = await this.alertController.create({
      header: this.messsageObj.appComponent.alertMessage[this.defaultLanguage],
      message: this.messsageObj.appComponent.logoutMessageText[this.defaultLanguage],
      cssClass: 'lang-' + this.defaultLanguage,
      buttons: [
        {
          text: this.messsageObj.appComponent.noMessage[this.defaultLanguage],
          role: 'cancel',
          cssClass: 'alert-cancel ' + 'lang-' + this.defaultLanguage,
          handler: (blah) => {

          }
        }, {
          text: this.messsageObj.appComponent.okMessage[this.defaultLanguage],
          cssClass: 'alert-ok ' + 'lang-' + this.defaultLanguage,
          handler: () => {
            this.logOut()
          }
        }
      ]
    });
    await alert.present();
  }

  logOut() {
    this.enableLoader = true;
    let url = "users/logout";
    this._commonService.post(url, { lang: localStorage.getItem('language'), token: localStorage.getItem('token') }).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.status == 1) {
        localStorage.setItem('token', '');
        this.showToast('success', this.messsageObj.appComponent.logoutSuccess[this.defaultLanguage], response.message, 2500, '/login');
      } else {
        localStorage.setItem('token', '');
        this.showToast('success', this.messsageObj.appComponent.logoutSuccess[this.defaultLanguage], response.message, 2500, '/login');
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
