import { Component } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;
}

interface Column {
    field: string;
    header: string;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
  standalone: false
})
export class CategoriesComponent {

  // products!: Product[];

    cols!: Column[];

    constructor() {}

    // لتتبع الصفوف الموسعة
  // expandedRows: { [key: number]: boolean } = {};



  // expandedRow: any = null;

  // toggleRow(table: any, row: any) {
  //   if (this.expandedRow === row) {
  //     table.toggleRow(row); // إغلاق
  //     this.expandedRow = null;
  //   } else {
  //     table.toggleRow(row); // فتح
  //     this.expandedRow = row;
  //   }
  // }

  onReorder(event: any) {
    console.log('تم إعادة ترتيب التصنيفات:', this.categories);
    console.log(event);
    
  }



  drop(event: any) {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
    console.log('ترتيب جديد:', this.categories);
    // هنا يمكن حفظ الترتيب إلى قاعدة البيانات
  }
 selectedCategory: any = null;
  toggleRow1(cat: any) {
    this.selectedCategory = this.selectedCategory?.id === cat.id ? null : cat;
  }

    ngOnInit() {
        // this.productService.getProductsMini().then((data) => (this.products = data));

        this.cols = [
            { field: 'code', header: 'Code' },
            
        ];
    }
categories = [
    {
      id: 1,
      name: 'ملابس',
      subCategories: [
        { id: 11, name: 'قمصان' },
        { id: 12, name: 'بنطلونات' }
      ]
    },
    {
      id: 2,
      name: 'إلكترونيات',
      subCategories: [
        { id: 21, name: 'هواتف' },
        { id: 22, name: 'كمبيوترات' }
      ]
    },
    {
      id: 3,
      name: 'أحذية',
      subCategories: [
        { id: 31, name: 'رياضية' },
        { id: 32, name: 'رسمية' }
      ]
    }
  ];

  // ✅ بيانات مرتبطة بالتصنيفات الفرعية
  products = [
    {
      categoryId: 1,
      subCategoryId: 11,
      value: 'قميص رجالي'
    },
    {
      categoryId: 1,
      subCategoryId: 12,
      value: 'بنطال جينز'
    },
    {
      categoryId: 2,
      subCategoryId: 21,
      value: 'iPhone 15'
    },
    {
      categoryId: 2,
      subCategoryId: 22,
      value: 'MacBook Pro'
    }
  ];
}
