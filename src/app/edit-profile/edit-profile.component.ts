import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../service/common-service';
import { ToastService } from '../service/toast.service';
import { MenuController } from '@ionic/angular';
import { LoadingService } from '../service/loading-service';
import { SharedService } from "../service/shared.service";
import { Network } from '@ionic-native/network/ngx';
import { ModalController } from '@ionic/angular';
import { ToastModalComponent } from '../toast-modal/toast-modal.component';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { environment } from "../../environments/environment";
import { MustMatch } from '../_helper/must-match.validator';
import * as moment from 'moment';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild('uploadProfile', { static: false }) uploadProfile: ElementRef;
  updateProfileForm: FormGroup;
  changePassword: FormGroup;
  public submitted = false;
  public passwordSubmitted = false;
  public profileDetails: any = {};
  public userId: any;
  public uploadedImg: any = {};
  public token: any;
  public classes: any = [];
  public profileClass: string;
  public editableSelectOptions: any = [];
  public editableSelect: number;
  public scrollTop: number = 0;
  public enableLoader: boolean = false;
  public hasSubscription: boolean = false;
  showCurrentPass: boolean = false;
  showNewPass: boolean = false;
  public districtArray: any = [
    { name: "Alipurduar", id: 1 },
    { name: "Bankura", id: 2 },
    { name: "Birbhum", id: 3 },
    { name: "Cooch Behar", id: 4 },
    { name: "Dakshin Dinajpur", id: 5 },
    { name: "Darjeeling", id: 6 },
    { name: "Hooghly", id: 7 },
    { name: "Howrah", id: 8 },
    { name: "Jalpaiguri", id: 9 },
    { name: "Jhargram", id: 10 },
    { name: "Kalimpong", id: 11 },
    { name: "Kolkata", id: 12 },
    { name: "Malda", id: 13 },
    { name: "Murshidabad", id: 14 },
    { name: "Nadia", id: 15 },
    { name: "North 24 Parganas", id: 16 },
    { name: "Paschim Medinipur", id: 17 },
    { name: "Paschim Burdwan", id: 18 },
    { name: "Purba Burdwan", id: 19 },
    { name: "Purba Medinipur", id: 20 },
    { name: "Purulia", id: 21 },
    { name: "South 24 Parganas", id: 22 },
    { name: "Uttar Dinajpur", id: 23 }
  ]

  public districtBengaliArray: any = [
    { name: "আলিপুরদুয়ার", id: 1 },
    { name: "বাঁকুড়া", id: 2 },
    { name: "বীরভূম", id: 3 },
    { name: "কোচবিহার", id: 4 },
    { name: "দক্ষিণ দিনাজপুর", id: 5 },
    { name: "দার্জিলিং", id: 6 },
    { name: "হুগলি", id: 7 },
    { name: "হাওড়া", id: 8 },
    { name: "জলপাইগুড়ি", id: 9 },
    { name: "ঝাড়গ্রাম", id: 10 },
    { name: "কালিম্পং", id: 11 },
    { name: "কলকাতা", id: 12 },
    { name: "মালদহ", id: 13 },
    { name: "মুর্শিদাবাদ", id: 14 },
    { name: "নদিয়া", id: 15 },
    { name: "উত্তর চব্বিশ পরগনা", id: 16 },
    { name: "পশ্চিম মেদিনীপুর", id: 17 },
    { name: "পশ্চিম বর্ধমান", id: 18 },
    { name: "পূর্ব বর্ধমান", id: 19 },
    { name: "পূর্ব মেদিনীপুর", id: 20 },
    { name: "পুরুলিয়া", id: 21 },
    { name: "দক্ষিণ চব্বিশ পরগনা", id: 22 },
    { name: "উত্তর দিনাজপুর", id: 23 }
  ]
  @Output() messageEvent = new EventEmitter<string>();
  messsageObj: any = {};
  defaultLanguage: any = 'beng';
  constructor(
    public router: Router,
    route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private datePicker: DatePicker,
    public _toastService: ToastService,
    private _commonService: CommonService,
    private sharedService: SharedService,
    public _activatedRoute: ActivatedRoute,
    private menu: MenuController,
    public loading: LoadingService,
    public modalController: ModalController,
    private network: Network) {

    this.httpClient.get("assets/lang/message.json").subscribe((data: any) => {
      this.messsageObj = data;
      //this.planList = this.settings.plans
    });



    this.updateProfileForm = this.formBuilder.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]],
      mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      dob: ['', Validators.required],
      district: ['', Validators.required],
    });

    this.changePassword = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', Validators.required]
    });

    route.params.subscribe(val => {
      this.defaultLanguage = localStorage.getItem('language');
      this.token = localStorage.getItem('token');
      if (!this.token) {
        this.router.navigate([`/login`]);
      }
      this.getUserProfile();
    });
  }

  ngOnInit() {

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
        this.hasSubscription = this.profileDetails.hasSubscription;
        localStorage.setItem('name', this.profileDetails.name);
        localStorage.setItem('className', response.result.class.name);
        localStorage.setItem('mobile', response.result.mobile);
        this.updateProfileForm.patchValue({
          name: this.profileDetails.name,
          gender: this.profileDetails.gender,
          email: this.profileDetails.email,
          mobile: this.profileDetails.mobile,
          dob: this.profileDetails.dob,
          district: this.profileDetails.district
        });

      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.editProfile.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.editProfile.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      console.log("error ts: ", error);
    });
  }

  get f() { return this.updateProfileForm.controls; }

  get p() { return this.changePassword.controls; }

  openDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: 5
    }).then((date: any) => {
      console.log('Got date: ', date);
      let tStamp = Math.floor(date / 1000);
      let mDate = moment.unix(tStamp).format('L');
      this.updateProfileForm.controls['dob'].setValue(mDate);
    }, (error) => {
      console.log("error ts: ", error);
    });
  }

  updateAllProfileData() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.updateProfileForm.invalid) {
      return;
    }
    let profileObj = {
      name: this.updateProfileForm.value.name,
      email: this.updateProfileForm.value.email,
      gender: this.updateProfileForm.value.gender,
      mobile: this.updateProfileForm.value.mobile,
      dob: this.updateProfileForm.value.dob,
      district: this.updateProfileForm.value.district,
      lang: localStorage.getItem('language'),
      token: localStorage.getItem('token')
    }
    let url = "users/edit-profile";

    this.enableLoader = true;
    this._commonService.post(url, profileObj).subscribe((response) => {
      this.enableLoader = false;
      if (response.status == 1) {
        this.showToast('success', this.messsageObj.editProfile.profileUpdateMsg[this.defaultLanguage], this.messsageObj.editProfile.profileUpdateSuccMsg[this.defaultLanguage], 3500, '/edit-profile')
        this.sharedService.updateData(profileObj);
        this.getUserProfile();
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.editProfile.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.editProfile.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      console.log("error ts: ", error);
    });
  }

  updatePassword() {
    this.passwordSubmitted = true;
    // stop here if form is invalid
    if (this.changePassword.invalid) {
      return;
    }
    let passwordObj = {
      currentPassword: this.changePassword.value.password,
      newPassword: this.changePassword.value.newPassword,
      lang: localStorage.getItem('language'),
      token: localStorage.getItem('token')
    }
    let url = "users/change-password";

    this.enableLoader = true;
    this._commonService.post(url, passwordObj).subscribe((response) => {
      this.enableLoader = false;
      if (response.status == 1) {
        this.showToast('success', this.messsageObj.editProfile.passwordUpdateMsg[this.defaultLanguage], response.message, 3500, '/edit-profile');
        this.changePassword.reset('');
        this.passwordSubmitted = false;
      } else if (response.status == 401) {
        this.showToast('error', this.messsageObj.editProfile.invalidMessage[this.defaultLanguage], response.message, 3000, '/login')
      } else {
        this.showToast('error', this.messsageObj.editProfile.errorMessage[this.defaultLanguage], response.message, 2500, '')
      }
    }, (error) => {
      console.log("error ts: ", error);
    });
  }

  logScrolling(event) {
    if (event.detail.scrollTop > 25) {
      this.scrollTop = 1;
    } else {
      this.scrollTop = 0;
    }
  }

  uploadProfilePhoto(files: FileList) {
    let URL = 'users/profile-image-upload?lang=' + localStorage.getItem('language') + "&token=" + localStorage.getItem('token');
    var profileImg = files.item(0);

    if (profileImg.size > 2097152) {
      this.showToast('warning', this.messsageObj.editProfile.errorMessage[this.defaultLanguage], this.messsageObj.editProfile.picUploadWarning[this.defaultLanguage], 3000, '/edit-profile');
      return false;
    }
    let validation = this.validateDocumentUpload(profileImg.name);
    if (validation) {
      var formData = new FormData();
      formData.append("image", profileImg);
      formData.append("token", localStorage.getItem('token'));
      this._commonService.photoUpload(URL, formData).subscribe((response) => {
        console.log('response', response);
        this.enableLoader = false;
        if (response.success) {
          this.profileDetails.profileimage = response.image;
          this.uploadProfile.nativeElement.value = "";
          this.showToast('success', this.messsageObj.editProfile.picUploaed[this.defaultLanguage], this.messsageObj.editProfile.uploaedSuccess[this.defaultLanguage], 2500, '/edit-profile')
        } else {
          this.showToast('warning', this.messsageObj.editProfile.errorMessage[this.defaultLanguage], response.message, 2500, '/edit-profile')
        }
      }, (error) => {
        console.log("error ts: ", error);
      });

    } else {
      // this.toastr.error("Please upload only JPG, PNG, GIF format", "Error");
    }
  }

  validateDocumentUpload(fileName) {
    var allowed_extensions = new Array("jpg", "jpeg", "png", "gif");
    var file_extension = fileName.split(".").pop().toLowerCase(); // split function will split the filename by dot(.), and pop function will pop the last element from the array which will give you the extension as well. If there will be no extension then it will return the filename.
    for (var i = 0; i <= allowed_extensions.length; i++) {
      if (allowed_extensions[i] == file_extension) {
        return true; // valid file extension
      }
    }
    return false;
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
