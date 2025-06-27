import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup,FormArray, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { CreateProductOptionsDto, CreateProductVariantsDto, ProductsService } from 'src/app/services/products.service';
interface Option {
    name: string,
    code: string
}
interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

interface VariantOption {
  optionId: number;
  valueId: number;
}

interface ProductVariant {
  sku: string;
  variant:string;
  barcode: string;
  price: number;
  costPrice: number;
  discountPrice: number;
  quantity: number;
  weight: number;
  lowStockAlert: number;
  options: VariantOption[];
}
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
  standalone:false
})

export class DialogComponent {
    @Input() dialog:string="";
    @Output() visableData = new EventEmitter<any>();
    @Input() visible:boolean=false
    @Input() productId!: number;

    /*category object*/
    isChecked: boolean = false;
    formGroup!: FormGroup<any>;
    variantForm!: FormGroup;
    optionForm!: FormGroup;
    selectedCountry: string | undefined;
    countries: any[] | undefined;
    /*end category objects*/

    /*product settings objects*/
    needShipOption!:Option[];
    kindWeightOption!:Option[];
    selectedNeedShip:string | undefined;
    selectKindWeight:string | undefined;
    /*end product settings objects*/



    /*upload images objects*/
    files = [];

    totalSize : number = 0;

    totalSizePercent : number = 0;
    /*end upload images objects*/

    /*quantity And Options objects*/
    checkedEnableOptions: boolean = false;
    attrColor: string = '#6466f1';
    uploadedFiles: any[] = [];
    optionsValues:any[] = [];
    VariantsValues:any[] = [];
    /*end quantity And Options objects*/


    attributeTypes = [
        { label: 'نص', value: 'text' },
        { label: 'اللون', value: 'color' },
        { label: 'صورة', value: 'image' }
    ];



    constructor(private messageService: MessageService,
        private config: PrimeNG,
        private fb: FormBuilder,
        private productsService: ProductsService){
        this.visible=false
        this.productForm = this.fb.group({
        name: ['', Validators.required],
          options: this.fb.array([]),
        
        });
        this.variantForm = this.fb.group({
          variants: this.fb.array([]),
        });
        this.optionForm = this.fb.group({
          options: this.fb.array([]),
        });
        

    }

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

    /*end upload images objects*/


    visable(data: any) {
      this.visible=false
      this.visableData.emit(this.visible);
    }
  


    ngOnInit() {

    this.formGroup = new FormGroup({
            city: new FormControl(false)
        });
        this.formGroup.get('city')?.valueChanges.subscribe((value: boolean) => {
    console.log('Checkbox changed:', value);
    // You can assign it to a variable like:
    this.isChecked = value;
  });
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

    console.log("Calling getOptionsByProductId with ID:", this.productId);
    this.productsService.getOptionsByProductId(this.productId).subscribe({
      next: (optionsData:any) => {
          optionsData.forEach((option: any) => {
            this.options.push(this.createOptionGroup(option));       
      });
    console.log(this.options);
        this.productsService.getVariantsByProductId(this.productId).subscribe({
          next: (res:any) => {
            res.forEach((option: any) => {
              this.variants.push(this.createVariantGroup(option));
            });
          },
            error: (err) => console.error("Request error:", err)
        });
      },
      error: (err) => console.error("Request error:", err)
    });
    }





display = false;
  productForm: FormGroup;



  get options(): FormArray {
    return this.optionForm.get('options') as FormArray;
  }



//   getOptionValues(index: number): FormArray {
//   return this.options.at(index).get('values') as FormArray;
// }

get variants(): FormArray {
    return this.variantForm.get('variants') as FormArray;
  }

  showDialog() {
    this.display = true;
  }





  getOptionValuesNamesOnly(): string[][] {
    const optionsArray = this.optionForm.get('options') as FormArray;

  return optionsArray.controls.map(optionGroup => {
    const valuesArray = (optionGroup.get('optionValues') as FormArray);
    return valuesArray.controls.map(valueGroup => {
      return valueGroup.get('name')?.value || '';
    });
  });

  }
  generateCombinations1(valuesArrays: string[][]): string[][] {
   if (valuesArrays.length === 0) return [[]];

  const result: string[][] = [];

  const restCombinations = this.generateCombinations1(valuesArrays.slice(1));

  for (const value of valuesArrays[0]) {
    if (value!=null){
        for (const combination of restCombinations) {
            if(combination[0]!='')
                result.push([value, ...combination]);
        }
    }
  }

  return result;
  }

  

  
  convertOptionsToAttributes(): any[] {
    return this.options.controls.map((optionGroup, i) => {
      const valuesArray = optionGroup.get('optionValues') as FormArray;
      return {
        id: i,
        name: optionGroup.get('name')?.value,
        values: valuesArray.controls.map((valGroup, j) => ({
          productOptionValueId: ((i+1)*10)+j,
          name: valGroup.get('name')?.value,
          color: valGroup.get('color')?.value,
          imageUrl: valGroup.get('imageUrl')?.value,
          optionId: i
        }))
      };
    });
  }

  generateVariants() {
    const attributes = this.convertOptionsToAttributes();
    const combinations = this.generateCombinations(attributes.map(a => a.values));

    this.variants.clear();
    for (const combo of combinations) {
      this.variants.push(this.fb.group({
        sku: [combo.map(v => v.name).join('-')],
        variant: [combo.map(v => v.name).join('/')],
        barcode: [''],
        price: [0],
        costPrice: [0],
        discountPrice: [0],
        quantity: [0],
        weight: [0],
        lowStockAlert: [0],
        options: this.fb.array(
          combo.map(val => this.fb.group({
            productOptionId: [val.optionId],
            productOptionValueId: [val.productOptionValueId]
          }))
        )
      }));
    }
  }

//   generateAttributeVariants() {
//     const valuesOnly = this.getOptionsValueNamesOnly(); // [['red','yellow'], ['s','m'], ...]
//     const combinations = this.generateCombinations(valuesOnly); // [['red','s'], ['red','m'], ...]
//     this.variantStrings = combinations.map(comb => comb.join('/'));

//     const variantFormArray = this.fb.array([]) as FormArray;
//     for (const variant of this.variantStrings) {
//       variantFormArray.push(
//         this.fb.group({
//           variant: [variant],
//           price: [null],
//           costPrice: [null],
//           discountPrice: [null],
//           weight: [null],
//           barcode: [''],
//           sku: [''],
//           lowStock: [null]
//         })
//       );
//     }

//     this.variantForm.setControl('variants', variantFormArray);
//     console.log(this.variantForm);

//   }


  generateCombinations(arrays: any[][], depth = 0, current: any[] = []): any[][] {
    if (depth === arrays.length) return [current];
    const result: any[][] = [];
    for (const value of arrays[depth]) {
        if(value.name!="")
            result.push(...this.generateCombinations(arrays, depth + 1, [...current, value]));
    }
    return result;
  }
 


  addOption() {
    const options = this.optionForm.get('options') as FormArray;
    options.push(this.fb.group({
      optionId: [options.length/*, Validators.required*/],
      productId: [this.productId/*, Validators.required*/],
      name: [""/*, Validators.required*/],
      type: ["text"/*, Validators.required*/],
      optionValues: this.fb.array([])
    }));
  }

  getOptionType(optionIndex: number){
    const optionsArray = this.optionForm.get('options') as FormArray;
    const optionGroup = optionsArray.at(optionIndex) as FormGroup;
    return optionGroup.get('type')?.value || '';
  }



  addOptionValue(optionIndex: number) {

    let OptionValues=this.getOptionValues(optionIndex)
    OptionValues.push(this.fb.group({
      productOptionValueId:[((optionIndex+1)*10)+OptionValues.length],
      name: [''],
      color: ['#000000'],
      imageUrl: [[]]
    }));
  }

  onUpload(event:any,attrIndex: number, valIndex: number) {
    const optionValues = this.getOptionValues(attrIndex);
    const valueGroup = optionValues.at(valIndex) as FormGroup;
        this.uploadedFiles=[];
        this.uploadedFiles = [...event.files];
        valueGroup.patchValue({ image: this.uploadedFiles });     
        this.messageService.add({
            severity: 'info',
            summary: 'تم رفع الملف',
            detail: `${this.uploadedFiles.length} ملف/ملفات تم رفعها بنجاح`
        });
    }

  getOptionValues(optionIndex: number): FormArray {
    return this.options.at(optionIndex).get('optionValues') as FormArray;
  }

  removeImage(attrIndex: number, valIndex: number){
     const valueGroup = this.getOptionValues(attrIndex).at(valIndex) as FormGroup;
    valueGroup.patchValue({ image: [] });

    this.messageService.add({
        severity: 'warn',
        summary: 'تم الحذف',
        detail: 'تم حذف الصورة بنجاح'
    });
    }

  removeOptionValue(optionIndex: number, valueIndex: number) {
    this.getOptionValues(optionIndex).removeAt(valueIndex);
  }

    removeOption(index: number) {
    this.options.removeAt(index);
  }

  createOptionGroup(option: any): FormGroup {
    return this.fb.group({
      id: [option.id || ''],
      name: [option.name || ''],
      opionId: [option.opionId || ''],
      productId: [option.productId || ''],
      type: [option.type || 'text'],
      optionValues: this.fb.array(option.optionValues?.map((value: any) => this.createValueGroup(value)) || [])
    });
  }

  createVariantGroup(variant: any): FormGroup {
    return this.fb.group({
      id: [variant.id || ''],
      barcode: [variant.barcode || ''],
      costPrice: [variant.costPrice || ''],
      discountPrice: [variant.discountPrice || ''],
      lowStockAlert: [variant.lowStockAlert || ''],
      price: [variant.price || ''],
      productId: [variant.productId || ''],
      quantity: [variant.quantity || ''],
      sku: [variant.sku || ''],
      variant: [variant.variant || ''],
      weight: [variant.weight || ''],
      variantOptions: this.fb.array(variant.variantOptions?.map((value: any) => this.createVariantValueGroup(value)) || [])

      
    });
  }

  createVariantValueGroup(value: any): FormGroup {
    return this.fb.group({
      id: [value.id || null],
      productOptionId: [value.productOptionId || null],
      productOptionValueId: [value.productOptionValueId || null],
      productVariantId: [value.productVariantId || null]
    });
  }

  createValueGroup(value: any): FormGroup {
    return this.fb.group({
      name: [value.name || ''],
      color: [value.color || ''],
      image: [value.image || null]
    });
  }
    

  submit() {
    // const payload = this.optionForm.value;
    // call service to send data to backend
    // console.log(payload);
    let options=this.optionForm.value.options
    let variants=this.variantForm.value.variants

    const payload: CreateProductOptionsDto = {
            productId: this.productId,
            options:options,
            variants:variants
        };

        
        this.productsService.addProductOptions(payload).subscribe({
            next: (res:any) => {
                console.log(res);
                
                
            this.messageService.add({
                severity: 'success',
                summary: 'تم الحفظ',
                detail: 'تم حفظ التوليفات بنجاح'
            });
            this.visible = false;
            this.visableData.emit(this.visible);
            },
            error: (err) => {
            console.error(err);
            this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: 'فشل في حفظ التوليفات'
            });
            }
        });

//     const payload: CreateProductVariantsDto = {
//         productId: this.productId,
//         variants: this.variantForm.value.variants
//     };

//   console.log(payload);

  
//   this.productsService.addProductVariant(payload).subscribe({
//     next: () => {
//       this.messageService.add({
//         severity: 'success',
//         summary: 'تم الحفظ',
//         detail: 'تم حفظ التوليفات بنجاح'
//       });
//       this.visible = false;
//       this.visableData.emit(this.visible);
//     },
//     error: (err) => {
//       console.error(err);
//       this.messageService.add({
//         severity: 'error',
//         summary: 'خطأ',
//         detail: 'فشل في حفظ التوليفات'
//       });
//     }
//   });

    // this.visible=false
    //   this.visableData.emit(this.visible);
  }





}
