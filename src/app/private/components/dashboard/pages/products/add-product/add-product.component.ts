import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { SharedService } from 'src/app/shared/shared.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// Import standalone components
import { BasicInformationComponent } from './components/basic-information/basic-information.component';
import { AdvancedInformationComponent } from './components/advanced-information/advanced-information.component';
import { QuantityManagementComponent } from './components/quantity-management/quantity-management.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { FilesComponent } from './components/files/files.component';
import { ProductBundleComponent } from './components/product-bundle/product-bundle.component';
import { BookingScheduleComponent } from './components/booking-schedule/booking-schedule.component';
import { OptionsComponent } from './components/options/options.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { CustomFieldsComponent } from './components/custom-fields/custom-fields.component';

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
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    BasicInformationComponent,
    AdvancedInformationComponent,
    QuantityManagementComponent,
    NotificationsComponent,
    FilesComponent,
    ProductBundleComponent,
    BookingScheduleComponent,
    OptionsComponent,
    OrderFormComponent,
    CustomFieldsComponent
  ]
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  submitted = false;
  errorMessages: string[] = [];
  productType: string = '';
  productTypeConfig: ProductTypeConfig | null = null;
  selectedFiles: File[] = [];
  previews: string[] = [];
  
  /*upload impages */
  progressInfos: any[] = [];
  messageUpload: string[] = [];

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
      fields: ['title', 'description', 'price', 'cardType', 'cardValue', 'expiryDate', 'fileUpload', 'downloadLimit', 'images'],
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
      costPrice: [''],
      brand: [''],
      category: [''],
      localCategory: [''],
      promotionalTitle: [''],
      arabicTitle: [''],
      discountPercentage: [''],
      discountAmount: [''],
      discountedPrice: [''],
      discountStartDate: [''],
      discountEndDate: [''],
      quantity: [''],
      maxQuantityPerCustomer: [''],
      sku: [''],
      gtin: [''],
      mpn: [''],
      pageTitle: [''],
      customLink: [''],
      pageDescription: [''],
      unlimitedQuantity: [false],
      branch: ['main'],
      mainQuantity: [0],
      alertQuantity: [''],
      notifyPercentage: [''],
      customerPercentage: [''],
      images: [[]],
      // Display channels and requirements
      storeWebsite: [true],
      storeApp: [false],
      wholesaleMarket: [false],
      showInBranch: [''],
      attachFile: [false],
      writeNotes: [false],
      taxable: [false],
      tags: [''],
      // Shipping
      shippingRequired: ['false'],
      weightType: ['g'],
      weight: [''],
      // Digital delivery fields
      deliveryMethod: ['digital'],
      fileUpload: [''],
      downloadLimit: [''],
      // Booking fields
      duration: [''],
      availability: [''],
      location: [''],
      bookingDuration: [''],
      // Product type specific fields
      serviceType: [''],
      deliveryTime: [''],
      requirements: [''],
      expiryDate: [''],
      ingredients: [''],
      allergens: [''],
      cardType: [''],
      cardValue: [''],
      bundleItems: [''],
      discount: [''],
      // Food product calories
      calories: ['']
    };

    // Apply validations based on product type
    switch (this.productType) {
      case 'ready-product':
        baseFields.quantity = ['', [Validators.required, Validators.min(1)]];
        baseFields.category = ['', Validators.required];
        break;
      case 'custom-service':
        baseFields.serviceType = ['', Validators.required];
        baseFields.deliveryTime = ['', Validators.required];
        baseFields.requirements = ['', Validators.required];
        baseFields.quantity = ['', [Validators.required, Validators.min(1)]];
        baseFields.category = ['', Validators.required];
        break;
      case 'food-product':
        baseFields.expiryDate = ['', Validators.required];
        baseFields.ingredients = ['', Validators.required];
        baseFields.quantity = ['', [Validators.required, Validators.min(1)]];
        baseFields.category = ['', Validators.required];
        break;
      case 'digital-product':
        baseFields.deliveryMethod = ['digital', Validators.required];
        baseFields.fileUpload = ['', Validators.required];
        baseFields.downloadLimit = ['', Validators.required];
        baseFields.expiryDate = ['', Validators.required];
        break;
      case 'digital-card':
        baseFields.cardType = ['', Validators.required];
        baseFields.cardValue = ['', Validators.required];
        baseFields.expiryDate = ['', Validators.required];
        baseFields.deliveryMethod = ['digital', Validators.required];
        baseFields.fileUpload = ['', Validators.required];
        baseFields.downloadLimit = ['', Validators.required];
        break;
      case 'product-bundle':
        baseFields.bundleItems = ['', Validators.required];
        baseFields.discount = ['', [Validators.min(0), Validators.max(100)]];
        break;
      case 'bookings':
        baseFields.duration = ['', Validators.required];
        baseFields.availability = ['', Validators.required];
        baseFields.location = ['', Validators.required];
        baseFields.bookingDuration = ['', Validators.required];
        break;
    }

    this.productForm = this.formBuilder.group(baseFields);
  }

  selectFiles(files: FileList) {
    if (files) {
      this.selectedFiles = Array.from(files);
      this.previews = [];
      
      for (let file of this.selectedFiles) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.previews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
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
}


