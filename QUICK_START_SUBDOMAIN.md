# 🚀 Quick Start: Subdomain Setup
## البدء السريع: إعداد Subdomains

## ✅ **ما تم إنجازه:**

### **1. Frontend (Angular) - ✅ جاهز:**
- ✅ `DomainService` - يكتشف Subdomains تلقائياً
- ✅ `StoreService` - محدّث لدعم Vercel domains
- ✅ `AppComponent` - يحمّل المتجر بناءً على Subdomain
- ✅ `PublicHomeComponent` - يعرض المتجر أو المنصة الرئيسية
- ✅ `environment.prod.ts` - محدّث بـ Vercel domain
- ✅ `vercel.json` - محدّث بـ CORS headers

### **2. Documentation - ✅ جاهز:**
- ✅ `VERCEL_SUBDOMAIN_SETUP.md` - دليل كامل لإعداد Vercel
- ✅ `BACKEND_SUBDOMAIN_REQUIREMENTS.md` - متطلبات الباك إند

---

## 🎯 **الخطوات التالية:**

### **الخطوة 1: Deploy الفرونت إند إلى Vercel**

```bash
# 1. Commit التغييرات
git add .
git commit -m "feat: Add subdomain support for multi-tenant stores"

# 2. Push إلى GitHub
git push origin Dev

# 3. Vercel سيقوم بـ Deploy تلقائياً
# أو يمكنك:
vercel --prod
```

### **الخطوة 2: إعداد الباك إند**

#### **أ. أضف API Endpoint:**
```csharp
// في StoreController.cs
[HttpGet("by-subdomain/{subdomain}")]
public async Task<ActionResult<StoreDto>> GetStoreBySubdomain(string subdomain)
{
    var store = await _context.Stores
        .Where(s => s.Slug == subdomain || s.StoreLink == subdomain || s.CustomDomain == subdomain)
        .FirstOrDefaultAsync();
    
    if (store == null)
    {
        return NotFound(new { message = $"Store not found: {subdomain}" });
    }
    
    return Ok(store);
}
```

#### **ب. تحديث CORS:**
```csharp
// في Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVercel", builder =>
    {
        builder
            .WithOrigins(
                "https://store-builder-git-dev-osamaazbargas-projects.vercel.app",
                "https://*.vercel.app"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

app.UseCors("AllowVercel");
```

### **الخطوة 3: اختبار على Vercel**

#### **أ. اختبار Main Platform:**
```
https://store-builder-git-dev-osamaazbargas-projects.vercel.app
```
**المتوقع:** يعرض الصفحة الرئيسية للمنصة

#### **ب. إضافة Subdomain يدوياً في Vercel:**
1. اذهب إلى: https://vercel.com/osamaazbargas-projects/store-builder
2. Settings → Domains
3. Add Domain: `store1.store-builder-git-dev-osamaazbargas-projects.vercel.app`
4. انتظر التفعيل (1-2 دقيقة)

#### **ج. اختبار Subdomain:**
```
https://store1.store-builder-git-dev-osamaazbargas-projects.vercel.app
```
**المتوقع:** 
- يكتشف أن هذا subdomain
- يستدعي API: `/api/Store/by-subdomain/store1`
- يعرض بيانات المتجر

---

## 🧪 **كيفية الاختبار:**

### **1. افتح Developer Console:**
```javascript
// في المتصفح، اضغط F12 ثم Console
// سترى:
🌐 Domain Analysis: {
  hostname: "store1.store-builder-git-dev-osamaazbargas-projects.vercel.app",
  platformDomain: "store-builder-git-dev-osamaazbargas-projects.vercel.app"
}

🏪 Domain Info: {
  isMainPlatform: false,
  isSubdomain: true,
  storeIdentifier: "store1"
}

✅ Store loaded: { id: 1, name: "Store 1", ... }
```

### **2. اختبار API مباشرة:**
```bash
# اختبار من Terminal
curl https://dokan-backend-dev.fly.dev/api/Store/by-subdomain/store1
```

**Response المتوقع:**
```json
{
  "id": 1,
  "storeName": "Store 1",
  "storeLink": "store1",
  "slug": "store1",
  "isActive": true
}
```

---

## 🔧 **Troubleshooting:**

### **Problem 1: Subdomain لا يعمل**
**الحل:**
1. تأكد من إضافة الـ subdomain في Vercel Dashboard
2. انتظر 1-2 دقيقة للتفعيل
3. امسح Cache: Ctrl+Shift+R

### **Problem 2: API يرجع 404**
**الحل:**
1. تأكد من أن الباك إند يحتوي على `/api/Store/by-subdomain/{subdomain}`
2. تأكد من CORS settings
3. اختبر API مباشرة بـ curl

### **Problem 3: CORS Error**
**الحل:**
```csharp
// في الباك إند، أضف:
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

app.UseCors("AllowAll");
```

### **Problem 4: Store Not Found**
**الحل:**
1. تأكد من وجود المتجر في قاعدة البيانات
2. تأكد من أن `Slug` أو `StoreLink` = `store1`
3. اختبر API:
```bash
curl https://dokan-backend-dev.fly.dev/api/Store/by-subdomain/store1
```

---

## 📊 **كيف يعمل النظام:**

```
┌─────────────────────────────────────────────────────────────┐
│  User يفتح: store1.store-builder.vercel.app                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  DomainService يحلل الـ URL:                                │
│  - hostname: "store1.store-builder.vercel.app"              │
│  - platformDomain: "store-builder.vercel.app"               │
│  - isSubdomain: true                                        │
│  - storeIdentifier: "store1"                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  StoreService يستدعي API:                                  │
│  GET /api/Store/by-subdomain/store1                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend يبحث في قاعدة البيانات:                           │
│  SELECT * FROM Stores WHERE Slug = 'store1'                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  إذا وُجد المتجر:                                          │
│  - يعرض صفحة المتجر مع بياناته                             │
│  - يحمّل المنتجات والإعدادات                               │
│                                                             │
│  إذا لم يُوجد:                                             │
│  - يعيد توجيه للمنصة الرئيسية                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 **الخطوات للاختبار الكامل:**

### **1. تحضير البيانات:**
```sql
-- في قاعدة البيانات، أضف متجر تجريبي:
INSERT INTO Stores (UserId, StoreName, StoreLink, Slug, IsActive)
VALUES ('user-id-here', 'Test Store', 'store1', 'store1', 1);
```

### **2. Deploy Frontend:**
```bash
git add .
git commit -m "feat: Add subdomain support"
git push
```

### **3. إضافة Subdomain في Vercel:**
- Domain: `store1.store-builder-git-dev-osamaazbargas-projects.vercel.app`

### **4. اختبار:**
- افتح: `https://store1.store-builder-git-dev-osamaazbargas-projects.vercel.app`
- افتح Console (F12)
- تحقق من Logs

---

## 🚀 **للحل الدائم (Custom Domain):**

### **1. اشترِ Domain:**
- مثل: `dokan.shop` من Namecheap ($10/سنة)

### **2. أضفه في Vercel:**
- Settings → Domains → Add: `dokan.shop`
- Add: `*.dokan.shop` (Wildcard)

### **3. أضف DNS Records:**
```
Type: CNAME
Name: *
Value: cname.vercel-dns.com
TTL: Auto
```

### **4. انتظر DNS Propagation (5-48 ساعة)**

### **5. اختبر:**
```
https://dokan.shop → Main Platform
https://store1.dokan.shop → Store 1
https://store2.dokan.shop → Store 2
https://any-name.dokan.shop → Any Store
```

---

## ✅ **Checklist:**

### **Frontend:**
- [x] DomainService created
- [x] StoreService updated
- [x] Components updated
- [x] Environment configured
- [x] vercel.json updated

### **Backend:**
- [ ] `/api/Store/by-subdomain/{subdomain}` endpoint
- [ ] CORS configured for Vercel
- [ ] Test data in database
- [ ] API tested with curl/Postman

### **Vercel:**
- [ ] Code deployed
- [ ] Subdomain added manually (for testing)
- [ ] OR Custom domain configured (for production)

### **Testing:**
- [ ] Main platform works
- [ ] Subdomain works
- [ ] Store data loads correctly
- [ ] Console logs show correct domain info

---

## 📞 **Need Help?**

### **Check These Files:**
1. `VERCEL_SUBDOMAIN_SETUP.md` - دليل Vercel الكامل
2. `BACKEND_SUBDOMAIN_REQUIREMENTS.md` - متطلبات الباك إند
3. `src/app/services/domain.service.ts` - كود الكشف عن Subdomains

### **Common Commands:**
```bash
# Build locally
npm run build

# Test locally
npm start

# Deploy to Vercel
vercel --prod

# Check logs
vercel logs
```

---

**كل شيء جاهز! 🎉**
الآن فقط:
1. Deploy الفرونت إند
2. أضف API endpoint في الباك إند
3. أضف subdomain في Vercel
4. اختبر!

Good luck! 🚀
