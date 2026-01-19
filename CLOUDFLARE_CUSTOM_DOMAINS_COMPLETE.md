# 🚀 نظام Custom Domains الأوتوماتيكي - Cloudflare
## دليل التطبيق الكامل

---

## 📊 نظرة عامة

```
المستخدم → www.mystore.com
            ↓ (CNAME → dokn.net)
        Cloudflare DNS
            ↓
    Cloudflare for SaaS (Custom Hostnames)
            ↓
    Cloudflare Worker (store-router)
            ↓
    Cloudflare Pages (Frontend)
            ↓
    Angular App (يعرض المتجر حسب الدومين)
```

---

## 🔐 الخطوة 0: إعداد Cloudflare API

### 1. احصل على API Token

```
Cloudflare Dashboard → My Profile → API Tokens → Create Token
```

**Permissions المطلوبة:**
- Zone → Zone → Read
- Zone → DNS → Edit
- Zone → SSL and Certificates → Edit

**Zone Resources:**
- Include → Specific zone → dokn.net

انسخ الـ Token: `YOUR_CLOUDFLARE_API_TOKEN`

### 2. احصل على Zone ID

```
Cloudflare Dashboard → dokn.net → Overview (الشريط الجانبي الأيمن)
```

انسخ: `YOUR_ZONE_ID`

---

## 📁 هيكل المشروع

```
dokan-backend/
├── prisma/
│   └── schema.prisma          ← قاعدة البيانات
├── src/
│   ├── cloudflare/
│   │   ├── cloudflare.service.ts    ← API Integration
│   │   └── cloudflare.module.ts
│   ├── custom-domains/
│   │   ├── custom-domains.service.ts
│   │   ├── custom-domains.controller.ts
│   │   └── custom-domains.module.ts
│   └── stores/
│       ├── stores.service.ts
│       └── stores.controller.ts
└── .env
```

---

## ⚙️ الخطوة 1: Backend Setup

سأنشئ لك الملفات كاملة في المجلد التالي.

---

## 🎨 الخطوة 2: Frontend Setup

الفرونت إند جاهز تقريباً، سأضيف:
1. ✅ صفحة إدارة الدومينات
2. ✅ Service للتعامل مع API
3. ✅ تحديث Routing

---

## 🌐 الخطوة 3: Cloudflare Worker

Worker موجود لديك، سأتأكد أنه يدعم Custom Domains.

---

## 🚀 سير العمل (User Flow)

### للتاجر (Store Owner):

```
1. يسجل دخول لـ Dashboard
   └→ https://dokn.net/dashboard

2. يذهب لصفحة "الدومينات المخصصة"
   └→ /dashboard/domains

3. يضيف دومينه الجديد
   ┌─────────────────────────────────┐
   │ أضف دومين جديد                  │
   │ ┌─────────────────────────┐     │
   │ │ www.mystore.com         │ [إضافة]
   │ └─────────────────────────┘     │
   └─────────────────────────────────┘

4. يضغط "إضافة" ←→ يحدث تلقائياً:
   ✅ يضاف في Cloudflare for SaaS
   ✅ يحفظ في قاعدة البيانات
   ✅ تظهر تعليمات DNS

5. تظهر التعليمات:
   ┌──────────────────────────────────────┐
   │ 📝 أضف السجل التالي في دومينك:      │
   │                                      │
   │ Type:   CNAME                        │
   │ Name:   www                          │
   │ Value:  dokn.net                     │
   │ TTL:    Auto                         │
   │                                      │
   │ الخطوات:                             │
   │ 1. سجل دخول GoDaddy/Namecheap       │
   │ 2. اذهب لـ DNS Management            │
   │ 3. أضف CNAME بالقيم أعلاه            │
   │ 4. احفظ التغييرات                    │
   │ 5. انتظر 5-10 دقائق                 │
   │ 6. اضغط "تحقق" هنا                  │
   └──────────────────────────────────────┘

6. بعد إضافة CNAME، يضغط "تحقق"
   ←→ النظام يفحص Cloudflare
   ←→ يعرض الحالة:
       ✅ مفعّل (active)
       ⏳ قيد التفعيل (pending)
       ❌ خطأ (failed)

7. بعد التفعيل:
   ✅ www.mystore.com يعمل!
   🔒 SSL تلقائي من Cloudflare
```

### للزائر (Customer):

```
1. يزور www.mystore.com

2. Cloudflare DNS
   └→ يحول لـ dokn.net

3. Cloudflare Worker
   └→ يقرأ hostname = www.mystore.com
   └→ يبحث في قاعدة البيانات
   └→ يجد: storeId = 5

4. Cloudflare Pages (Frontend)
   └→ يعرض Angular App
   └→ يقرأ hostname
   └→ يستدعي: /api/stores/by-domain/www.mystore.com
   └→ يعرض بيانات المتجر

5. العميل يرى:
   ┌──────────────────────────────────┐
   │ 🏪 متجر mystore                  │
   │                                  │
   │ [المنتجات] [العروض] [اتصل بنا]  │
   │                                  │
   │ 📦 منتجاتنا:                     │
   │ ...                              │
   └──────────────────────────────────┘
```

---

## 🗄️ قاعدة البيانات

### Schema

```prisma
model Store {
  id            Int             @id @default(autoincrement())
  name          String
  slug          String          @unique  // store1
  ownerId       Int
  customDomains CustomDomain[]
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}

model CustomDomain {
  id                 Int      @id @default(autoincrement())
  domain             String   @unique  // www.mystore.com
  storeId            Int
  store              Store    @relation(fields: [storeId], references: [id])
  
  cfHostnameId       String?  // من Cloudflare API
  sslStatus          String   @default("pending")
  verificationStatus String   @default("pending")
  
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  
  @@index([storeId])
  @@index([domain])
}
```

---

## 📱 واجهة المستخدم (UI)

### صفحة إدارة الدومينات

```
┌──────────────────────────────────────────────────────────────┐
│ 🌐 إدارة الدومينات                                          │
│ اربط دومينك الخاص بمتجرك                                    │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ إضافة دومين جديد                                         │ │
│ │                                                          │ │
│ │ ┌────────────────────────────────┐  ┌──────────────┐   │ │
│ │ │ www.example.com                │  │   إضافة      │   │ │
│ │ └────────────────────────────────┘  └──────────────┘   │ │
│ │                                                          │ │
│ │ أدخل الدومين مع www (مثال: www.mystore.com)             │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ الدومينات المضافة                                        │ │
│ │                                                          │ │
│ │ ┌──────────────────────────────────────────────────────┐ │ │
│ │ │ www.mystore.com               ✅ مفعّل   🔒 SSL: active│ │ │
│ │ │                               [تحقق] [حذف]           │ │ │
│ │ └──────────────────────────────────────────────────────┘ │ │
│ │                                                          │ │
│ │ ┌──────────────────────────────────────────────────────┐ │ │
│ │ │ www.shop2.net                 ⏳ قيد التفعيل          │ │ │
│ │ │                               [تحقق] [حذف]           │ │ │
│ │ └──────────────────────────────────────────────────────┘ │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dokn"

# Cloudflare
CLOUDFLARE_API_TOKEN="YOUR_TOKEN_HERE"
CLOUDFLARE_ZONE_ID="YOUR_ZONE_ID_HERE"
CLOUDFLARE_ACCOUNT_ID="YOUR_ACCOUNT_ID"

# App
PORT=3000
JWT_SECRET="your-secret"
```

### Frontend (environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://dokan-backend-dev.fly.dev',
  platformDomain: 'dokn.net',
};
```

---

## 🧪 الاختبار

### 1. اختبار الباك إند

```bash
# إضافة دومين
POST https://dokan-backend-dev.fly.dev/api/domains
Body: {
  "storeId": 1,
  "domain": "www.test.com"
}

# التحقق
POST https://dokan-backend-dev.fly.dev/api/domains/1/verify
Body: {
  "storeId": 1
}

# الحذف
DELETE https://dokan-backend-dev.fly.dev/api/domains/1
Body: {
  "storeId": 1
}
```

### 2. اختبار الفرونت إند

```
1. افتح: https://dokn.net/dashboard
2. سجل دخول
3. اذهب لـ "الدومينات"
4. أضف دومين
5. اتبع التعليمات
6. اضغط "تحقق"
7. افتح الدومين في متصفح جديد
```

---

## 📦 التثبيت السريع

### Backend

```bash
cd dokan-backend

# تثبيت
npm install @nestjs/config axios

# تحديث Schema
npx prisma migrate dev --name add_custom_domains

# تشغيل
npm run dev

# Deploy
fly deploy
```

### Frontend

```bash
cd SuperEcommere

# تشغيل
ng serve

# Build
ng build --configuration production

# Deploy
# (سيتم تلقائياً عبر GitHub → Cloudflare Pages)
```

---

## ✅ Checklist

قبل الاستخدام، تأكد من:

- [ ] Cloudflare API Token جاهز
- [ ] Zone ID جاهز
- [ ] Backend مُحدّث ومرفوع
- [ ] Prisma Migration تم تنفيذها
- [ ] Frontend مُحدّث ومرفوع
- [ ] Worker مُحدّث
- [ ] Environment Variables مضبوطة

---

## 🆘 حل المشاكل

### المشكلة: الدومين لا يعمل

```
1. تحقق من DNS:
   nslookup www.mystore.com
   
   يجب أن يعرض: CNAME → dokn.net

2. تحقق من Cloudflare:
   Dashboard → SSL/TLS → Custom Hostnames
   
   يجب أن ترى الدومين في القائمة

3. تحقق من قاعدة البيانات:
   SELECT * FROM "CustomDomain" WHERE domain = 'www.mystore.com';
```

### المشكلة: SSL لا يعمل

```
انتظر 5-10 دقائق، Cloudflare تصدر شهادة SSL تلقائياً
اضغط "تحقق" في لوحة التحكم
```

### المشكلة: 404 Not Found

```
تأكد من:
- Worker مُفعّل
- قاعدة البيانات تحتوي على الدومين
- Backend API يعمل
```

---

## 🎯 الملخص

هذا النظام يتيح للتاجر:
1. ✅ إضافة دومينه الخاص
2. ✅ يتم التكوين تلقائياً في Cloudflare
3. ✅ SSL تلقائي
4. ✅ تعليمات واضحة للـ DNS
5. ✅ التحقق من الحالة
6. ✅ الحذف السريع

كل شيء أوتوماتيكي 100%! 🚀
