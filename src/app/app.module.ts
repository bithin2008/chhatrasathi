import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoadingService } from './service/loading-service'
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { ToastModalComponent } from './toast-modal/toast-modal.component';
import { SharedService } from "./service/shared.service";
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { EndSubscriptionModalComponent } from './end-subscription-modal/end-subscription-modal.component';
import { ShowImageModalComponent } from './show-image-modal/show-image-modal.component';

@NgModule({
  declarations: [AppComponent, ToastModalComponent, TermsConditionComponent, EndSubscriptionModalComponent, ShowImageModalComponent],
  entryComponents: [ToastModalComponent, TermsConditionComponent, EndSubscriptionModalComponent, ShowImageModalComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    Clipboard,
    SocialSharing,
    SmsRetriever,
    DatePicker,
    LoadingService,
    SharedService,
    UniqueDeviceID,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
