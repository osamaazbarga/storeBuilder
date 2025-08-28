import { Component,AfterViewInit, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService, SelectItemGroup } from 'primeng/api';
import { filter, Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';
import { getEditorDefaults, PinturaEditorOptions } from '@pqina/pintura';
import { DomSanitizer } from '@angular/platform-browser';
import { PinturaEditorComponent } from '@pqina/angular-pintura';
import { PrimeNG } from 'primeng/config';
import { ProductsService } from 'src/app/services/products.service';
import { StoreService } from 'src/app/services/store.service';




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
  productsData:any;
  storeData:any=null;
  currentLang?:string
  selectedNeedShip:string | undefined;
  selectKindWeight:string | undefined;
  visible: boolean = false;

  dialog!: 'productSetting' | 'uploadImages' | 'category' | 'quantityAndOptions';
  productId!:number;
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

  constructor(private messageService: MessageService,
    private productsService:ProductsService,
    private router:Router,
    public languageService: LanguageService,
    private sanitizer: DomSanitizer,
    private config: PrimeNG,
    private storeService:StoreService) {
      this.storeService.storeData$.subscribe(data => {
      this.storeData = data;
      // You can now use this.store in your template
    });
        //this.getProductDataByStore();
     
    
    this.items = [
        {
          label: 'منتج جاهز',
          command: () => {
              this.addCardProduct();
              //this.router.navigateByUrl('/dashboard/products/addproduct')
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

  ngOnInit() {
    console.log("data");
     this.storeService.storeData$
    .pipe(filter(data => !!data)) // ignore null/undefined
    .subscribe(data => {
      this.storeData = data;
      
      
      this.getProductDataByStore();
    });
    

    this.currentLang = this.languageService.getCurrentLang();

    

    // Subscribe to language changes
    this.langSub = this.languageService.lang$.subscribe(lang => {
      this.currentLang = lang;
      // Angular will update bindings automatically
    });

    this.cities = [
            {name: 'نعم, يتطلب شحن', code: '1'},
            {name: 'لا يتطلب شحن', code: '0'}
        ];

    
    
  }

  getProductDataByStore(){
    this.productsService.getProductsByStoreId(this.storeData.id).subscribe({
        next: (res) => {
          this.productsData=res;
        },
        error: (err) => {
          console.error("Failed to load products", err);
        }
});
    
  }

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


    

    showDialog(dialog: 'productSetting' | 'uploadImages' | 'category' | 'quantityAndOptions',productId?:number) {
        this.dialog = dialog;
        if(productId){
          this.productId=productId;
        }
        this.visible = true;
    }
    getVisable():boolean{
      return this.visible
    }

  handleDataFromChild(data: any) { 
    this.visible =data;
  }

     selectedCity: City | undefined;

  cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' },
    ];
  

    selectedCities!: City[];


  langSub!: Subscription;

  ngOnDestroy() {
    if (this.langSub) this.langSub.unsubscribe();
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
  submit(product:any){
    console.log(this.productsData)
    this.productsService.updateProduct(product).subscribe({
          next:(res:any)=>{
            console.log(res);
            this.getProductDataByStore()
            if(res==true){
              
            } 
            else{
              //this.errorMessages.push("no Stores yet");
            }     
            // this.sharedService.showNotification(true,res.value.title,res.value.message);
            // this.router.navigateByUrl('/login')
          },
          error:error=>{
            if(error.error.errors){
              //this.errorMessages=error.error.errors
              
            }
            else{
              //this.errorMessages.push(error.error)
            }
            
          }
    })
    
  }
  addCardProduct(){
    
    this.productsService.createEmptyProdct(this.storeData.id).subscribe({
          next:(res:any)=>{
            console.log(res);
            this.getProductDataByStore()
            if(res==true){
              
            } 
            else{
              //this.errorMessages.push("no Stores yet");
            }     
            // this.sharedService.showNotification(true,res.value.title,res.value.message);
            // this.router.navigateByUrl('/login')
          },
          error:error=>{
            if(error.error.errors){
              //this.errorMessages=error.error.errors
              
            }
            else{
              //this.errorMessages.push(error.error)
            }
            
          }
    })
    
  }

}



