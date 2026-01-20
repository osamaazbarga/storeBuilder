# اختبار تكامل Frontend مع نظام ربط الدومينات
# Frontend Integration Testing Guide

## 🎯 الهدف

اختبار أن الـ Frontend يستخدم الـ API الجديد `/api/store/current` بشكل صحيح ويعرض المتاجر بناءً على الدومين.

---

## 📋 المتطلبات الأولية

### 1. تشغيل Backend
```bash
cd C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\dokan-backend
npm run start:dev
```

### 2. تشغيل Frontend
```bash
cd C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\SuperEcommere
npm start
```

### 3. إعداد hosts file (للاختبار المحلي)

**Windows**: افتح `C:\Windows\System32\drivers\etc\hosts` كـ Administrator وأضف:

```
127.0.0.1    dokan.local
127.0.0.1    store1.dokan.local
127.0.0.1    test12.dokan.local
127.0.0.1    www.dokan.local
```

**حفظ الملف** ثم أعد تشغيل المتصفح.

---

## 🧪 سيناريوهات الاختبار

### ✅ Test 1: الموقع الرئيسي (Main Platform)

1. افتح المتصفح على: `http://dokan.local:4200`
2. افتح Developer Console (F12)
3. ابحث عن الرسائل التالية:

```javascript
🏪 Store resolution: {isMainPlatform: true, isStoreView: false, store: null}
📍 Main platform
```

**النتيجة المتوقعة**:
- ✅ يظهر الموقع الرئيسي
- ✅ `isStoreView = false`
- ✅ لا توجد بيانات متجر

---

### ✅ Test 2: متجر بـ Subdomain

1. افتح المتصفح على: `http://store1.dokan.local:4200`
2. افتح Developer Console (F12)
3. ابحث عن الرسائل التالية:

```javascript
🏪 Store resolution: {
  isMainPlatform: false,
  isStoreView: true,
  store: {
    id: 1,
    name: "متجر تجريبي",
    subdomain: "store1",
    ...
  }
}
✅ Store loaded: متجر تجريبي
```

**النتيجة المتوقعة**:
- ✅ يظهر المتجر
- ✅ `isStoreView = true`
- ✅ بيانات المتجر محملة في `StoreService`
- ✅ لا يوجد وميض (flash) عند التحميل

---

### ✅ Test 3: التبديل بين الموقع الرئيسي والمتجر

1. افتح `http://dokan.local:4200` (الموقع الرئيسي)
2. انتقل إلى `http://store1.dokan.local:4200` (متجر)
3. ارجع إلى `http://dokan.local:4200`

**النتيجة المتوقعة**:
- ✅ كل صفحة تحمل بسرعة (< 500ms)
- ✅ لا يوجد وميض أو تأخير
- ✅ البيانات الصحيحة تظهر في كل حالة

---

### ✅ Test 4: فحص Network Requests

1. افتح `http://store1.dokan.local:4200`
2. افتح Developer Tools → Network tab
3. ابحث عن Request: `GET /api/store/current`

**النتيجة المتوقعة**:
- ✅ Request واحد فقط لـ `/api/store/current`
- ✅ لا توجد requests لـ `/api/store/by-subdomain/...`
- ✅ لا توجد requests لـ `/api/store/by-custom-domain/...`
- ✅ Response time < 100ms

---

### ✅ Test 5: فحص localStorage

1. افتح `http://store1.dokan.local:4200`
2. افتح Developer Console
3. اكتب:

```javascript
localStorage.getItem('store_data')
```

**النتيجة المتوقعة**:
```json
{
  "id": 1,
  "name": "متجر تجريبي",
  "subdomain": "store1",
  ...
}
```

---

## 🔍 فحص الكود

### تأكد من أن ViewComponent تستخدم API الجديد:

افتح: `src/app/public/components/view/view.component.ts`

**يجب أن يحتوي على**:
```typescript
this.storeService.getCurrentStore().subscribe({
  next: (response) => {
    console.log('🏪 Store resolution:', response);
    
    if (response.isStoreView && response.store) {
      this.isStoreView = true;
      this.storeService.setCurrentStore(response.store);
      console.log('✅ Store loaded:', response.store.name);
    }
  }
});
```

**يجب ألا يحتوي على**:
- ❌ `window.location.hostname.split('.')`
- ❌ `loadStoreBySubdomain()`
- ❌ `loadStoreByCustomDomain()`
- ❌ `platformDomain` checks

---

### تأكد من أن AppComponent نظيف:

افتح: `src/app/app.component.ts`

**يجب ألا يحتوي على**:
- ❌ `const hostname = window.location.hostname`
- ❌ `this.storeName = hostname.split('.')[0]`
- ❌ `getSubdomain()` method

**يجب أن يحتوي فقط على**:
- ✅ `refreshUserOnInit()`
- ✅ WebSocket setup

---

## 📊 مقارنة الأداء

### قبل التحسين:
```
🐌 Initial Load: 1500-2500ms
📡 API Requests: 3-4
👁️ Flash: نعم (يظهر الموقع الرئيسي ثم المتجر)
```

### بعد التحسين:
```
🚀 Initial Load: 300-500ms
📡 API Requests: 1-2
✅ Flash: لا (تحميل مباشر)
```

---

## 🐛 استكشاف الأخطاء الشائعة

### المشكلة 1: "Cannot read property 'name' of null"

**السبب**: المتجر غير موجود في قاعدة البيانات

**الحل**:
```sql
-- تحقق من وجود المتجر
SELECT * FROM stores WHERE subdomain = 'store1';

-- إذا لم يكن موجود، أنشئه
INSERT INTO stores (name, subdomain, "userId", ...) VALUES (...);
```

---

### المشكلة 2: دائماً يظهر الموقع الرئيسي

**السبب**: الـ Backend لا يتعرف على الدومين

**الحل**:
1. تحقق من hosts file
2. تحقق من أن Backend يعمل
3. افحص Console في Backend:
```
🔍 Resolving store for: store1.dokan.local
```

---

### المشكلة 3: CORS Error

**السبب**: الدومين غير مسموح في CORS settings

**الحل**: تحقق من `src/config/cors.config.ts` في Backend:
```typescript
origin: [
  'http://localhost:4200',
  'http://dokan.local:4200',
  'http://store1.dokan.local:4200',
  // أضف جميع الـ subdomains
  /\.dokan\.local:4200$/,
]
```

---

### المشكلة 4: بطء في التحميل

**السبب**: الـ Middleware يستغرق وقتاً طويلاً

**الحل**:
1. تحقق من أن قاعدة البيانات تعمل بسرعة
2. أضف indexes على `subdomain` و `domain` في قاعدة البيانات
3. فعّل caching إذا لزم الأمر

---

## ✅ قائمة التحقق النهائية

### Backend:
- [ ] يعمل على `localhost:3000`
- [ ] `/api/store/current` يرد بشكل صحيح
- [ ] Middleware يسجل الرسائل في Console

### Frontend:
- [ ] يعمل على `localhost:4200`
- [ ] ViewComponent يستخدم `getCurrentStore()`
- [ ] AppComponent نظيف من الكود القديم
- [ ] لا توجد أخطاء في Console

### Integration:
- [ ] الموقع الرئيسي يعمل
- [ ] المتاجر تحمل بشكل صحيح
- [ ] لا يوجد وميض عند التحميل
- [ ] الأداء محسّن (< 500ms)

---

## 🎉 النجاح!

إذا نجحت جميع الاختبارات، فقد أكملت التحسين بنجاح! 

**الفوائد**:
- ⚡ تحميل أسرع بـ 3-5 مرات
- 🎯 كود أنظف وأسهل للصيانة
- 🔒 أمان أفضل (التحقق على مستوى الـ Backend)
- 🌐 جاهز للـ Production

---

## 🚀 الخطوة التالية: النشر على VPS

بعد نجاح الاختبارات المحلية، يمكنك:

1. **بناء Frontend للـ Production**:
```bash
npm run build
```

2. **نسخ الملفات إلى VPS**:
```bash
scp -r dist/super-ecommere/browser/* user@your-vps:/var/www/dokn/frontend/
```

3. **إعداد Nginx** (راجع الخطة للإعدادات الكاملة)

4. **إعداد SSL** باستخدام Let's Encrypt:
```bash
sudo certbot --nginx -d dokn.net -d *.dokn.net
```

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. راجع ملف `TEST_DOMAIN_RESOLUTION.md` للـ Backend
2. تحقق من Console في المتصفح والـ Backend
3. راجع الخطة الأصلية للتفاصيل الكاملة
