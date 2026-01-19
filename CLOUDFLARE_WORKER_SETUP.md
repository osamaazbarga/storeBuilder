# 🌐 Cloudflare Worker Setup - Multi-Tenant Router

## 📋 ما الذي يفعله Worker؟

Worker يتعامل مع 3 أنواع من الطلبات:

```
1. Main Domain (dokn.net)
   → يعرض الصفحة الرئيسية

2. Subdomain (store1.dokn.net)
   → يتحقق من وجود المتجر في Backend
   → يعرض Frontend مع بيانات المتجر

3. Custom Domain (www.mystore.com)
   → يتحقق من Custom Domains في Backend
   → يعرض Frontend مع بيانات المتجر
```

---

## 🚀 الخطوة 1: إنشاء Worker

### في Cloudflare Dashboard:

```
1. اذهب لـ: https://dash.cloudflare.com
2. Workers & Pages → Create → Create Worker
3. اسمه: store-router
4. Edit Code
5. انسخ كود Worker من ملف: cloudflare-worker-custom-domains.js
6. Save and Deploy
```

---

## 🔗 الخطوة 2: ربط Worker بالدومين

### 2.1 إضافة Route

```
Workers & Pages → store-router → Settings → Triggers
```

**أضف Routes:**

```
1. dokn.net/*
2. *.dokn.net/*
3. */*  (لجميع الدومينات المخصصة)
```

### 2.2 تحديث DNS

في `dokn.net` DNS:

```
Type: A
Name: @
Content: 192.0.2.1  (Cloudflare Proxy IP)
Proxy: ✅ Proxied (البرتقالي)

Type: A
Name: *
Content: 192.0.2.1
Proxy: ✅ Proxied
```

---

## ⚙️ الخطوة 3: تحديث Worker Variables

في Worker Code، عدّل هذه القيم:

```javascript
const PLATFORM_DOMAIN = 'dokn.net';  // دومينك
const BACKEND_URL = 'https://dokan-backend-dev.fly.dev';  // Backend URL
const FRONTEND_URL = 'https://storebuilder-4qs.pages.dev';  // Cloudflare Pages URL
```

---

## 🧪 الخطوة 4: الاختبار

### اختبار 1: Main Domain

```
افتح: https://dokn.net
متوقع: الصفحة الرئيسية تظهر ✅
```

### اختبار 2: Subdomain

```
افتح: https://store1.dokn.net
متوقع: متجر store1 يظهر ✅
```

### اختبار 3: Custom Domain (بعد الإعداد)

```
افتح: https://www.mystore.com
متوقع: المتجر المرتبط بهذا الدومين يظهر ✅
```

---

## 🔍 تتبع Logs

### في Cloudflare Dashboard:

```
Workers & Pages → store-router → Logs
```

**يجب أن ترى:**

```
📍 Request for: www.mystore.com
🔍 Checking if www.mystore.com is a custom domain...
🔍 Normalized domain: www.mystore.com → mystore.com
✅ Custom domain verified: www.mystore.com → Store: store1
```

---

## 🛠️ استكشاف الأخطاء

### المشكلة: "Store not found"

```
✅ تحقق من Backend:
   curl https://dokan-backend-dev.fly.dev/api/stores/by-slug/store1

✅ تحقق من Custom Domain:
   curl https://dokan-backend-dev.fly.dev/api/stores/by-domain/mystore.com

✅ تأكد من Prisma Migration تمت
```

### المشكلة: Worker لا يعمل

```
✅ تحقق من Routes في Worker Settings
✅ تأكد من DNS Proxy مفعّل (البرتقالي)
✅ انتظر 2-3 دقائق للـ propagation
```

### المشكلة: Custom Domain يعطي 404

```
✅ تأكد من CNAME مضاف في DNS الخارجي:
   Type: CNAME
   Name: www (أو @)
   Value: dokn.net

✅ تحقق من Cloudflare Custom Hostnames:
   Dashboard → SSL/TLS → Custom Hostnames

✅ تأكد من الدومين موجود في Database
```

---

## 📊 Architecture Flow

```
Customer Request
    ↓
[Cloudflare DNS]
    ↓
www.mystore.com → CNAME → dokn.net
    ↓
[Cloudflare Worker: store-router]
    ↓
Worker checks hostname type:
  • dokn.net? → Main site
  • *.dokn.net? → Check Backend (by-slug)
  • Other? → Check Backend (by-domain)
    ↓
[Backend API: dokan-backend-dev.fly.dev]
    ↓
Returns store data
    ↓
[Worker forwards to Frontend]
    ↓
[Cloudflare Pages: storebuilder-4qs.pages.dev]
    ↓
Angular App reads hostname
    ↓
Displays correct store
    ↓
Customer sees their store! ✅
```

---

## 🎯 ملاحظات مهمة

1. **Worker يعمل Edge-Side:**
   - أسرع من Server-Side
   - يعمل في كل مناطق Cloudflare

2. **Backend Lookups:**
   - Worker يستدعي Backend مرة واحدة فقط
   - يمكن إضافة Cache للأداء

3. **Custom Domains:**
   - تحتاج Cloudflare for SaaS (مجاني حتى 100 domain)
   - SSL تلقائي

4. **Frontend:**
   - Angular App يقرأ `window.location.hostname`
   - يعرف من أي دومين تم الوصول

---

✅ **Worker جاهز للعمل!**
