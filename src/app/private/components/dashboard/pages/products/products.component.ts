import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [MessageService]
})
export class ProductsComponent {
  items: MenuItem[]=[];
  constructor(private messageService: MessageService,private router:Router) {
    this.items = [
        {
          label: 'منتج جاهز',
          command: () => {
              //this.update();
              this.router.navigateByUrl('/dashboard/products/addproduct')
          },
        },
        {
          label: 'خدمه حسب الطلب',
          command: () => {
              this.delete();
          }
        },
        {
          label: 'اكل',
          command: () => {
              this.delete();
          }
        },
        {
          label: 'منتج رقمي',
          command: () => {
              this.delete();
          }
        },
        {
          label: 'بطاقه رقميه',
          command: () => {
              this.delete();
          }
        },
        {
          label: 'مجموعة منتجات',
          command: () => {
              this.delete();
          }
        },
        
        // { label: 'Angular Website', url: 'http://angular.io' },
        // { separator: true },
        // { label: 'Upload', routerLink: ['/fileupload'] }
    ];
  }

  save(severity: string) {
      this.messageService.add({ severity: severity, summary: 'Success', detail: 'Data Saved' });
  }

  update() {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Updated' });
  }

  delete() {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Deleted' });
  }
}
