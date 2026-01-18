# ⚡ Quick Start: Custom Domains في Angular

**الوقت المتوقع:** 2 دقيقة ⏱️

---

## 🚀 **ماذا تم إضافته؟**

```
✅ صفحة كاملة لإدارة الدومينات المخصصة
✅ عنصر جديد في Sidebar
✅ تكامل كامل مع Backend API
✅ UI احترافية وResponsive
```

---

## 📍 **كيف تصل للصفحة؟**

### **الطريقة 1: من Sidebar**
```
1. افتح Dashboard
2. اذهب إلى "الإعدادات"
3. اضغط "الدومينات المخصصة" 🌐
```

### **الطريقة 2: مباشرة**
```
URL: http://localhost:4200/dashboard/custom-domains
```

---

## 🎨 **ما يمكنك فعله؟**

### **1. إضافة دومين مخصص:**
```
1. أدخل الدومين (مثل: www.mystore.com)
2. اضغط "إضافة الدومين"
3. ستظهر تعليمات الربط
```

### **2. التحقق من الدومين:**
```
1. أضف سجل CNAME في مزود الدومين:
   Type: CNAME
   Name: @ أو www
   Value: dokn.net

2. عد للصفحة واضغط "تحقق الآن"
```

### **3. تعيين دومين كرئيسي:**
```
1. بعد التحقق، اضغط "تعيين كرئيسي"
2. هذا الدومين سيصبح عنوان المتجر الأساسي
```

### **4. حذف دومين:**
```
1. اضغط "حذف" على أي دومين مخصص
2. Confirm الحذف
```

---

## 📊 **حالات الدومين:**

```
✅ مفعّل (active) - الدومين يعمل بشكل كامل
🔄 جاري التحقق (verifying) - Cloudflare يتحقق من DNS
⏳ في انتظار التحقق (pending) - لم يتم إعداد DNS بعد
❌ فشل (failed) - مشكلة في الإعدادات
```

---

## 🧪 **اختبار سريع:**

```bash
# 1. Start Angular
npm start

# 2. افتح المتصفح
http://localhost:4200/dashboard/custom-domains

# 3. جرب إضافة دومين تجريبي
test.example.com

# 4. لاحظ التعليمات المنبثقة
```

---

## 💡 **نصائح:**

```
✅ استخدم دومين حقيقي للاختبار الفعلي
✅ قد يستغرق DNS من 5 دقائق إلى 24 ساعة
✅ SSL يُصدر تلقائياً بعد التحقق
✅ يمكن ربط دومين واحد رئيسي فقط
✅ الـ Subdomains تعمل دائماً
```

---

## 🎯 **الملفات الجديدة:**

```
src/app/
├── services/
│   └── custom-domains.service.ts ✅
│
└── private/components/custom-domains/
    ├── custom-domains.component.ts ✅
    ├── custom-domains.component.html ✅
    └── custom-domains.component.scss ✅
```

---

## ❓ **مشاكل شائعة:**

### **المشكلة: الصفحة لا تفتح**
```
الحل: تأكد من:
- ng serve يعمل
- Private Module يحتوي CustomDomainsComponent
- Routing يحتوي المسار
```

### **المشكلة: API لا يستجيب**
```
الحل:
- تأكد من Backend يعمل
- تأكد من environment.apiUrl صحيح
- افحص Network في Developer Tools
```

### **المشكلة: DNS لا يتحقق**
```
الحل:
- تأكد من إضافة CNAME بشكل صحيح
- انتظر 15-30 دقيقة للـ DNS Propagation
- استخدم dnschecker.org للتأكد
```

---

## 🎉 **كل شيء جاهز!**

```
الصفحة تعمل بشكل كامل!
جرّبها الآن واستمتع! 🚀
```

---

**للمزيد:** اقرأ `CUSTOM_DOMAINS_FRONTEND_SUMMARY.md`
