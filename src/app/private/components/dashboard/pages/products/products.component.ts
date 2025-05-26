import { Component,AfterViewInit, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService, SelectItemGroup } from 'primeng/api';
import { Subscription } from 'rxjs';
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
  categoryVisible: boolean = false;
  ProductSettingVisible: boolean = false;
   formGroup!: FormGroup<any>;;
   isChecked: boolean = false;

   countries: any[] | undefined;

    selectedCountry: string | undefined;

    showCategoryDialog() {
        this.categoryVisible = true;
    }

    showProductSettingDialog() {
        this.ProductSettingVisible = true;
    }

     selectedCity: City | undefined;

  groupedCities!: SelectItemGroup[];
  cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' },
    ];
  

    selectedCities!: City[];

  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings:any = {};
  langSub!: Subscription;

  ngOnDestroy() {
    if (this.langSub) this.langSub.unsubscribe();
  }
  ngOnInit() {

    this.formGroup = new FormGroup({
            city: new FormControl<string | null>(null)
        });
    this.currentLang = this.languageService.getCurrentLang();

    // Subscribe to language changes
    this.langSub = this.languageService.lang$.subscribe(lang => {
      this.currentLang = lang;
      // Angular will update bindings automatically
    });
    this.countries = [
            { name: 'Australia', code: 'AU' },
            { name: 'Brazil', code: 'BR' },
            { name: 'China', code: 'CN' },
            { name: 'Egypt', code: 'EG' },
            { name: 'France', code: 'FR' },
            { name: 'Germany', code: 'DE' },
            { name: 'India', code: 'IN' },
            { name: 'Japan', code: 'JP' },
            { name: 'Spain', code: 'ES' },
            { name: 'United States', code: 'US' }
        ];
    this.cities = [
  {name: 'New York', code: 'NY'},
            {name: 'Rome', code: 'RM'},
            {name: 'London', code: 'LDN'},
            {name: 'Istanbul', code: 'IST'},
            {name: 'Paris', code: 'PRS'}
        ];
    
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  getIsCheck(){
    console.log(this.isChecked ? "Checked" : "Unchecked");
    // return !this.isChecked
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
