import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm:FormGroup=new FormGroup({});
  submitted:boolean=false;
  errorMessages:string[]=[];
  /*upload impages */
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  messageUpload: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;
  /*upload impages */


  constructor(private productsService:ProductsService,
    private router:Router,
    private formBuilder: FormBuilder,
    private sharedService:SharedService,
    private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.initializeForm()
    this.imageInfos = this.productsService.getFiles();
  }

  onSubmit() {
   if(this.productForm.valid){
      this.createProduct(this.productForm.value)
   }
  }

  // onImageUploaded(file: any) {
  //   //this.product.image = file; // Store the image file
  //   console.log(file);
  // }
  maxImages = 6;  // Max number of images
  images: { src: string | null, file: File | null,cover:boolean }[] = Array.from({ length: this.maxImages }, () => ({ src: null, file: null,cover:false }));
  coverImageIndex: number | null = null;  // Tracks the index of the cover image


  // This method will handle the image upload and assign it to the first available slot
  onImageUploaded(file: File) {
    const emptyIndex = this.images.findIndex(img => img.file === null);

    if (emptyIndex !== -1) {
      const reader = new FileReader();
      reader.onload = () => {
        this.images[emptyIndex] = { src: reader.result as string, file,cover:false };

        // Manually trigger change detection to update the view
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }
  
  setCover(index: number) {
    this.coverImageIndex = index;
    for (let i = index; i < this.images.length - 1; i++) {
      this.images[i].cover = false; // Move the next image to the current slot
    }
    this.images[index].cover=true

  }

  deleteCover(index: number) {
    this.coverImageIndex = null;
    for (let i = index; i < this.images.length - 1; i++) {
      this.images[i].cover = false; // Move the next image to the current slot
    }

  }
  // This method handles image removal and shifts the images after removal
  onImageRemoved(index: number) {
    this.images[index] = { src: null, file: null,cover:false };

    // Shift the remaining images to the left to fill the gap
    for (let i = index; i < this.images.length - 1; i++) {
      this.images[i] = { ...this.images[i + 1] }; // Move the next image to the current slot
    }

    // Clear the last image slot after shifting
    this.images[this.images.length - 1] = { src: null, file: null,cover:false };

    // If the cover image is removed, reset it
    if (this.coverImageIndex === index) {
      this.coverImageIndex = null;
    }

    // Manually trigger change detection to ensure the UI updates
    this.cdr.detectChanges();
  }



  

  createProduct(registerData:any){
    // this.submitted=true;
    this.errorMessages=[]

    this.productsService.createProdct(registerData).subscribe({
      next:(res:any)=>{
        this.sharedService.showNotification(true,res.value.title,res.value.message);
        //this.router.navigateByUrl('/login')
      },
      error:error=>{
        if(error.error.errors){
          this.errorMessages=error.error.errors
        }
        else{
          this.errorMessages.push(error.error)
        }
        
      }
    })
  }


  initializeForm():void{
    this.productForm=this.formBuilder.group({
      title:new FormControl('',[Validators.required,Validators.minLength(15),Validators.maxLength(160)]),
      description:new FormControl('',[Validators.required,Validators.minLength(15)]),
      price:new FormControl('',[Validators.required]),
      pictureUrl:new FormControl('',[Validators.required]),
      quantity:new FormControl('',[Validators.required]),
      productTypeId:new FormControl(6,[Validators.required]),
      productBrandId:new FormControl(4,[Validators.required]),

      // email:new FormControl('',[Validators.required,Validators.pattern('^([0-9a-zA-Z]+[-._+&amp;])*[0-9a-zA-Z]+@([-0-9a-zA-Z]+[.])+[a-zA-Z]{2,6}$')]),
      // firstname:new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(15)]),
      // lastname:new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(15)]),
      // merchant:new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(60)]),
      // phone:new FormControl('',[Validators.required,Validators.pattern(/^\+?\d{10,15}$/)]),
      // password:new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(15)]),
      // passwordConfirm:new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(15)])
    })
  }


  uploadFiles(): void {
    this.messageUpload = [];

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    if (file) {
      this.productsService.upload(file).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.messageUpload.push(msg);
            this.imageInfos = this.productsService.getFiles();
          }
        },
        (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.messageUpload.push(msg);
        }
      );
    }
  }

  selectFiles(event: any): void {
    this.messageUpload = [];
    this.progressInfos = [];
    if(this.selectedFiles){
      let filesArray= Array.from(this.selectedFiles).concat(Array.from(event.target.files))
      this.selectedFiles = filesArray as any
    }
    else{
      this.selectedFiles = event.target.files
    }
    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }
}
