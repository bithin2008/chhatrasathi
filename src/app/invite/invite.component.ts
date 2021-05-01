import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
})
export class InviteComponent implements OnInit {

  constructor(private clipboard: Clipboard,
   ) { }

  ngOnInit() { }

  copyReferral() {
    this.clipboard.copy('CSBIT4058');
  }

  whatsappShare() {
    // this.socialSharing.shareViaWhatsApp("CSBIT4058", "../assets/images/razorpay-icon.png", "https://www.chhatrasathi.in/")
    //   .then(() => {
    //     console.log("WhatsApp share successful");
    //   }).catch((err) => {
    //     console.log("An error occurred ", err);
    //   });
  }


  messangerShare() {
    // this.socialSharing.shareViaFacebook("CSBIT4058", "../assets/images/razorpay-icon.png", "https://www.chhatrasathi.in/")
    //   .then(() => {
    //     console.log("shareViaFacebook share successful");
    //   }).catch((err) => {
    //     console.log("An error occurred ", err);
    //   });
  }
}
