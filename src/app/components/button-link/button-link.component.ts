import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-button-link',
    templateUrl: './button-link.component.html',
    styleUrls: ['./button-link.component.css'],
    standalone: false
})
export class ButtonLinkComponent {
  @Input() kind:string=""
  @Input() label:string=""
  @Input() icon:string=""
  @Input() devClass:string=""
  @Input() linkClass:string=""
  @Input() routerLink:string=""
  @Input() width:string=""
  @Input() height:string=""

}
