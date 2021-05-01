import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedService {

  private receivedData = new BehaviorSubject<Object>({});
  sharedData = this.receivedData.asObservable();


  private receivedLangData = new BehaviorSubject<Object>({});
  sharedLandData = this.receivedLangData.asObservable();

  constructor() { }

  updateData(data) {
    this.receivedData.next(data)
  }

  updateLanguage(data) {
    this.receivedLangData.next(data)
  }


}