import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup,FormArray, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
interface Option {
    name: string,
    code: string
}
interface UploadEvent {
    originalEvent: Event;
    files: File[];
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

    /*category object*/
    isChecked: boolean = false;
    formGroup!: FormGroup<any>;
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
    /*end quantity And Options objects*/



    attributes: any[] = [];

showAttributeDialog = false;

    attributeTypes = [
        { label: 'نص', value: 'text' },
        { label: 'اللون', value: 'color' },
        { label: 'صورة', value: 'image' }
    ];
    variantStrings: string[] | undefined;

addAttribute() {
  this.attributes.push({
    name: '',
    type: 'text',
    values: []
  });
  
}

removeAttribute(index: number) {
  this.attributes.splice(index, 1);
}

addValue(attrIndex: number) {
  this.attributes[attrIndex].values.push({name:"",color:"#000000",image:[]});
  console.log(this.attributes);
  this.generateAttributeVariants()
}

removeValue(attrIndex: number, valIndex: number) {
  this.attributes[attrIndex].values.splice(valIndex, 1);
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

    onUpload(event:any,attrIndex: number, valIndex: number) {
        this.uploadedFiles=[]
        this.attributes[attrIndex].values[valIndex].image=[]
        for(let file of event.files) {
            this.uploadedFiles.push(file);
            this.attributes[attrIndex].values[valIndex].image.push(file);
        }

        this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    }
    removeImage(attrIndex: number, valIndex: number){
        this.attributes[attrIndex].values[valIndex].image=[];
        
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
  
    constructor(private messageService: MessageService,private config: PrimeNG,private fb: FormBuilder){
      this.visible=false
      this.productForm = this.fb.group({
      name: ['', Validators.required],
      options: this.fb.array([]),
    });
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
    }





display = false;
  productForm: FormGroup;



  get options(): FormArray {
    return this.productForm.get('options') as FormArray;
  }
  getOptionValues(index: number): FormArray {
  return this.options.at(index).get('values') as FormArray;
}

  showDialog() {
    this.display = true;
  }

  addOption() {
    const optionGroup = this.fb.group({
      name: ['', Validators.required],
      type: ['select'],
      values: this.fb.array([this.fb.control('', Validators.required)]),
    });

    this.options.push(optionGroup);
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  addValue1(optionIndex: number) {
    const values = this.options.at(optionIndex).get('values') as FormArray;
    values.push(this.fb.control('', Validators.required));
  }

  removeValue1(optionIndex: number, valueIndex: number) {
    const values = this.options.at(optionIndex).get('values') as FormArray;
    values.removeAt(valueIndex);
  }

  submitProduct() {
    console.log(this.productForm.value);
    // أرسل البيانات إلى الـ API عبر HttpClient
    this.display = false;
    this.productForm.reset();
    this.options.clear();
  }


  getAttributeNamesOnly(): string[][] {
    return this.attributes.map(attr => attr.values.map((v: { name: any; }) => v.name));
  }
  generateCombinations(valuesArrays: string[][]): string[][] {
   if (valuesArrays.length === 0) return [[]];

  const result: string[][] = [];

  const restCombinations = this.generateCombinations(valuesArrays.slice(1));

  for (const value of valuesArrays[0]) {
    for (const combination of restCombinations) {
      result.push([value, ...combination]);
    }
  }

  return result;
  }

  generateAttributeVariants() {
  const valuesOnly = this.getAttributeNamesOnly(); // [['red','yellow'], ['s','m'], ...]
  const combinations = this.generateCombinations(valuesOnly); // [['red','s'], ['red','m'], ...]

  // تحويل النتائج إلى string مع \
  this.variantStrings = combinations.map(comb => comb.join('\\'));

  // للعرض أو التخزين
  console.log(this.variantStrings);
}







//     @Input() label:string=""
//     @Input() items:MenuItem[]=[]
//     @Input() icon:string=""
// 
}
