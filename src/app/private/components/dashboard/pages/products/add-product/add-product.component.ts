import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { SharedService } from 'src/app/shared/shared.service';

export interface ProductTypeConfig {
  type: string;
  title: string;
  description: string;
  fields: string[];
  hasShipping: boolean;
  hasDigitalDelivery: boolean;
  hasVariants: boolean;
  hasBookings: boolean;
}

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.css'],
    standalone: false
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  errorMessages: string[] = [];
  productType: string = '';
  productTypeConfig: ProductTypeConfig | null = null;
  
  /*upload impages */
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  messageUpload: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;
  /*upload impages */

  productTypeConfigs: ProductTypeConfig[] = [
    {
      type: 'ready-product',
      title: 'PRODUCTS.READY_PRODUCT',
      description: 'PRODUCTS.READY_PRODUCT_DESC',
      fields: ['title', 'description', 'price', 'quantity', 'category', 'shipping', 'weight', 'images'],
      hasShipping: true,
      hasDigitalDelivery: false,
      hasVariants: true,
      hasBookings: false
    },
    {
      type: 'custom-service',
      title: 'PRODUCTS.CUSTOM_SERVICE',
      description: 'PRODUCTS.CUSTOM_SERVICE_DESC',
      fields: ['title', 'description', 'price', 'serviceType', 'deliveryTime', 'requirements', 'images'],
      hasShipping: false,
      hasDigitalDelivery: true,
      hasVariants: false,
      hasBookings: false
    },
    {
      type: 'food-product',
      title: 'PRODUCTS.FOOD_PRODUCT',
      description: 'PRODUCTS.FOOD_PRODUCT_DESC',
      fields: ['title', 'description', 'price', 'quantity', 'category', 'expiryDate', 'ingredients', 'allergens', 'images'],
      hasShipping: true,
      hasDigitalDelivery: false,
      hasVariants: true,
      hasBookings: false
    },
    {
      type: 'digital-product',
      title: 'PRODUCTS.DIGITAL_PRODUCT',
      description: 'PRODUCTS.DIGITAL_PRODUCT_DESC',
      fields: ['title', 'description', 'price', 'fileUpload', 'downloadLimit', 'expiryDate', 'images'],
      hasShipping: false,
      hasDigitalDelivery: true,
      hasVariants: false,
      hasBookings: false
    },
    {
      type: 'digital-card',
      title: 'PRODUCTS.DIGITAL_CARD',
      description: 'PRODUCTS.DIGITAL_CARD_DESC',
      fields: ['title', 'description', 'price', 'cardType', 'cardValue', 'expiryDate', 'images'],
      hasShipping: false,
      hasDigitalDelivery: true,
      hasVariants: false,
      hasBookings: false
    },
    {
      type: 'product-bundle',
      title: 'PRODUCTS.PRODUCT_BUNDLE',
      description: 'PRODUCTS.PRODUCT_BUNDLE_DESC',
      fields: ['title', 'description', 'price', 'bundleItems', 'discount', 'images'],
      hasShipping: true,
      hasDigitalDelivery: false,
      hasVariants: false,
      hasBookings: false
    },
    {
      type: 'bookings',
      title: 'PRODUCTS.BOOKINGS',
      description: 'PRODUCTS.BOOKINGS_DESC',
      fields: ['title', 'description', 'price', 'duration', 'availability', 'location', 'images'],
      hasShipping: false,
      hasDigitalDelivery: false,
      hasVariants: false,
      hasBookings: true
    }
  ];

  constructor(private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.productType = params['type'] || 'ready-product';
      this.productTypeConfig = this.productTypeConfigs.find(config => config.type === this.productType) || this.productTypeConfigs[0];
      this.initializeForm();
    });
  }

  initializeForm() {
    const baseFields: any = {
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      images: [[]]
    };

    // Add type-specific fields
    if (this.productTypeConfig?.hasShipping) {
      baseFields['quantity'] = ['', [Validators.required, Validators.min(1)]];
      baseFields['weight'] = ['', [Validators.required, Validators.min(0)]];
      baseFields['category'] = ['', Validators.required];
    }

    if (this.productTypeConfig?.hasDigitalDelivery) {
      baseFields['deliveryMethod'] = ['digital', Validators.required];
    }

    if (this.productTypeConfig?.hasBookings) {
      baseFields['duration'] = ['', Validators.required];
      baseFields['availability'] = ['', Validators.required];
      baseFields['location'] = ['', Validators.required];
    }

    // Add specific fields based on product type
    switch (this.productType) {
      case 'custom-service':
        baseFields['serviceType'] = ['', Validators.required];
        baseFields['deliveryTime'] = ['', Validators.required];
        baseFields['requirements'] = ['', Validators.required];
        break;
      case 'food-product':
        baseFields['expiryDate'] = ['', Validators.required];
        baseFields['ingredients'] = ['', Validators.required];
        baseFields['allergens'] = [''];
        break;
      case 'digital-product':
        baseFields['fileUpload'] = ['', Validators.required];
        baseFields['downloadLimit'] = ['', Validators.required];
        baseFields['expiryDate'] = ['', Validators.required];
        break;
      case 'digital-card':
        baseFields['cardType'] = ['', Validators.required];
        baseFields['cardValue'] = ['', Validators.required];
        baseFields['expiryDate'] = ['', Validators.required];
        break;
      case 'product-bundle':
        baseFields['bundleItems'] = ['', Validators.required];
        baseFields['discount'] = ['', [Validators.min(0), Validators.max(100)]];
        break;
    }

    this.productForm = this.formBuilder.group(baseFields);
  }

  onSubmit() {
    this.submitted = true;
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      formData.productType = this.productType;
      
      // Handle form submission based on product type
      this.productsService.createProdct(formData).subscribe({
        next: (response: any) => {
          // Show success message
          console.log('Product created successfully');
          this.router.navigate(['/dashboard/products']);
        },
        error: (error: any) => {
          this.errorMessages = error.error?.errors || ['An error occurred while creating the product'];
        }
      });
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
    this.selectedFiles = event.target.files;
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

  removeImage(index: number): void {
    this.previews.splice(index, 1);
    if (this.selectedFiles) {
      const dt = new DataTransfer();
      const files = this.selectedFiles;
      for (let i = 0; i < files.length; i++) {
        if (i !== index) {
          dt.items.add(files[i]);
        }
      }
      this.selectedFiles = dt.files;
    }
  }
}


