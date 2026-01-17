# ☁️ دليل ربط Cloudflare مع Vercel
## إعداد dokn.net مع Wildcard Subdomains

**الدومين:** `dokn.net`  
**التاريخ:** 2026-01-17  
**الحالة:** ⏳ قيد الإعداد

---

## ✅ **ما تم إنجازه:**

- ✅ شراء الدومين: `dokn.net` من Cloudflare
- ✅ تحديث الكود: `environment.prod.ts`
- ✅ Push إلى GitHub
- ✅ Vercel يقوم بـ Deploy الآن

---

## 🔧 **الخطوات المتبقية:**

### **الخطوة 1: إضافة الدومين في Vercel**

#### **أ. الدومين الرئيسي (dokn.net):**

1. اذهب إلى:
   ```
   https://vercel.com/osamaazbargas-projects/store-builder
   ```

2. من القائمة اليسرى، اضغط **Settings**

3. اضغط **Domains**

4. في خانة "Add Domain"، أدخل:
   ```
   dokn.net
   ```

5. اضغط **Add**

6. Vercel سيعطيك خيارين:

   **Option A: Using Vercel Nameservers (الأسهل)**
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

   **Option B: Using CNAME (موصى به لـ Cloudflare)**
   ```
   Type: CNAME
   Name: @
   Target: cname.vercel-dns.com
   ```

**اختر Option B (CNAME)** لأننا نستخدم Cloudflare

---

#### **ب. Wildcard Subdomain (*.dokn.net):**

1. في نفس صفحة Domains
2. اضغط **Add Domain** مرة أخرى
3. أدخل:
   ```
   *.dokn.net
   ```
4. اضغط **Add**

5. Vercel سيطلب منك إضافة:
   ```
   Type: CNAME
   Name: *
   Target: cname.vercel-dns.com
   ```

---

### **الخطوة 2: إعداد DNS في Cloudflare**

#### **أ. اذهب إلى Cloudflare Dashboard:**

1. افتح: https://dash.cloudflare.com
2. Login بحسابك
3. اضغط على دومين **dokn.net**
4. من القائمة اليسرى، اضغط **DNS** → **Records**

---

#### **ب. أضف CNAME للدومين الرئيسي:**

1. اضغط **Add record**

2. املأ الحقول:
   ```
   Type: CNAME
   Name: @ (أو dokn.net)
   Target: cname.vercel-dns.com
   TTL: Auto
   Proxy status: DNS only (الغيمة رمادية 🌫️)
   ```

3. **⚠️ مهم جداً:**
   - تأكد أن **Proxy status** = **DNS only**
   - الغيمة يجب أن تكون **رمادية** (ليست برتقالية)
   - إذا كانت برتقالية، اضغط عليها لتحويلها لرمادي

4. اضغط **Save**

---

#### **ج. أضف CNAME للـ Wildcard:**

1. اضغط **Add record** مرة أخرى

2. املأ الحقول:
   ```
   Type: CNAME
   Name: *
   Target: cname.vercel-dns.com
   TTL: Auto
   Proxy status: DNS only (الغيمة رمادية 🌫️)
   ```

3. **⚠️ مهم جداً:**
   - الغيمة يجب أن تكون **رمادية**
   - **NOT** برتقالية (Proxied)

4. اضغط **Save**

---

#### **د. احذف Records القديمة (إذا وجدت):**

ابحث عن أي من هذه واحذفها:

**Records للحذف:**
- ❌ `A` record للـ `@` أو `dokn.net` (عادةً Cloudflare parking page)
- ❌ `AAAA` record للـ `@` أو `dokn.net` (IPv6)
- ❌ أي `CNAME` قديم للـ `@` أو `*`

**كيف تحذف:**
- اضغط **Edit** بجانب الـ Record
- اضغط **Delete**
- اضغط **Confirm**

---

### **الخطوة 3: التحقق من الإعدادات في Cloudflare**

#### **التحقق النهائي - DNS Records يجب أن تكون:**

```
┌──────┬──────┬─────────────────────────┬─────────────┬──────┐
│ Type │ Name │ Target                  │ Proxy       │ TTL  │
├──────┼──────┼─────────────────────────┼─────────────┼──────┤
│ CNAME│ @    │ cname.vercel-dns.com    │ DNS only 🌫️ │ Auto │
│ CNAME│ *    │ cname.vercel-dns.com    │ DNS only 🌫️ │ Auto │
└──────┴──────┴─────────────────────────┴─────────────┴──────┘
```

**⚠️ إذا كانت الغيمة برتقالية (Proxied):**
1. اضغط **Edit** على الـ Record
2. اضغط على الغيمة البرتقالية لتحويلها لرمادي
3. اضغط **Save**

---

### **الخطوة 4: انتظر DNS Propagation**

#### **الوقت المتوقع:**
- ⚡ **5-10 دقائق:** عادةً (Cloudflare سريع جداً)
- ⏳ **حتى 24 ساعة:** في حالات نادرة

#### **التحقق من DNS:**

**Windows PowerShell:**
```powershell
# افتح PowerShell واكتب:
nslookup dokn.net
nslookup store1.dokn.net
```

**Expected Output (بعد النشر):**
```
Name:    dokn.net
Address: 76.76.21.21 (Vercel IP)

Name:    store1.dokn.net
Address: 76.76.21.21 (Vercel IP)
```

**أو استخدم موقع:**
- https://dnschecker.org
- أدخل: `dokn.net`
- اضغط **Search**
- تأكد أن يرجع `CNAME: cname.vercel-dns.com`

---

### **الخطوة 5: اختبار الموقع!**

بعد DNS Propagation، افتح:

#### **✅ المتوقع:**

```
1. https://dokn.net
   → يعرض المنصة الرئيسية
   → صفحة الـ Home
   → قائمة المتاجر

2. https://store1.dokn.net
   → يبحث عن متجر باسم "store1"
   → إذا وُجد: يعرض المتجر
   → إذا لم يُوجد: يعيد توجيه لـ https://dokn.net

3. https://any-name.dokn.net
   → يبحث عن متجر باسم "any-name"
   → يعمل مع أي اسم!
```

#### **🔍 التحقق في Console:**

1. افتح الموقع: `https://store1.dokn.net`
2. اضغط `F12` لفتح Developer Tools
3. اذهب إلى **Console**
4. سترى:

```javascript
🌐 Domain Analysis: {
  hostname: "store1.dokn.net",
  parts: ["store1", "dokn", "net"],
  platformDomain: "dokn.net"
}

🏪 Domain Info: {
  isMainPlatform: false,
  isSubdomain: true,
  isCustomDomain: false,
  storeIdentifier: "store1",
  fullDomain: "store1.dokn.net"
}

📡 API Call: GET /api/Store/by-subdomain/store1

✅ Store loaded: { ... } // إذا وُجد المتجر
// أو
❌ Store not found: store1 // إذا لم يُوجد
```

---

## ⚠️ **مشاكل شائعة وحلولها:**

### **Problem 1: SSL Certificate Error**

**الأعراض:**
```
Your connection is not private
NET::ERR_CERT_COMMON_NAME_INVALID
```

**السبب:**
- Vercel يحتاج وقت لإصدار SSL Certificate (Let's Encrypt)

**الحل:**
- انتظر 5-10 دقائق
- امسح Cache: `Ctrl+Shift+R`
- حاول مرة أخرى

---

### **Problem 2: Cloudflare 522 Error**

**الأعراض:**
```
Error 522: Connection timed out
```

**السبب:**
- الغيمة في Cloudflare **Proxied** (برتقالية) بدلاً من **DNS only** (رمادية)

**الحل:**
1. اذهب إلى Cloudflare DNS Settings
2. اضغط **Edit** على CNAME records
3. اضغط الغيمة البرتقالية لتحويلها لرمادي (DNS only)
4. اضغط **Save**
5. انتظر 2-5 دقائق

---

### **Problem 3: Domain Not Found في Vercel**

**الأعراض:**
```
404: This domain is not registered on Vercel
```

**السبب:**
- لم تُضف الدومين في Vercel بعد

**الحل:**
1. اذهب إلى Vercel Dashboard
2. Settings → Domains
3. Add Domain: `dokn.net` و `*.dokn.net`

---

### **Problem 4: Subdomain لا يعمل**

**الأعراض:**
- `https://dokn.net` يعمل ✅
- `https://store1.dokn.net` لا يعمل ❌

**السبب:**
- لم تُضف `*.dokn.net` في Vercel
- أو لم تُضف `*` CNAME في Cloudflare

**الحل:**
1. **في Vercel:**
   - Settings → Domains → Add: `*.dokn.net`

2. **في Cloudflare:**
   - DNS → Add record:
   ```
   Type: CNAME
   Name: *
   Target: cname.vercel-dns.com
   Proxy: DNS only (رمادي)
   ```

---

### **Problem 5: DNS لم يتحدث بعد**

**الأعراض:**
```
nslookup dokn.net
Server: UnKnown
Address: ...
Non-existent domain
```

**الحل:**
- انتظر 5-30 دقيقة
- امسح DNS Cache:
```powershell
# في PowerShell (Run as Administrator):
ipconfig /flushdns
```

---

## 🔒 **إعدادات أمان إضافية في Cloudflare (اختياري):**

### **1. Always Use HTTPS:**

1. في Cloudflare Dashboard
2. اذهب إلى **SSL/TLS** → **Edge Certificates**
3. فعّل **Always Use HTTPS**
4. فعّل **Automatic HTTPS Rewrites**

### **2. Minimum TLS Version:**

1. في **SSL/TLS** → **Edge Certificates**
2. اضبط **Minimum TLS Version** على **TLS 1.2**

### **3. HSTS (اختياري - متقدم):**

1. في **SSL/TLS** → **Edge Certificates**
2. فعّل **HTTP Strict Transport Security (HSTS)**
3. اضبط:
   - Max Age: 6 months
   - Include subdomains: ✅
   - Preload: ✅

---

## 📊 **التحقق النهائي - Checklist:**

### **في Vercel:**
- [ ] تم إضافة `dokn.net` في Domains
- [ ] تم إضافة `*.dokn.net` في Domains
- [ ] Status للـ domains = **Valid** (أخضر)
- [ ] SSL Certificate = **Issued**

### **في Cloudflare:**
- [ ] CNAME للـ `@` → `cname.vercel-dns.com` (رمادي)
- [ ] CNAME للـ `*` → `cname.vercel-dns.com` (رمادي)
- [ ] لا توجد A Records قديمة
- [ ] لا توجد AAAA Records قديمة

### **في الكود:**
- [ ] `environment.prod.ts` → `platformDomain: "dokn.net"`
- [ ] تم Push إلى GitHub
- [ ] Vercel تم الـ Deploy بنجاح

### **الاختبار:**
- [ ] `https://dokn.net` يعمل
- [ ] `https://store1.dokn.net` يعمل (أو يعيد توجيه)
- [ ] Console logs تظهر `storeIdentifier` صحيح
- [ ] SSL Certificate يعمل (قفل أخضر 🔒)

---

## 🎯 **الخطوات التالية (بعد نجاح DNS):**

### **1. إضافة متجر تجريبي:**

في قاعدة البيانات، أضف:
```sql
INSERT INTO Stores (UserId, StoreName, StoreLink, Slug, IsActive)
VALUES ('your-user-id', 'Test Store', 'test', 'test', 1);
```

ثم جرّب: `https://test.dokn.net`

### **2. إعداد Backend API:**

راجع: `BACKEND_SUBDOMAIN_REQUIREMENTS.md`

أضف endpoint:
```csharp
[HttpGet("by-subdomain/{subdomain}")]
public async Task<ActionResult<StoreDto>> GetStoreBySubdomain(string subdomain)
{
    // ... implementation
}
```

### **3. اختبار كامل:**

1. سجّل حساب جديد
2. أنشئ متجر باسم "myshop"
3. افتح: `https://myshop.dokn.net`
4. تحقق من عرض المتجر

---

## 🚀 **النتيجة النهائية:**

```
✅ https://dokn.net
   → المنصة الرئيسية
   → نموذج التسجيل
   → قائمة المتاجر

✅ https://store1.dokn.net
✅ https://myshop.dokn.net
✅ https://any-name.dokn.net
   → أي متجر
   → تلقائياً
   → بدون إعداد يدوي!
```

---

## 📞 **الدعم:**

### **إذا واجهت مشكلة:**

1. تحقق من الـ Checklist أعلاه
2. اقرأ "مشاكل شائعة وحلولها"
3. تحقق من Console logs في المتصفح
4. تحقق من DNS بـ `nslookup`

### **Resources:**
- [Vercel Domains Documentation](https://vercel.com/docs/concepts/projects/domains)
- [Cloudflare DNS Documentation](https://developers.cloudflare.com/dns/)
- [DNS Checker Tool](https://dnschecker.org)

---

**تم بنجاح! 🎉**

الآن فقط أكمل الخطوات في Vercel و Cloudflare، وانتظر DNS Propagation!

---

**آخر تحديث:** 2026-01-17  
**الدومين:** dokn.net  
**الحالة:** ⏳ في انتظار إعداد DNS
