# 🌐 Vercel Subdomain Setup Guide
## دليل إعداد Subdomains على Vercel

## 📋 **المشكلة:**
Vercel لا يدعم **Wildcard Subdomains** تلقائياً (مثل `*.store-builder.vercel.app`). يجب إضافة كل subdomain يدوياً.

---

## ✅ **الحل: خياران**

### **الخيار 1: إضافة Subdomains يدوياً في Vercel (للتجربة)**

#### **الخطوات:**

1. **اذهب إلى Vercel Dashboard:**
   - افتح مشروعك: https://vercel.com/osamaazbargas-projects/store-builder

2. **اذهب إلى Settings → Domains:**
   - انقر على "Add Domain"

3. **أضف كل subdomain يدوياً:**
   ```
   store1.store-builder-git-dev-osamaazbargas-projects.vercel.app
   store2.store-builder-git-dev-osamaazbargas-projects.vercel.app
   myshop.store-builder-git-dev-osamaazbargas-projects.vercel.app
   ```

4. **Vercel سيعطيك تأكيد:**
   - بعد الإضافة، سيعمل الـ subdomain تلقائياً

#### **العيوب:**
- ❌ يجب إضافة كل متجر جديد يدوياً
- ❌ غير عملي لعدد كبير من المتاجر
- ❌ لا يدعم Dynamic Subdomains

---

### **الخيار 2: استخدام Custom Domain مع Wildcard (الحل الموصى به)**

#### **الخطوات:**

1. **اشترِ Domain خاص (مثل `dokan.shop`):**
   - من Namecheap, GoDaddy, أو Cloudflare

2. **أضف الـ Domain إلى Vercel:**
   - Settings → Domains → Add Domain
   - أدخل: `dokan.shop`

3. **أضف Wildcard Subdomain:**
   - في Vercel Domains، أضف:
   ```
   *.dokan.shop
   ```

4. **أضف DNS Records في مزود الـ Domain:**
   - اذهب إلى DNS Settings في Namecheap/GoDaddy/Cloudflare
   - أضف:
   ```
   Type: CNAME
   Name: *
   Value: cname.vercel-dns.com
   TTL: Auto
   ```

5. **انتظر DNS Propagation (5-48 ساعة):**
   - بعدها، أي subdomain سيعمل تلقائياً:
   ```
   store1.dokan.shop
   store2.dokan.shop
   myshop.dokan.shop
   ```

---

## 🔧 **التغييرات في الكود (تمت بالفعل):**

### **1. Environment Variables:**
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  appUrl: "https://dokan-backend-dev.fly.dev/api",
  platformDomain: "store-builder-git-dev-osamaazbargas-projects.vercel.app",
  // أو بعد شراء Domain:
  // platformDomain: "dokan.shop",
};
```

### **2. DomainService (تم إنشاؤه):**
- `src/app/services/domain.service.ts`
- يكتشف تلقائياً:
  - Main Platform
  - Subdomains
  - Custom Domains
  - Vercel Preview Deployments

### **3. StoreService (تم تحديثه):**
- يستخدم `DomainService` للكشف عن الـ subdomain
- يدعم Vercel domains المعقدة

### **4. Components (تم تحديثها):**
- `AppComponent`
- `PublicHomeComponent`
- `ViewComponent`

---

## 🧪 **كيفية الاختبار:**

### **1. محلياً (Local Testing):**
```bash
# أضف في hosts file:
# Windows: C:\Windows\System32\drivers\etc\hosts
# Mac/Linux: /etc/hosts

127.0.0.1 dokan.local
127.0.0.1 store1.dokan.local
127.0.0.1 store2.dokan.local
```

ثم:
```bash
npm start
```

افتح:
- `http://dokan.local:4200` → Main Platform
- `http://store1.dokan.local:4200` → Store 1
- `http://store2.dokan.local:4200` → Store 2

### **2. على Vercel (Production Testing):**

#### **بدون Custom Domain (الوضع الحالي):**
- Main Platform: `https://store-builder-git-dev-osamaazbargas-projects.vercel.app`
- Store (يجب إضافته يدوياً): `https://store1.store-builder-git-dev-osamaazbargas-projects.vercel.app`

#### **مع Custom Domain (بعد الإعداد):**
- Main Platform: `https://dokan.shop`
- Store 1: `https://store1.dokan.shop`
- Store 2: `https://store2.dokan.shop`
- أي متجر: `https://[store-name].dokan.shop`

---

## 📊 **كيف يعمل الكود الآن:**

### **1. عند فتح الرابط:**
```typescript
// DomainService يحلل الـ URL تلقائياً:

// Case 1: Main Platform
https://store-builder-git-dev-osamaazbargas-projects.vercel.app
→ isMainPlatform: true
→ storeIdentifier: null

// Case 2: Subdomain
https://store1.store-builder-git-dev-osamaazbargas-projects.vercel.app
→ isSubdomain: true
→ storeIdentifier: "store1"

// Case 3: Custom Domain
https://mystore.com
→ isCustomDomain: true
→ storeIdentifier: "mystore.com"
```

### **2. تحميل بيانات المتجر:**
```typescript
// في AppComponent و PublicHomeComponent:
const domainInfo = this.domainService.getDomainInfo();

if (domainInfo.storeIdentifier) {
  this.storeService.loadStoreBySubdomain(domainInfo.storeIdentifier).subscribe({
    next: (store) => {
      // عرض المتجر
      console.log('✅ Store loaded:', store);
    },
    error: (err) => {
      // إعادة توجيه للمنصة الرئيسية
      this.domainService.navigateToMainPlatform();
    }
  });
}
```

---

## 🚀 **الخطوات التالية:**

### **للتجربة السريعة (بدون Custom Domain):**
1. ✅ الكود جاهز
2. 📤 Deploy to Vercel:
   ```bash
   git add .
   git commit -m "feat: Add subdomain support for Vercel"
   git push
   ```
3. 🌐 في Vercel Dashboard، أضف subdomain يدوياً:
   - `store1.store-builder-git-dev-osamaazbargas-projects.vercel.app`
4. 🧪 اختبر الرابط

### **للحل الدائم (مع Custom Domain):**
1. 🛒 اشترِ domain (مثل `dokan.shop`)
2. 🔗 أضفه إلى Vercel
3. 🌐 أضف Wildcard DNS: `*.dokan.shop`
4. ⏳ انتظر DNS Propagation
5. ✅ جميع Subdomains ستعمل تلقائياً!

---

## 🔍 **Debugging:**

### **Console Logs:**
افتح Developer Console في المتصفح، سترى:
```
🌐 Domain Analysis: {
  hostname: "store1.store-builder-git-dev-osamaazbargas-projects.vercel.app",
  parts: ["store1", "store-builder-git-dev-osamaazbargas-projects", "vercel", "app"],
  platformDomain: "store-builder-git-dev-osamaazbargas-projects.vercel.app"
}

🏪 Domain Info: {
  isMainPlatform: false,
  isSubdomain: true,
  isCustomDomain: false,
  storeIdentifier: "store1",
  fullDomain: "store1.store-builder-git-dev-osamaazbargas-projects.vercel.app"
}

✅ Store loaded: { id: 1, name: "Store 1", ... }
```

---

## 📚 **Resources:**
- [Vercel Domains Documentation](https://vercel.com/docs/concepts/projects/domains)
- [Vercel Wildcard Domains](https://vercel.com/docs/concepts/projects/domains/wildcard-domains)
- [Angular Multi-Tenant Architecture](https://angular.io/guide/architecture)

---

## ❓ **أسئلة شائعة:**

### **Q: هل يمكن استخدام Vercel Subdomains مجاناً؟**
A: نعم، لكن يجب إضافة كل subdomain يدوياً. للـ Wildcard، تحتاج Custom Domain.

### **Q: كم يكلف Custom Domain؟**
A: من $10-$15/سنة (Namecheap, GoDaddy)

### **Q: هل يعمل الكود مع أي Domain؟**
A: نعم! فقط غيّر `platformDomain` في `environment.prod.ts`

### **Q: ماذا لو أردت استخدام أكثر من Domain؟**
A: يمكنك إضافة عدة Domains في Vercel، والكود سيكتشفها تلقائياً.

---

## ✅ **الخلاصة:**

| الميزة | Vercel Subdomain (يدوي) | Custom Domain + Wildcard |
|--------|-------------------------|--------------------------|
| **السعر** | مجاني | $10-$15/سنة |
| **Dynamic Subdomains** | ❌ | ✅ |
| **سهولة الإعداد** | ✅ | ⚠️ متوسط |
| **Scalability** | ❌ | ✅ |
| **الموصى به** | للتجربة فقط | للإنتاج |

---

**تم إعداد الكود بالكامل! 🎉**
الآن فقط اختر الخيار المناسب وابدأ الاختبار.
