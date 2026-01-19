# 🎯 الدليل الشامل - نظام Custom Domains الأوتوماتيكي

## 📋 جدول المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [المكونات الأساسية](#المكونات-الأساسية)
3. [خطة التنفيذ](#خطة-التنفيذ)
4. [دليل المستخدم](#دليل-المستخدم)
5. [الأسئلة الشائعة](#الأسئلة-الشائعة)

---

## 🌟 نظرة عامة

### ما هو النظام؟

نظام يتيح للتجار ربط دوميناتهم الخاصة بمتاجرهم **بشكل أوتوماتيكي 100%** عبر:

- ✅ واجهة مستخدم سهلة
- ✅ إضافة تلقائية في Cloudflare
- ✅ SSL مجاني ومُفعّل تلقائياً
- ✅ تعليمات واضحة للـ DNS

---

## 🏗️ المكونات الأساسية

### البنية التقنية

```
┌─────────────────────────────────────────────┐
│ مكونات النظام                               │
├─────────────────────────────────────────────┤
│                                             │
│ 1️⃣ Frontend (Angular)                       │
│    • صفحة إدارة الدومينات                   │
│    • Service للـ API Calls                  │
│    • UI Components                          │
│    • Translations (AR/EN/HE)                │
│                                             │
│ 2️⃣ Backend (NestJS + Prisma)                │
│    • Cloudflare Service (API Integration)   │
│    • Custom Domains Service                 │
│    • Custom Domains Controller              │
│    • Database (CustomDomain Model)          │
│                                             │
│ 3️⃣ Cloudflare Worker                        │
│    • Multi-Tenant Router                    │
│    • Subdomain Handler                      │
│    • Custom Domain Handler                  │
│                                             │
│ 4️⃣ Cloudflare for SaaS                      │
│    • Custom Hostnames API                   │
│    • SSL Certificate Management             │
│    • DNS Management                         │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🚀 خطة التنفيذ

### المرحلة 1️⃣: Backend (30 دقيقة)

#### 1.1 تثبيت المكتبات

```bash
cd C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\dokan-backend

npm install axios
```

#### 1.2 تحديث Prisma Schema

**ملف:** `prisma/schema.prisma`

**أضف:**

```prisma
model CustomDomain {
  id                 Int      @id @default(autoincrement())
  domain             String   @unique
  storeId            Int
  store              Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  cfHostnameId       String?
  sslStatus          String   @default("pending")
  verificationStatus String   @default("pending")
  dnsRecords         Json?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  
  @@index([storeId])
  @@index([domain])
  @@map("CustomDomains")
}

model Store {
  // ... existing fields
  customDomains CustomDomain[]  // أضف هذا
  // ...
}
```

**نفذ:**

```bash
npx prisma migrate dev --name add_custom_domains
npx prisma generate
```

#### 1.3 إضافة Environment Variables

**ملف:** `.env`

```env
CLOUDFLARE_API_TOKEN="your_token"
CLOUDFLARE_ZONE_ID="your_zone_id"
CLOUDFLARE_ACCOUNT_ID="your_account_id"
```

**📖 اقرأ:** `ENV_SETUP.md` لمعرفة كيفية الحصول على القيم.

#### 1.4 تحديث App Module

**ملف:** `src/app.module.ts`

```typescript
import { CloudflareModule } from './cloudflare/cloudflare.module';
import { CustomDomainsModule } from './custom-domains/custom-domains.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CloudflareModule,       // أضف
    CustomDomainsModule,    // أضف
    // ...
  ],
})
export class AppModule {}
```

#### 1.5 اختبار و Deploy

```bash
# تشغيل محلي
npm run start:dev

# يجب أن ترى:
# ✅ Cloudflare Service initialized for zone: xxxxx

# Deploy
npm run build
fly deploy
```

---

### المرحلة 2️⃣: Frontend (20 دقيقة)

#### 2.1 الملفات الموجودة

| الملف | المسار | الحالة |
|------|--------|---------|
| Service | `src/app/services/custom-domains.service.ts` | ✅ جاهز |
| Component (TS) | `src/app/private/components/custom-domains/custom-domains-new.component.ts` | ✅ جاهز |
| Component (HTML) | `src/app/private/components/custom-domains/custom-domains-new.component.html` | ✅ جاهز |
| Component (SCSS) | `src/app/private/components/custom-domains/custom-domains-new.component.scss` | ✅ جاهز |
| Translations (AR) | `src/assets/i18n/ar/custom-domains.json` | ✅ جاهز |
| Translations (EN) | `src/assets/i18n/en/custom-domains.json` | ✅ جاهز |
| Translations (HE) | `src/assets/i18n/he/custom-domains.json` | ✅ جاهز |

#### 2.2 إضافة Route

**ملف:** `src/app/private/private-routing.module.ts`

```typescript
const routes: Routes = [
  {
    path: '',
    component: DashboardHomeComponent,
    children: [
      // ... existing routes
      {
        path: 'custom-domains',
        component: CustomDomainsNewComponent,
      },
    ],
  },
];
```

#### 2.3 إضافة في Sidebar

**ملف:** `src/app/private/components/sidebar-dashboard/sidebar-dashboard.component.ts`

```typescript
sidebarItems = [
  // ... existing items
  {
    route: '/dashboard/custom-domains',
    icon: 'language',
    translationKey: 'CUSTOM_DOMAINS.TITLE',
  },
];
```

#### 2.4 Build و Deploy

```bash
cd C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\SuperEcommere

# تشغيل محلي
ng serve

# Build
ng build --configuration production

# Deploy (عبر Git → Cloudflare Pages تلقائياً)
git add .
git commit -m "Add Custom Domains feature"
git push
```

---

### المرحلة 3️⃣: Cloudflare Worker (15 دقيقة)

#### 3.1 إنشاء Worker

```
1. اذهب لـ: https://dash.cloudflare.com
2. Workers & Pages → Create → Create Worker
3. الاسم: store-router
4. Edit Code
5. انسخ من: cloudflare-worker-custom-domains.js
6. Save and Deploy
```

#### 3.2 إضافة Routes

```
Workers & Pages → store-router → Settings → Triggers
```

**أضف:**

```
dokn.net/*
*.dokn.net/*
```

#### 3.3 تحديث DNS

في `dokn.net` DNS:

```
Type: A
Name: @
Content: 192.0.2.1
Proxy: ✅ Proxied

Type: A
Name: *
Content: 192.0.2.1
Proxy: ✅ Proxied
```

**📖 اقرأ:** `CLOUDFLARE_WORKER_SETUP.md` للتفاصيل.

---

### المرحلة 4️⃣: Cloudflare for SaaS (5 دقائق)

#### 4.1 إضافة Fallback Origin

```
Cloudflare → dokn.net → SSL/TLS → Custom Hostnames → Fallback Origin
```

**أضف:**

```
Fallback Origin: fallback.dokn.net
```

#### 4.2 إضافة DNS Record للـ Fallback

```
Type: CNAME
Name: fallback
Content: storebuilder-4qs.pages.dev
Proxy: ✅ Proxied
```

---

## 👤 دليل المستخدم (للتاجر)

### كيف أربط دوميني الخاص؟

#### الخطوة 1: شراء دومين

```
1. اذهب لأي موقع (GoDaddy, Namecheap, Cloudflare)
2. اشتري دومين (مثال: mystore.com)
3. لا تحتاج أي إعدادات هناك بعد!
```

#### الخطوة 2: إضافة الدومين في المنصة

```
1. سجل دخول لمتجرك: https://dokn.net/dashboard
2. اذهب لـ "الدومينات المخصصة"
3. أدخل دومينك: www.mystore.com
4. اضغط "إضافة"
```

#### الخطوة 3: إضافة CNAME في موقع الدومين

**ستظهر لك تعليمات مثل:**

```
┌──────────────────────────────────────┐
│ أضف السجل التالي في DNS:             │
│                                      │
│ Type:   CNAME                        │
│ Name:   www (أو @)                   │
│ Value:  dokn.net                     │
│ TTL:    Auto                         │
└──────────────────────────────────────┘
```

**نفذ:**

```
1. سجل دخول لموقع دومينك (GoDaddy/Namecheap)
2. DNS Settings / DNS Management
3. Add Record:
   - Type: CNAME
   - Name: www
   - Value: dokn.net
4. Save
```

#### الخطوة 4: التحقق

```
1. انتظر 5-10 دقائق
2. ارجع للمنصة
3. اضغط "تحقق"
4. عند ظهور ✅ مفعّل → دومينك شغال!
```

#### الخطوة 5: الزيارة

```
افتح: https://www.mystore.com
متوقع: متجرك يظهر! 🎉
```

---

## 🔧 الأسئلة الشائعة

### س1: كم يستغرق تفعيل الدومين؟

```
⏱️  عادة 5-15 دقيقة
⏱️  أحياناً حتى ساعة
⏱️  نادراً حتى 24 ساعة (بسبب DNS Propagation)
```

### س2: هل SSL مجاني؟

```
✅ نعم! يُصدر تلقائياً من Cloudflare
✅ يُحدّث تلقائياً
✅ غير محدود
```

### س3: هل يمكن إضافة أكثر من دومين؟

```
✅ نعم! يمكنك إضافة عدة دومينات لنفس المتجر
مثال:
- www.mystore.com
- shop.mystore.com
- www.mystore.net
```

### س4: ماذا لو لم يعمل الدومين؟

```
1️⃣ تحقق من CNAME في موقع الدومين:
   nslookup www.mystore.com
   
   يجب أن يعرض: CNAME → dokn.net

2️⃣ تحقق من حالة الدومين في لوحة التحكم
3️⃣ اضغط "تحقق" مرة أخرى
4️⃣ انتظر 10-30 دقيقة إضافية
```

### س5: هل يمكن استخدام دومين بدون www؟

```
⚠️ نعم، لكن يُفضّل مع www لأسباب تقنية:

✅ الأفضل: www.mystore.com
⚠️ يعمل أيضاً: mystore.com

إذا أردت بدون www، أضف:
Type: CNAME
Name: @
Value: dokn.net
```

### س6: كم عدد الدومينات المدعومة؟

```
✅ مجاني: حتى 100 دومين (Cloudflare Free Plan)
✅ مدفوع: غير محدود (Cloudflare for SaaS)
```

---

## 📊 Architecture Diagram

```
┌──────────────────────────────────────────────────────┐
│ Customer Journey                                     │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Customer (Merchant)                                 │
│        │                                             │
│        ▼                                             │
│  1. Buys domain (GoDaddy/Namecheap)                 │
│        │                                             │
│        ▼                                             │
│  2. Logs into https://dokn.net/dashboard            │
│        │                                             │
│        ▼                                             │
│  3. Goes to "Custom Domains"                        │
│        │                                             │
│        ▼                                             │
│  4. Enters: www.mystore.com                         │
│        │                                             │
│        ▼                                             │
│  ┌────────────────────────────────┐                 │
│  │ Frontend (Angular)             │                 │
│  │ POST /api/custom-domains       │                 │
│  └────────────┬───────────────────┘                 │
│               ▼                                      │
│  ┌────────────────────────────────┐                 │
│  │ Backend (NestJS)               │                 │
│  │ 1. Validate domain             │                 │
│  │ 2. Call Cloudflare API         │                 │
│  │ 3. Save to Database            │                 │
│  │ 4. Return DNS instructions     │                 │
│  └────────────┬───────────────────┘                 │
│               ▼                                      │
│  ┌────────────────────────────────┐                 │
│  │ Cloudflare for SaaS            │                 │
│  │ • Creates Custom Hostname      │                 │
│  │ • Generates ownership_token    │                 │
│  │ • Prepares SSL certificate     │                 │
│  └────────────┬───────────────────┘                 │
│               ▼                                      │
│  ┌────────────────────────────────┐                 │
│  │ Instructions shown to user:    │                 │
│  │                                │                 │
│  │ Type:  CNAME                   │                 │
│  │ Name:  www                     │                 │
│  │ Value: dokn.net                │                 │
│  └────────────┬───────────────────┘                 │
│               ▼                                      │
│  5. Customer adds CNAME at GoDaddy                  │
│        │                                             │
│        ▼                                             │
│  6. Customer clicks "Verify"                        │
│        │                                             │
│        ▼                                             │
│  ┌────────────────────────────────┐                 │
│  │ Backend checks Cloudflare:     │                 │
│  │ • verificationStatus: active?  │                 │
│  │ • sslStatus: active?           │                 │
│  └────────────┬───────────────────┘                 │
│               ▼                                      │
│  7. ✅ Status: Active!                              │
│                                                      │
│  ─────────────────────────────────────              │
│                                                      │
│  End Customer (Buyer) visits:                       │
│  https://www.mystore.com                            │
│        │                                             │
│        ▼                                             │
│  ┌────────────────────────────────┐                 │
│  │ Cloudflare DNS                 │                 │
│  │ CNAME → dokn.net               │                 │
│  └────────────┬───────────────────┘                 │
│               ▼                                      │
│  ┌────────────────────────────────┐                 │
│  │ Cloudflare Worker              │                 │
│  │ • Detects: www.mystore.com     │                 │
│  │ • Calls: /api/stores/by-domain │                 │
│  │ • Gets: Store data             │                 │
│  └────────────┬───────────────────┘                 │
│               ▼                                      │
│  ┌────────────────────────────────┐                 │
│  │ Frontend (Cloudflare Pages)    │                 │
│  │ • Reads hostname               │                 │
│  │ • Loads store data             │                 │
│  │ • Displays store               │                 │
│  └────────────┬───────────────────┘                 │
│               ▼                                      │
│  8. 🎉 Customer sees the store!                     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## ✅ Checklist النهائي

### Backend

- [ ] تثبيت `axios`
- [ ] تحديث Prisma Schema
- [ ] تنفيذ Migration (`npx prisma migrate dev`)
- [ ] إضافة Environment Variables (Cloudflare API Token, Zone ID)
- [ ] تحديث App Module (CloudflareModule, CustomDomainsModule)
- [ ] اختبار محلي (`npm run start:dev`)
- [ ] Deploy إلى Fly.io (`fly deploy`)
- [ ] اختبار API في Production

### Frontend

- [ ] تحديث Routing (إضافة route للـ custom-domains)
- [ ] إضافة في Sidebar
- [ ] اختبار محلي (`ng serve`)
- [ ] Build (`ng build`)
- [ ] Deploy إلى Cloudflare Pages (via Git push)

### Cloudflare Worker

- [ ] إنشاء Worker جديد (`store-router`)
- [ ] نسخ الكود من `cloudflare-worker-custom-domains.js`
- [ ] إضافة Routes (`dokn.net/*`, `*.dokn.net/*`)
- [ ] تحديث المتغيرات (PLATFORM_DOMAIN, BACKEND_URL, FRONTEND_URL)
- [ ] اختبار Worker Logs

### Cloudflare for SaaS

- [ ] إضافة Fallback Origin (`fallback.dokn.net`)
- [ ] إضافة DNS Record للـ Fallback
- [ ] التحقق من SSL/TLS Settings

### اختبار شامل

- [ ] Main Domain (`https://dokn.net`)
- [ ] Subdomain (`https://store1.dokn.net`)
- [ ] Custom Domain (إضافة + تحقق + زيارة)
- [ ] SSL Certificate (تحقق من القفل الأخضر)

---

## 🎉 النتيجة النهائية

بعد تنفيذ جميع الخطوات، سيكون لديك:

✅ **نظام متكامل** يتيح للتجار ربط دوميناتهم بسهولة  
✅ **أوتوماتيكي 100%** - لا حاجة للتدخل اليدوي  
✅ **SSL مجاني** - شهادات SSL تُصدر تلقائياً  
✅ **سريع** - يعمل على Cloudflare Edge Network  
✅ **قابل للتوسع** - يدعم آلاف الدومينات  
✅ **واجهة سهلة** - لوحة تحكم بسيطة وواضحة  

---

## 📚 ملفات التوثيق الإضافية

| الملف | الوصف |
|------|-------|
| `CLOUDFLARE_CUSTOM_DOMAINS_COMPLETE.md` | شرح تفصيلي للنظام |
| `INSTALLATION_GUIDE.md` | دليل تثبيت Backend خطوة بخطوة |
| `ENV_SETUP.md` | شرح Environment Variables |
| `PRISMA_SCHEMA_UPDATE.md` | تحديثات قاعدة البيانات |
| `CLOUDFLARE_WORKER_SETUP.md` | إعداد Worker بالتفصيل |
| `cloudflare-worker-custom-domains.js` | كود Worker الكامل |

---

🚀 **الآن كل شيء جاهز! ابدأ التنفيذ!**
