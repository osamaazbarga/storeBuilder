# 🚀 Quick Start - Custom Domains System

## ⚡ البداية السريعة (1 ساعة)

---

## 📁 هيكل الملفات

```
✅ Backend (dokan-backend):
   C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\dokan-backend\
   ├── src/
   │   ├── cloudflare/
   │   │   ├── cloudflare.service.ts
   │   │   └── cloudflare.module.ts
   │   └── custom-domains/
   │       ├── custom-domains.service.ts
   │       ├── custom-domains.controller.ts
   │       └── custom-domains.module.ts
   ├── INSTALLATION_GUIDE.md
   ├── ENV_SETUP.md
   └── PRISMA_SCHEMA_UPDATE.md

✅ Frontend (SuperEcommere):
   C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\SuperEcommere\
   ├── src/
   │   ├── app/
   │   │   ├── services/
   │   │   │   └── custom-domains.service.ts
   │   │   └── private/components/custom-domains/
   │   │       ├── custom-domains-new.component.ts
   │   │       ├── custom-domains-new.component.html
   │   │       └── custom-domains-new.component.scss
   │   └── assets/i18n/
   │       ├── ar/custom-domains.json
   │       ├── en/custom-domains.json
   │       └── he/custom-domains.json

✅ Worker:
   cloudflare-worker-custom-domains.js
   CLOUDFLARE_WORKER_SETUP.md

✅ التوثيق:
   COMPLETE_SYSTEM_GUIDE.md
   CLOUDFLARE_CUSTOM_DOMAINS_COMPLETE.md
```

---

## 🎯 خطة التنفيذ السريعة

### المرحلة 1: Backend (30 دقيقة) ⏱️

```bash
cd C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\dokan-backend

# 1. تثبيت المكتبات
npm install axios

# 2. تحديث Prisma
# اقرأ: PRISMA_SCHEMA_UPDATE.md
# أضف CustomDomain model في prisma/schema.prisma
npx prisma migrate dev --name add_custom_domains
npx prisma generate

# 3. إضافة Environment Variables
# اقرأ: ENV_SETUP.md
# أضف في .env:
# CLOUDFLARE_API_TOKEN=...
# CLOUDFLARE_ZONE_ID=...

# 4. تحديث App Module
# أضف CloudflareModule و CustomDomainsModule في src/app.module.ts

# 5. اختبار
npm run start:dev

# 6. Deploy
npm run build
fly deploy
```

**📖 دليل مفصل:** `INSTALLATION_GUIDE.md`

---

### المرحلة 2: Frontend (20 دقيقة) ⏱️

```bash
cd C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\SuperEcommere

# 1. إضافة Route
# في private-routing.module.ts:
# { path: 'custom-domains', component: CustomDomainsNewComponent }

# 2. إضافة في Sidebar
# في sidebar-dashboard.component.ts:
# { route: '/dashboard/custom-domains', icon: 'language', ... }

# 3. اختبار
ng serve

# 4. Build & Deploy
ng build --configuration production
git add .
git commit -m "Add Custom Domains"
git push
```

---

### المرحلة 3: Cloudflare Worker (15 دقيقة) ⏱️

```
1. اذهب لـ: https://dash.cloudflare.com
2. Workers & Pages → Create Worker
3. الاسم: store-router
4. انسخ كود من: cloudflare-worker-custom-domains.js
5. Save and Deploy
6. Settings → Triggers → Add Routes:
   • dokn.net/*
   • *.dokn.net/*
7. تحديث DNS (A record للـ @ و *)
```

**📖 دليل مفصل:** `CLOUDFLARE_WORKER_SETUP.md`

---

### المرحلة 4: Cloudflare for SaaS (5 دقائق) ⏱️

```
1. Cloudflare → dokn.net → SSL/TLS → Custom Hostnames
2. Fallback Origin: fallback.dokn.net
3. DNS → Add CNAME:
   • Name: fallback
   • Content: storebuilder-4qs.pages.dev
   • Proxy: ✅
```

---

## 🧪 الاختبار

### 1. Main Domain

```
افتح: https://dokn.net
متوقع: الصفحة الرئيسية ✅
```

### 2. Subdomain

```
افتح: https://store1.dokn.net
متوقع: متجر store1 ✅
```

### 3. Custom Domain (بعد الإضافة)

```
1. Dashboard → Custom Domains
2. أضف: www.test.com
3. أضف CNAME في GoDaddy/Namecheap
4. انتظر 5-10 دقائق
5. اضغط "تحقق"
6. افتح: https://www.test.com
متوقع: المتجر يظهر ✅
```

---

## 📚 التوثيق الكامل

| الملف | الوصف |
|------|-------|
| **`COMPLETE_SYSTEM_GUIDE.md`** | 🌟 الدليل الشامل - ابدأ من هنا! |
| `CLOUDFLARE_CUSTOM_DOMAINS_COMPLETE.md` | شرح تفصيلي للنظام |
| `INSTALLATION_GUIDE.md` | Backend Setup |
| `ENV_SETUP.md` | Environment Variables |
| `PRISMA_SCHEMA_UPDATE.md` | قاعدة البيانات |
| `CLOUDFLARE_WORKER_SETUP.md` | Worker Setup |
| `cloudflare-worker-custom-domains.js` | Worker Code |

---

## 🆘 حل المشاكل السريع

### Backend لا يعمل

```bash
# تحقق من Environment Variables
cat .env | grep CLOUDFLARE

# تحقق من Prisma
npx prisma studio

# تحقق من Logs
fly logs
```

### Frontend لا يعمل

```bash
# تحقق من Build
ng build

# تحقق من Linter
ng lint

# تحقق من Console
# افتح DevTools (F12) → Console
```

### Worker لا يعمل

```
1. Cloudflare Dashboard → Workers → store-router → Logs
2. تحقق من Routes
3. تحقق من DNS Proxy (البرتقالي)
```

### Custom Domain لا يعمل

```bash
# تحقق من CNAME
nslookup www.mystore.com

# يجب أن يعرض: CNAME → dokn.net

# تحقق من Cloudflare Custom Hostnames
# Dashboard → SSL/TLS → Custom Hostnames

# تحقق من Database
# Prisma Studio → CustomDomains → ابحث عن الدومين
```

---

## ✅ Checklist

قبل البدء:

- [ ] ✅ Cloudflare API Token جاهز
- [ ] ✅ Zone ID جاهز
- [ ] ✅ Backend يعمل (Fly.io)
- [ ] ✅ Frontend يعمل (Cloudflare Pages)
- [ ] ✅ قرأت `COMPLETE_SYSTEM_GUIDE.md`

بعد التنفيذ:

- [ ] ✅ Backend deployed
- [ ] ✅ Frontend deployed
- [ ] ✅ Worker working
- [ ] ✅ Cloudflare for SaaS configured
- [ ] ✅ Tested: Main domain
- [ ] ✅ Tested: Subdomain
- [ ] ✅ Tested: Custom domain

---

## 🎉 النتيجة

**الآن لديك:**

✅ نظام Custom Domains أوتوماتيكي بالكامل  
✅ SSL مجاني تلقائي  
✅ واجهة سهلة للتجار  
✅ تعليمات واضحة للـ DNS  
✅ دعم غير محدود للدومينات  

---

## 📞 المساعدة

**إذا واجهت مشكلة:**

1. اقرأ `COMPLETE_SYSTEM_GUIDE.md` → قسم "الأسئلة الشائعة"
2. تحقق من Logs (Backend, Frontend, Worker)
3. تحقق من Cloudflare Dashboard
4. راجع التوثيق المناسب أعلاه

---

🚀 **ابدأ الآن!**
