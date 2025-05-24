import { Component } from '@angular/core';
// import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-notificaion',
    templateUrl: './notificaion.component.html',
    styleUrls: ['./notificaion.component.css'],
    standalone: false
})
export class NotificaionComponent {
  isSuccess:boolean=true
  title:string=""
  message:string=""
  constructor(/*public bsModalRef:BsModalRef*/){

  }

}
