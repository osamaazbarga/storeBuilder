# نظام حفظ بيانات المتجر (Store Data Persistence)

## المشكلة
كانت بيانات المتجر تُحفظ في BehaviorSubject في الذاكرة فقط، مما يعني أنها تُفقد عند عمل refresh للصفحة.

## الحل
تم تطبيق نظام حفظ البيانات في localStorage مع الاسترجاع التلقائي.

## الميزات الجديدة

### 1. حفظ تلقائي للبيانات
- عند استدعاء `setStoreData(data)` يتم حفظ البيانات في localStorage تلقائياً
- البيانات تُحفظ في localStorage تحت مفتاح `store_data`

### 2. استرجاع تلقائي عند بدء التطبيق
- عند بدء `StoreService` يتم استرجاع البيانات المحفوظة تلقائياً
- إذا لم توجد بيانات محفوظة، يتم تحميلها من الخادم

### 3. Methods جديدة في StoreService

#### `saveStoreDataToStorage(data: any)`
- حفظ البيانات في localStorage
- يتم استدعاؤها تلقائياً من `setStoreData`

#### `loadStoreDataFromStorage()`
- استرجاع البيانات من localStorage
- يتم استدعاؤها تلقائياً عند بدء الخدمة

#### `clearStoreData()`
- مسح البيانات من localStorage و BehaviorSubject
- يتم استدعاؤها عند تسجيل الخروج

#### `hasStoredStoreData(): boolean`
- التحقق من وجود بيانات محفوظة

#### `getStoredStoreData(): any`
- استرجاع البيانات المحفوظة مباشرة

#### `initializeStoreData(): Observable<any>`
- تهيئة البيانات من localStorage أو الخادم
- مفيدة للاستخدام في Components

## كيفية الاستخدام

### في Components
```typescript
// في ngOnInit
ngOnInit() {
  // التحقق من وجود بيانات محفوظة أولاً
  if (this.storeService.hasStoredStoreData()) {
    const storedData = this.storeService.getStoredStoreData();
    this.storeData = storedData;
    this.storeService.setStoreData(storedData);
  } else {
    // تحميل من الخادم
    this.getMyStores();
  }
}

// أو استخدام initializeStoreData
ngOnInit() {
  this.storeService.initializeStoreData().subscribe({
    next: (data) => {
      this.storeData = data;
    },
    error: (error) => {
      console.error('Error loading store data:', error);
    }
  });
}
```

### حفظ البيانات
```typescript
// عند استلام البيانات من الخادم
this.storeService.getMyStore().subscribe({
  next: (res) => {
    if (res) {
      this.storeData = res;
      // حفظ تلقائي في localStorage
      this.storeService.setStoreData(res);
    }
  }
});
```

### مسح البيانات
```typescript
// عند تسجيل الخروج
this.storeService.clearStoreData();
```

## التحديثات المطبقة

### 1. StoreService
- إضافة localStorage persistence
- استرجاع تلقائي للبيانات عند البدء
- methods جديدة لإدارة البيانات المحفوظة

### 2. SidebarDashboardComponent
- تحسين منطق تحميل البيانات
- استخدام البيانات المحفوظة أولاً
- حفظ البيانات في localStorage عند التحميل من الخادم

### 3. UsersService
- مسح بيانات المتجر عند تسجيل الخروج
- إضافة StoreService dependency

## الفوائد

1. **استمرارية البيانات**: البيانات لا تُفقد عند refresh
2. **تحسين الأداء**: تقليل الطلبات للخادم
3. **تجربة مستخدم أفضل**: عدم الحاجة لإعادة تحميل البيانات
4. **أمان**: مسح البيانات عند تسجيل الخروج

## ملاحظات مهمة

- البيانات تُحفظ في localStorage للمتصفح الحالي فقط
- عند تسجيل الخروج يتم مسح البيانات تلقائياً
- في حالة حدوث خطأ في localStorage، يتم التعامل معه gracefully
- البيانات تُحفظ كـ JSON string في localStorage
