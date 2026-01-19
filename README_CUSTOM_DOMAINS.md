# 🌐 نظام Custom Domains الأوتوماتيكي - Cloudflare

## 📋 نظرة عامة

نظام متكامل يتيح للتجار ربط دوميناتهم الخاصة بمتاجرهم **بشكل أوتوماتيكي 100%** عبر Cloudflare for SaaS.

### ✨ المميزات

- ✅ **أوتوماتيكي بالكامل** - لا حاجة للتدخل اليدوي
- ✅ **SSL مجاني** - شهادات SSL تُصدر تلقائياً من Cloudflare
- ✅ **واجهة سهلة** - لوحة تحكم بسيطة للتجار
- ✅ **تعليمات واضحة** - إرشادات خطوة بخطوة للـ DNS
- ✅ **دعم متعدد اللغات** - عربي، إنجليزي، عبري
- ✅ **قابل للتوسع** - يدعم آلاف الدومينات

---

## 🗂️ هيكل المشروع

### 📦 Backend (NestJS + Prisma)

```
C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\dokan-backend\
├── src/
│   ├── cloudflare/
│   │   ├── cloudflare.service.ts       ← Cloudflare API Integration
│   │   └── cloudflare.module.ts
│   └── custom-domains/
│       ├── custom-domains.service.ts   ← Business Logic
│       ├── custom-domains.controller.ts ← API Endpoints
│       └── custom-domains.module.ts
├── INSTALLATION_GUIDE.md               ← دليل التثبيت الكامل
├── ENV_SETUP.md                        ← إعداد Environment Variables
└── PRISMA_SCHEMA_UPDATE.md             ← تحديثات قاعدة البيانات
```

### 🎨 Frontend (Angular)

```
C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\SuperEcommere\
├── src/app/
│   ├── services/
│   │   └── custom-domains.service.ts   ← API Service
│   └── private/components/custom-domains/
│       ├── custom-domains-new.component.ts    ← Component Logic
│       ├── custom-domains-new.component.html  ← UI Template
│       └── custom-domains-new.component.scss  ← Styles
└── src/assets/i18n/
    ├── ar/custom-domains.json          ← Arabic Translations
    ├── en/custom-domains.json          ← English Translations
    └── he/custom-domains.json          ← Hebrew Translations
```

### ⚡ Cloudflare Worker

```
cloudflare-worker-custom-domains.js     ← Multi-Tenant Router
CLOUDFLARE_WORKER_SETUP.md              ← دليل إعداد Worker
```

### 📚 التوثيق

```
COMPLETE_SYSTEM_GUIDE.md                ← 🌟 الدليل الشامل الكامل
QUICK_START_CUSTOM_DOMAINS.md          ← ⚡ البداية السريعة
CLOUDFLARE_CUSTOM_DOMAINS_COMPLETE.md   ← شرح تفصيلي
README_CUSTOM_DOMAINS.md                ← هذا الملف
```

---

## 🚀 البداية السريعة

### الخطوة 1: اقرأ التوثيق

```
ابدأ من هنا: QUICK_START_CUSTOM_DOMAINS.md
```

### الخطوة 2: Backend Setup (30 دقيقة)

```bash
cd dokan-backend
npm install axios
# اتبع: INSTALLATION_GUIDE.md
```

### الخطوة 3: Frontend Setup (20 دقيقة)

```bash
cd SuperEcommere
# أضف Route و Sidebar
# اتبع: QUICK_START_CUSTOM_DOMAINS.md
```

### الخطوة 4: Worker Setup (15 دقيقة)

```
Cloudflare Dashboard → Workers → Create
# اتبع: CLOUDFLARE_WORKER_SETUP.md
```

### الخطوة 5: Cloudflare for SaaS (5 دقائق)

```
Cloudflare → SSL/TLS → Custom Hostnames
# أضف Fallback Origin
```

---

## 🎯 الـ API Endpoints

| Method | Endpoint | Auth | الوصف |
|--------|----------|------|-------|
| `POST` | `/api/custom-domains` | ✅ | إضافة دومين جديد |
| `DELETE` | `/api/custom-domains/:id` | ✅ | حذف دومين |
| `POST` | `/api/custom-domains/:id/verify` | ✅ | التحقق من حالة الدومين |
| `GET` | `/api/custom-domains/store/:storeId` | ✅ | جلب جميع دومينات المتجر |
| `GET` | `/api/custom-domains/lookup/:domain` | ❌ | البحث عن متجر بالدومين (عام) |
| `GET` | `/api/stores/by-slug/:slug` | ❌ | البحث بـ Slug (للـ Subdomains) |
| `/api/stores/by-domain/:domain` | ❌ | البحث بـ Custom Domain |

---

## 🏗️ Architecture

```
Customer
    ↓
www.mystore.com (CNAME → dokn.net)
    ↓
Cloudflare DNS
    ↓
Cloudflare Worker (store-router)
    ↓
Checks:
  • dokn.net? → Main site
  • *.dokn.net? → Backend (by-slug)
  • Other? → Backend (by-domain)
    ↓
Backend API (dokan-backend-dev.fly.dev)
    ↓
Returns store data
    ↓
Frontend (storebuilder-4qs.pages.dev)
    ↓
Angular App displays store
    ↓
Customer sees their store! ✅
```

---

## 📊 User Flow (للتاجر)

```
1. يشتري دومين (GoDaddy/Namecheap)
2. يسجل دخول لـ https://dokn.net/dashboard
3. يذهب لـ "الدومينات المخصصة"
4. يدخل دومينه: www.mystore.com
5. يضغط "إضافة"
   → النظام يضيف في Cloudflare تلقائياً
   → يحفظ في قاعدة البيانات
6. تظهر تعليمات DNS:
   • Type: CNAME
   • Name: www
   • Value: dokn.net
7. يضيف CNAME في موقع دومينه
8. يضغط "تحقق"
9. النظام يفحص Cloudflare
10. ✅ Status: Active
11. يزور www.mystore.com → متجره يظهر! 🎉
```

---

## 🧪 الاختبار

### Test 1: Main Domain

```bash
curl https://dokn.net
# متوقع: الصفحة الرئيسية
```

### Test 2: Subdomain

```bash
curl https://store1.dokn.net
# متوقع: متجر store1
```

### Test 3: Custom Domain (بعد الإعداد)

```bash
curl https://www.mystore.com
# متوقع: المتجر المرتبط بهذا الدومين
```

---

## 🛠️ التقنيات المستخدمة

| المكون | التقنية |
|--------|---------|
| **Backend** | NestJS, Prisma, PostgreSQL, Axios |
| **Frontend** | Angular 18, SCSS, TypeScript, RxJS |
| **Database** | PostgreSQL (Fly.io) |
| **CDN** | Cloudflare Pages |
| **Worker** | Cloudflare Workers |
| **DNS** | Cloudflare DNS |
| **SSL** | Cloudflare for SaaS (Free SSL) |
| **API** | Cloudflare Custom Hostnames API |
| **Hosting** | Fly.io (Backend), Cloudflare Pages (Frontend) |

---

## 📦 Environment Variables

### Backend (.env)

```env
# Cloudflare
CLOUDFLARE_API_TOKEN="your_token"
CLOUDFLARE_ZONE_ID="your_zone_id"
CLOUDFLARE_ACCOUNT_ID="your_account_id"

# Database
DATABASE_URL="postgresql://..."

# App
NODE_ENV="production"
PORT=3000
JWT_SECRET="..."
```

### Frontend (environment.prod.ts)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://dokan-backend-dev.fly.dev',
  platformDomain: 'dokn.net',
};
```

---

## 📚 التوثيق التفصيلي

### 🌟 الدليل الرئيسي

- **`COMPLETE_SYSTEM_GUIDE.md`** - الدليل الشامل الكامل (ابدأ من هنا!)

### ⚡ الأدلة السريعة

- **`QUICK_START_CUSTOM_DOMAINS.md`** - البداية السريعة (1 ساعة)

### 🔧 أدلة التثبيت

- **`INSTALLATION_GUIDE.md`** - Backend Setup (خطوة بخطوة)
- **`ENV_SETUP.md`** - Environment Variables
- **`PRISMA_SCHEMA_UPDATE.md`** - قاعدة البيانات
- **`CLOUDFLARE_WORKER_SETUP.md`** - Worker Setup

### 📖 الشروحات التفصيلية

- **`CLOUDFLARE_CUSTOM_DOMAINS_COMPLETE.md`** - شرح تفصيلي للنظام بالكامل

---

## 🆘 استكشاف الأخطاء

### Backend Issues

```bash
# تحقق من Logs
fly logs -a dokan-backend-dev

# تحقق من Database
npx prisma studio

# تحقق من Environment Variables
cat .env | grep CLOUDFLARE
```

### Frontend Issues

```bash
# تحقق من Build
ng build --configuration production

# تحقق من Console
# F12 → Console (في المتصفح)
```

### Worker Issues

```
Cloudflare Dashboard → Workers → store-router → Logs
```

### Custom Domain Issues

```bash
# تحقق من CNAME
nslookup www.mystore.com

# تحقق من Cloudflare Custom Hostnames
# Dashboard → SSL/TLS → Custom Hostnames
```

---

## ✅ Checklist

### قبل البدء

- [ ] Cloudflare Account جاهز
- [ ] Cloudflare API Token جاهز
- [ ] Zone ID جاهز
- [ ] Backend يعمل (Fly.io)
- [ ] Frontend يعمل (Cloudflare Pages)

### بعد التنفيذ

- [ ] Backend deployed & tested
- [ ] Frontend deployed & tested
- [ ] Worker deployed & tested
- [ ] Cloudflare for SaaS configured
- [ ] Main domain works
- [ ] Subdomain works
- [ ] Custom domain works (after adding CNAME)

---

## 🎉 النتيجة

**الآن لديك نظام متكامل يتيح:**

✅ ربط دومينات مخصصة تلقائياً  
✅ SSL مجاني لكل دومين  
✅ واجهة سهلة الاستخدام  
✅ تعليمات واضحة للتجار  
✅ دعم غير محدود للدومينات  
✅ أداء عالي عبر Cloudflare Edge  

---

## 📞 الدعم

**إذا واجهت مشكلة:**

1. اقرأ `COMPLETE_SYSTEM_GUIDE.md` → "الأسئلة الشائعة"
2. راجع التوثيق المناسب أعلاه
3. تحقق من Logs (Backend/Frontend/Worker)
4. تحقق من Cloudflare Dashboard

---

## 🔗 روابط مفيدة

- [Cloudflare for SaaS Documentation](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [NestJS Documentation](https://nestjs.com/)
- [Angular Documentation](https://angular.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)

---

🚀 **ابدأ الآن من: `QUICK_START_CUSTOM_DOMAINS.md`**
