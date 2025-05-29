import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
interface Option {
    name: string,
    code: string
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
  
    constructor(private messageService: MessageService,private config: PrimeNG){
      this.visible=false
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


//     @Input() label:string=""
//     @Input() items:MenuItem[]=[]
//     @Input() icon:string=""
// 
}
