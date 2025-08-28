import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-validation-messages',
    templateUrl: './validation-messages.component.html',
    styleUrls: ['./validation-messages.component.css'],
    standalone: false
})
export class ValidationMessagesComponent {
  @Input() errorMessages:string[] | undefined=[]

}
