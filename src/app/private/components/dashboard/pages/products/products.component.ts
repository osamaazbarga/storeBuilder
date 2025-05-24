import { Component,AfterViewInit, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService, SelectItemGroup } from 'primeng/api';
import { LanguageService } from 'src/app/services/language.service';


interface City {
    name: string,
    code: string
}

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css'],
    providers: [MessageService],
    standalone: false
})
export class ProductsComponent implements OnInit{
  items: MenuItem[]=[];
  fakeArray = new Array(12);
  currentLang?:string

  groupedCities!: SelectItemGroup[];
  cities!: City[];

    selectedCities!: City[];

  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings:any = {};
  ngOnInit() {

    this.cities = [
  {name: 'New York', code: 'NY'},
            {name: 'Rome', code: 'RM'},
            {name: 'London', code: 'LDN'},
            {name: 'Istanbul', code: 'IST'},
            {name: 'Paris', code: 'PRS'}
        ];
    this.dropdownList = [
      { item_id: 1, item_text: 'اسامه' },
      { item_id: 2, item_text: 'يبيبس' },
      { item_id: 3, item_text: 'بسسبس' },
      { item_id: 4, item_text: 'بسبس' },
      { item_id: 5, item_text: 'لسلسل' }
    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'ضضض' },
      { item_id: 4, item_text: 'صصصص' }
    ];
    this.dropdownSettings = {
    
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  private choicesInstance: any;

 
  

  constructor(private messageService: MessageService,private router:Router,public languageService: LanguageService) {
    
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
