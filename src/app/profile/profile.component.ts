import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { IonContent } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../service/common-service';
import { ToastService } from '../service/toast.service';
import { LoadingService } from '../service/loading-service';
import { ToastModalComponent } from '../toast-modal/toast-modal.component';
import { ModalController } from '@ionic/angular';
import { SharedService } from "../service/shared.service";
import { Network } from '@ionic-native/network/ngx';
import * as moment from 'moment';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  public profileDetails: any = {};
  public userId: any;
  public uploadedImg: any = {};
  public token: any;
  public classes: any = [];
  public profileClass: string;
  editableSelectOptions: any = [];
  editableSelect: number;
  public scrollTop: number = 0;
  enableLoader: boolean = false;
  @Output() messageEvent = new EventEmitter<string>();
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  constructor(
    public router: Router,
    route: ActivatedRoute,
    private httpClient: HttpClient,
    private sharedService: SharedService,
    public _toastService: ToastService,
    public modalController: ModalController,
    private _commonService: CommonService,
    public loading: LoadingService,
    private network: Network
  ) {
    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
      //this.planList = this.settings.plans
    });

    route.params.subscribe(val => {
      this.defaultLanguage = localStorage.getItem('language');
      this.token = localStorage.getItem('token');
      if (!this.token) {
        this.router.navigate([`/login`]);
      }
      this.getClass();
    });

  }

  ngOnInit() {

  }

  navigateNotification() {
    this.router.navigate(['/notification/' + this.userId]);
  }

  navigateInvite() {
    this.router.navigate(['/invite/' + this.userId]);
  }

  navigateEditprofile() {
    this.router.navigate(['/edit-profile']);
  }

  getUserProfile() {
    let url = "users/me?lang=" + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    //   this.loading.present();
    this._commonService.get(url).subscribe((response) => {
      console.log('response', response);
      this.enableLoader = false;
      if (response.status == 1) {
        this.userId = response.result._id;
        this.profileDetails = response.result;
        let endDate = parseInt(response.result.endDate);
        this.profileDetails.endDate = moment(endDate).format("Do MMM, YYYY")
        localStorage.setItem('name', this.profileDetails.name);
        localStorage.setItem('className', response.result.class.name);
        localStorage.setItem('mobile', response.result.mobile);
        localStorage.setItem('classId', response.result.class._id);
        this.updateAllProfileData();
        if (this.profileDetails.hasOwnProperty('class')) {
          if (this.profileDetails.class.hasOwnProperty('_id')) {
            console.log('CLASS', this.profileDetails.class._id)
            this.profileClass = this.profileDetails.class._id;
          }
        }
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.profile.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.profile.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      console.log("error ts: ", error);
    });
  }

  getClass() {
    this.enableLoader = true;
    let url = "common/class?lang=" + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this._commonService.noTokenGet(url).subscribe((response) => {
      console.log('response', response);
      // this.loading.dismiss();
      if (response.status == 1) {
        response.results.forEach(element => {
          if (element.isActive) {
            this.classes.push({ value: element._id, text: element.name })
          }
        });
        console.log('this.classes', this.classes);
        this.getUserProfile();
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.profile.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.profile.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      this.enableLoader = false;
      console.log("error ts: ", error);
    });
  }

  validateDocumentUpload(fileName) {
    var allowed_extensions = new Array("jpg", "png", "gif", "jpeg");
    var file_extension = fileName.split('.').pop().toLowerCase(); // split function will split the filename by dot(.), and pop function will pop the last element from the array which will give you the extension as well. If there will be no extension then it will return the filename.
    for (var i = 0; i <= allowed_extensions.length; i++) {
      if (allowed_extensions[i] == file_extension) {
        return true; // valid file extension
      }
    }
    return false;
  }

  // updateName() {
  //   let profileObj = {};
  //   if (this.profileDetails.name) {
  //     profileObj = { name: this.profileDetails.name };
  //   }
  //   //  this.updateProfile(profileObj);
  // }
  // updateClass() {
  //   let profileObj = {};
  //   if (this.profileClass) {
  //     profileObj = { class: this.profileClass };
  //   }
  //   // this.updateProfile(profileObj);
  // }

  // updateNumber() {
  //   let profileObj = {};
  //   if (this.profileDetails.mobile == '') {
  //     this.showToast('warning', 'Warning', 'Please enter mobile number.', 3000, '')
  //   }
  //   if (this.profileDetails.mobile) {
  //     profileObj = { mobile: this.profileDetails.mobile };
  //   }
  //   this.updateProfile(profileObj);
  // }

  // nameErrorHandle() {
  //   this.showToast('warning', 'Warning', 'Name can\'t be blank or less than 3 character.', 3000, '')
  // }

  // mobileErrorHandle() {
  //   this.showToast('warning', 'Warning', 'Mobile number can\'t be blank or invalid.', 3000, '')
  // }

  // updateProfile(data) {
  //   this.enableLoader = true;
  //   let url = "users/edit-profile?lang=" + localStorage.getItem('language');
  //   data.lang = localStorage.getItem('language');
  //   this._commonService.post(url, data).subscribe((response) => {
  //     this.enableLoader = false;
  //     if (response.status == 1) {
  //       this.showToast('success', 'Profile Updated', 'Profile Updated successfully.', 3500, '/profile')
  //       this.getUserProfile();
  //     } else if (response.status == 401) {
  //       this.showToast('error', 'Invalid', response.message, 3000, '/login')
  //     } else {
  //       this.showToast('error', 'Error', response.message, 2500, '')
  //     }
  //   }, (error) => {
  //     console.log("error ts: ", error);
  //   });
  // }

  uploadProfileImage(files: FileList, doc) {
    let url = "users/profile-image-upload?lang=" + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    this.uploadedImg = files.item(0);
    let validation = this.validateDocumentUpload(this.uploadedImg.name);
    if (validation) {
      var formData = new FormData();
      formData.append('file', this.uploadedImg);
      this._commonService.photoUpload(url, formData).subscribe((response) => {
        console.log('response', response);
        if (response.success) {
          this.profileDetails = response.response;
        }
      }, (error) => {
        console.log("error ts: ", error);
      });
    }
  }

  logScrolling(event) {
    console.log("logScrolling : When Scrolling", event.detail.scrollTop);
    if (event.detail.scrollTop > 35) {
      this.scrollTop = 1;
    } else {
      this.scrollTop = 0;
    }
  }

  updateAllProfileData() {
    let profileObj = {
      name: localStorage.getItem('name'),
      className: localStorage.getItem('className'),
      profileimage: this.profileDetails.profileimage,
    }
    this.sharedService.updateData(profileObj);
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
