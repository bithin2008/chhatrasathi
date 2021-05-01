import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-show-image-modal',
  templateUrl: './show-image-modal.component.html',
  styleUrls: ['./show-image-modal.component.scss'],
})
export class ShowImageModalComponent implements OnInit {

  @Input() imagePath: string;
  constructor(public modalController: ModalController,) { }

  ngOnInit() {
    console.log('imagePath', this.imagePath)
  }

  dismissModal() {
    this.modalController.dismiss(true);
  }

}
