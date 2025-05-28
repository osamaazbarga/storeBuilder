import { Component,AfterViewInit, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService, SelectItemGroup } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';
import { getEditorDefaults, PinturaEditorOptions } from '@pqina/pintura';
import { DomSanitizer } from '@angular/platform-browser';
import { PinturaEditorComponent } from '@pqina/angular-pintura';
import { PrimeNG } from 'primeng/config';




interface City {
    name: string,
    code: string
}

interface Option {
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
  UploadImagesVisible: boolean = false;
  formGroup!: FormGroup<any>;
  isChecked: boolean = false;
  selectedNeedShip:string | undefined;
  selectKindWeight:string | undefined;
  src: string = 'assets/images/image.jpeg';
  @ViewChild('editorRef') editorRef?: PinturaEditorComponent<any> = undefined;
  options: any = {
        // Pass the editor default configuration options
        ...getEditorDefaults(),

        // This will set a square crop aspect ratio
        imageCropAspectRatio: 1
    }


  editorOptions = getEditorDefaults() as PinturaEditorOptions;

  result?: string = undefined;
  cropAspectRatio = 1;
  locale?: any = { ...getEditorDefaults().locale };

  handleLoad($event: any) {
    console.log('load', $event);

    console.log('component ref', this.editorRef);

    console.log('editor instance ref', this.editorRef?.editor);

    console.log(
      'inline editor image state',
      this.editorRef?.editor?.imageState
    );
  }

  handleProcess($event: any) {
    console.log('process', $event);

    const objectURL = URL.createObjectURL($event.dest);
    this.result = this.sanitizer.bypassSecurityTrustResourceUrl(
      objectURL
    ) as string;
    console.log( this.result)
  }

  handleChangeLocale($event: any) {
    // load german locale
    import('@pqina/pintura/locale/nl_NL/index.js').then(
      // ({ default: locale }) => {
      //   this.locale = locale;
      // }
    );
  }

   countries: any[] | undefined;

    selectedCountry: string | undefined;

    showCategoryDialog() {
        this.categoryVisible = true;
    }

    showProductSettingDialog() {
        this.ProductSettingVisible = true;
    }
    showUpladImages(){
        this.UploadImagesVisible = true;
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
  needShipOption!:Option[];
  kindWeightOption!:Option[];
  

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
            {name: 'نعم, يتطلب شحن', code: '1'},
            {name: 'لا يتطلب شحن', code: '0'}
        ];
    this.needShipOption = [
          {name: 'نعم, يتطلب شحن', code: '1'},
          {name: 'لا يتطلب شحن', code: '0'}
    ];

    this.kindWeightOption = [
          {name: 'كجم', code: '0'},
          {name: 'قرام', code: '1'},
          {name: 'رطل', code: '2'},
          {name: 'أوقيه', code: '3'}
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

 
  

  constructor(private messageService: MessageService,private router:Router,public languageService: LanguageService,private sanitizer: DomSanitizer,private config: PrimeNG) {
    
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




  files = [];

    totalSize : number = 0;

    totalSizePercent : number = 0;



    choose(event:Event, callback:any) {
        callback();
    }

    onRemoveTemplatingFile(event:any, file:any, removeFileCallback:any, index:any) {
        removeFileCallback(event, index);
        this.totalSize -= parseInt(this.formatSize(file.size));
        this.totalSizePercent = this.totalSize / 10;
    }

    onClearTemplatingUpload(clear:any) {
        clear();
        this.totalSize = 0;
        this.totalSizePercent = 0;
    }

    onTemplatedUpload() {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    }

    onSelectedFiles(event:any) {
        this.files = event.currentFiles;
        this.files.forEach((file:any) => {
            this.totalSize += parseInt(this.formatSize(file.size));
        });
        this.totalSizePercent = this.totalSize / 10;
    }

    uploadEvent(callback:any) {
        callback();
    }

    formatSize(bytes:any) {
        const k = 1024;
        const dm = 3;
        const sizes:any = this.config.translation.fileSizeTypes;
        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

        return `${formattedSize} ${sizes[i]}`;
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



