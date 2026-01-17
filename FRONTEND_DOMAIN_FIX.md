# 🎯 Frontend Domain Fix - إصلاح مشكلة الدومين

## ❌ المشكلة الأصلية

عند الدخول إلى `https://dokn.net/`، كان Frontend يعتبرها **custom domain** بدلاً من **main platform domain**، مما أدى إلى:

```
GET https://dokan-backend-dev.fly.dev/api/Store/by-subdomain/dokn.net 404
❌ Store not found for: dokn.net
```

## 🔍 سبب المشكلة

### 1️⃣ `environment.prod.ts` - قيم خاطئة

```typescript
// ❌ قبل الإصلاح
{
  platformDomain: "https://dokan-backend-dev.fly.dev",  // خطأ!
  appUrl: "https://https://dokan-backend-dev.fly.dev/api",  // https مكرر!
}
```

### 2️⃣ Components تستخدم `dokan.local` hardcoded

- ❌ `view.component.ts`: `const platformDomain = 'dokan.local';`
- ❌ `sidebar-dashboard.component.ts`: `window.location.href = 'http://${...}.dokan.local:4200/'`
- ❌ `app.component.ts`: `const platformDomain = 'dokan.local';`

## ✅ الحل المطبق

### 1️⃣ تصحيح `environment.prod.ts`

```typescript
// ✅ بعد الإصلاح
export const environment = {
    production: true,
    appUrl: "https://dokan-backend-dev.fly.dev/api",  // ✅ إزالة https المكرر
    apiUrl: "https://dokan-backend-dev.fly.dev/api",
    platformDomain: "dokn.net",  // ✅ الدومين الصحيح
    websocketUrl: "https://dokan-backend-dev.fly.dev",
    userKey: 'IdentityAppUser',
    builderApiKey: "7bf8af06aa98438689e78638a7c8f51c",
};
```

### 2️⃣ تحديث `view.component.ts`

```typescript
import { environment } from 'src/environments/environment';  // ✅ إضافة import

// ...

const platformDomain = environment.platformDomain;  // ✅ ديناميكي
const isMainPlatform = hostname === platformDomain || hostname === `www.${platformDomain}`;

console.log('🌐 Domain Analysis:', { hostname, parts, platformDomain, isMainPlatform });

// ✅ الآن لن يحاول تحميل متجر إذا كان على الدومين الرئيسي
if (!isMainPlatform && parts[0] !== 'localhost') {
  // ...
}
```

### 3️⃣ تحديث `sidebar-dashboard.component.ts`

```typescript
import { environment } from 'src/environments/environment';  // ✅ إضافة import

// ...

routerLink(){
  // ✅ ديناميكي - يعمل في Dev و Production
  const protocol = environment.production ? 'https' : 'http';
  const port = environment.production ? '' : ':4200';
  window.location.href = `${protocol}://${this.storeData.link}.${environment.platformDomain}${port}/`;
}
```

### 4️⃣ تحديث `app.component.ts`

```typescript
import { environment } from 'src/environments/environment';  // ✅ إضافة import

// ...

getSubdomain(): string | null {
  const host = window.location.hostname;
  const parts = host.split('.');
  const platformDomain = environment.platformDomain;  // ✅ ديناميكي
  
  if (parts.length >= 3 && host.endsWith(`.${platformDomain}`)) {
    return parts[0];
  }
  
  return null;
}
```

## 🧪 النتيجة المتوقعة

### ✅ الدومين الرئيسي: `https://dokn.net/`

```
🌐 Domain Analysis: {
  hostname: 'dokn.net',
  platformDomain: 'dokn.net',
  isMainPlatform: true  ✅
}

✅ لا يطلب بيانات متجر
✅ يعرض الصفحة الرئيسية للمنصة
```

### ✅ Subdomain: `https://store1.dokn.net/`

```
🌐 Domain Analysis: {
  hostname: 'store1.dokn.net',
  platformDomain: 'dokn.net',
  isMainPlatform: false
}

🔍 Detected subdomain: store1
GET /api/Store/by-subdomain/store1  ✅
✅ Store loaded
```

### ✅ Custom Domain: `https://shop1.local/`

```
🌐 Domain Analysis: {
  hostname: 'shop1.local',
  platformDomain: 'dokn.net',
  isMainPlatform: false
}

🔍 Detected custom domain: shop1.local
GET /api/Store/by-subdomain/shop1.local  ✅
✅ Store loaded
```

## 📦 الخطوات التالية

### 1️⃣ Build & Deploy Frontend على Vercel

```bash
cd C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\SuperEcommere

# Build للإنتاج
npm run build

# Deploy (يجب أن يكون Vercel CLI مثبت)
vercel --prod
```

### 2️⃣ تأكد من Environment Variables في Vercel

في **Vercel Dashboard** → Settings → Environment Variables:

```
PLATFORM_DOMAIN=dokn.net
API_URL=https://dokan-backend-dev.fly.dev/api
```

ثم **Redeploy**.

### 3️⃣ اختبار

1. **Main Platform:**  
   `https://dokn.net/` → ✅ يجب أن يعمل بدون أخطاء

2. **Store Subdomain:**  
   `https://store1.dokn.net/` → ✅ يجب أن يحمل المتجر

3. **Custom Domain:**  
   `https://shop1.local/` (local) → ✅ يجب أن يحمل المتجر

## ✅ الملخص

| الملف | التعديل | الحالة |
|-------|---------|--------|
| `environment.prod.ts` | إصلاح `platformDomain` و `appUrl` | ✅ تم |
| `view.component.ts` | استخدام `environment.platformDomain` | ✅ تم |
| `sidebar-dashboard.component.ts` | استخدام `environment.platformDomain` | ✅ تم |
| `app.component.ts` | استخدام `environment.platformDomain` | ✅ تم |

---

**جاهز للـ Deploy! 🚀**
