import {Component, Input, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { SplitButton } from 'primeng/splitbutton';
import { TieredMenu } from 'primeng/tieredmenu';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.css'],
    providers: [MessageService],
    standalone: false
})
export class ButtonComponent{
    @Input() kind:string=""
    @Input() label:string=""
    @Input() items:MenuItem[]=[]
    @Input() icon:string=""
    click(event: SplitButton, eventClick: MouseEvent): void {
      setTimeout(() => {
      event.onDropdownButtonClick(eventClick)
      }, 0);
      }
    
    constructor(){
      console.log(this.items);
      
    }

}
