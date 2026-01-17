# 🚀 دليل ربط dokn.net مع Vercel
## خطوات بسيطة وواضحة

**الدومين:** `dokn.net` ✅  
**الوقت المتوقع:** 10-15 دقيقة  
**المستوى:** سهل

---

## 📋 **ما تحتاجه:**

- ✅ دومين `dokn.net` من Cloudflare (تم الشراء ✓)
- ✅ حساب Vercel
- ✅ حساب Cloudflare
- ⏳ 10 دقائق من وقتك

---

## 🎯 **الهدف:**

بعد الانتهاء، سيعمل:
```
✅ https://dokn.net → المنصة الرئيسية
✅ https://store1.dokn.net → متجر 1
✅ https://myshop.dokn.net → متجر myshop
✅ https://أي-اسم.dokn.net → أي متجر
```

---

## 📝 **الخطوات:**

### **الخطوة 1: في Vercel (5 دقائق)**

#### **1.1 افتح مشروعك:**

```
🔗 اذهب إلى:
https://vercel.com/osamaazbargas-projects/store-builder
```

#### **1.2 اذهب إلى Settings:**

```
من القائمة اليسرى:
Settings ⚙️ → Domains 🌐
```

#### **1.3 أضف الدومين الرئيسي:**

```
في خانة "Add Domain"، اكتب:
dokn.net

ثم اضغط: Add →
```

**Vercel سيقول:**
```
✓ Domain added
⚠ Configure DNS to start using this domain
```

#### **1.4 أضف Wildcard Subdomain:**

```
في نفس الصفحة، في خانة "Add Domain"، اكتب:
*.dokn.net

ثم اضغط: Add →
```

**Vercel سيقول:**
```
✓ Domain added
⚠ Configure DNS to start using this domain
```

---

### **الخطوة 2: في Cloudflare (5 دقائق)**

#### **2.1 افتح Cloudflare Dashboard:**

```
🔗 اذهب إلى:
https://dash.cloudflare.com

ثم:
1. Login بحسابك
2. اضغط على دومين: dokn.net
3. من القائمة اليسرى، اضغط: DNS → Records
```

#### **2.2 احذف Records القديمة (إذا وجدت):**

**ابحث عن:**
- `A` record للـ `@` أو `dokn.net`
- `AAAA` record للـ `@` أو `dokn.net`

**إذا وجدت أي منها:**
```
1. اضغط "Edit" بجانب الـ Record
2. اضغط "Delete"
3. اضغط "Confirm"
```

#### **2.3 أضف CNAME للدومين الرئيسي:**

```
اضغط زر: Add record

املأ الحقول:
┌─────────────────────────────────────┐
│ Type:    CNAME                      │
│ Name:    @                          │
│ Target:  cname.vercel-dns.com       │
│ TTL:     Auto                       │
│ Proxy:   🌫️ DNS only (رمادي)      │
└─────────────────────────────────────┘

⚠️ مهم: تأكد أن الغيمة رمادية، ليست برتقالية!

ثم اضغط: Save
```

#### **2.4 أضف CNAME للـ Wildcard:**

```
اضغط زر: Add record مرة أخرى

املأ الحقول:
┌─────────────────────────────────────┐
│ Type:    CNAME                      │
│ Name:    *                          │
│ Target:  cname.vercel-dns.com       │
│ TTL:     Auto                       │
│ Proxy:   🌫️ DNS only (رمادي)      │
└─────────────────────────────────────┘

⚠️ مهم: تأكد أن الغيمة رمادية!

ثم اضغط: Save
```

---

### **الخطوة 3: التحقق (دقيقة واحدة)**

#### **3.1 في Cloudflare، تأكد من:**

يجب أن يكون لديك Record-ين فقط:

```
┌──────┬──────┬────────────────────────┬─────────────┐
│ Type │ Name │ Target                 │ Proxy       │
├──────┼──────┼────────────────────────┼─────────────┤
│ CNAME│ @    │ cname.vercel-dns.com   │ 🌫️ DNS only│
│ CNAME│ *    │ cname.vercel-dns.com   │ 🌫️ DNS only│
└──────┴──────┴────────────────────────┴─────────────┘
```

**⚠️ إذا كانت الغيمة برتقالية:**
```
1. اضغط Edit
2. اضغط على الغيمة البرتقالية
3. ستتحول لرمادي
4. اضغط Save
```

---

### **الخطوة 4: انتظر (5-30 دقيقة)**

#### **4.1 DNS Propagation:**

DNS يحتاج وقت لينتشر في العالم:
```
⚡ عادةً: 5-10 دقائق (Cloudflare سريع)
⏳ أحياناً: حتى 30 دقيقة
🐌 نادراً: حتى 24 ساعة
```

#### **4.2 كيف تتحقق من انتشار DNS:**

**في Windows PowerShell:**
```powershell
# افتح PowerShell واكتب:
nslookup dokn.net
```

**إذا ظهر:**
```
Name:    dokn.net
Address: 76.76.21.21
```
✅ يعني DNS انتشر بنجاح!

**إذا ظهر:**
```
Non-existent domain
```
⏳ يعني لازم تنتظر شوية

---

### **الخطوة 5: اختبار! (دقيقة واحدة)**

#### **5.1 افتح المتصفح:**

```
1. افتح Chrome أو أي متصفح
2. اذهب إلى: https://dokn.net
```

**المتوقع:**
```
✅ إذا ظهرت صفحة المنصة الرئيسية → نجح!
⏳ إذا ظهر "This site can't be reached" → انتظر شوية
❌ إذا ظهر "SSL Error" → انتظر 5 دقائق (Vercel يصدر SSL)
```

#### **5.2 اختبر Subdomain:**

```
افتح: https://test.dokn.net
```

**المتوقع:**
```
✅ إذا عرض رسالة "Store not found" → نجح! (طبيعي، لأنه لا يوجد متجر)
✅ إذا عاد للصفحة الرئيسية → نجح!
⏳ إذا ظهر خطأ → انتظر DNS
```

#### **5.3 تحقق من Console:**

```
1. اضغط F12 (Developer Tools)
2. اذهب إلى Console
3. ابحث عن:

🌐 Domain Analysis: ...
🏪 Domain Info: { storeIdentifier: "test", ... }
```

**إذا ظهرت هذه الرسائل → كل شيء يعمل! 🎉**

---

## ✅ **مؤشرات النجاح:**

### **في Vercel Dashboard:**

```
Domains:
✅ dokn.net         Status: Valid     SSL: Issued
✅ *.dokn.net       Status: Valid     SSL: Issued
```

### **في Cloudflare:**

```
DNS Records:
✅ CNAME @ → cname.vercel-dns.com (رمادي)
✅ CNAME * → cname.vercel-dns.com (رمادي)
```

### **في المتصفح:**

```
✅ https://dokn.net → يفتح بدون أخطاء
✅ قفل أخضر 🔒 في شريط العنوان
✅ Console: Domain Info يظهر صحيح
```

---

## ⚠️ **مشاكل شائعة:**

### **المشكلة 1: "This site can't be reached"**

**السبب:** DNS لم ينتشر بعد

**الحل:**
```
⏳ انتظر 5-10 دقائق
🔄 حاول مرة أخرى
💾 امسح Cache: Ctrl+Shift+R
```

---

### **المشكلة 2: "Your connection is not private"**

**السبب:** SSL Certificate لم يُصدر بعد

**الحل:**
```
⏳ انتظر 5 دقائق (Vercel يصدر SSL تلقائياً)
🔄 Reload الصفحة
```

---

### **المشكلة 3: "Cloudflare 522 Error"**

**السبب:** الغيمة في Cloudflare برتقالية (Proxied)

**الحل:**
```
1. اذهب إلى Cloudflare DNS
2. اضغط Edit على CNAME records
3. اضغط الغيمة البرتقالية → تتحول لرمادي
4. Save
5. انتظر 2-5 دقائق
```

---

### **المشكلة 4: Subdomain لا يعمل**

**الأعراض:**
```
✅ https://dokn.net → يعمل
❌ https://store1.dokn.net → لا يعمل
```

**السبب:** لم تُضف `*.dokn.net` في Vercel أو `*` CNAME في Cloudflare

**الحل:**
```
في Vercel:
→ Settings → Domains → Add: *.dokn.net

في Cloudflare:
→ DNS → Add CNAME: * → cname.vercel-dns.com (رمادي)
```

---

## 🎯 **بعد نجاح الإعداد:**

### **الخطوة التالية:**

#### **1. أضف متجر تجريبي:**

في قاعدة البيانات:
```sql
INSERT INTO Stores (UserId, StoreName, StoreLink, Slug, IsActive)
VALUES ('user-id', 'Test Store', 'test', 'test', 1);
```

ثم افتح: `https://test.dokn.net`

#### **2. أكمل إعداد Backend:**

راجع ملف: `BACKEND_SUBDOMAIN_REQUIREMENTS.md`

#### **3. جرّب إنشاء متجر:**

```
1. سجّل حساب جديد في: https://dokn.net
2. اذهب إلى: Create Store
3. أدخل اسم المتجر: myshop
4. أكمل الخطوات
5. افتح: https://myshop.dokn.net
6. استمتع! 🎉
```

---

## 📊 **ملخص سريع:**

```
الخطوة 1: Vercel
├─ Add domain: dokn.net
└─ Add domain: *.dokn.net

الخطوة 2: Cloudflare
├─ CNAME: @ → cname.vercel-dns.com (رمادي)
└─ CNAME: * → cname.vercel-dns.com (رمادي)

الخطوة 3: انتظر
└─ DNS Propagation (5-30 دقيقة)

الخطوة 4: اختبر
├─ https://dokn.net ✅
└─ https://test.dokn.net ✅
```

---

## 📞 **هل تحتاج مساعدة؟**

### **تحقق من:**
1. ✅ Checklist في بداية هذا الملف
2. ✅ "مشاكل شائعة" أعلاه
3. ✅ Console logs في المتصفح (F12)
4. ✅ DNS بـ `nslookup dokn.net`

### **ملفات مفيدة:**
- `CLOUDFLARE_VERCEL_SETUP.md` - دليل تفصيلي
- `VERCEL_SUBDOMAIN_SETUP.md` - دليل عام لـ Vercel
- `شرح_نظام_المتاجر_المتعددة.md` - شرح النظام

---

## 🎉 **مبروك!**

بعد اكتمال هذه الخطوات، سيكون لديك:

```
✅ نظام Multi-Tenant كامل
✅ Unlimited Subdomains
✅ SSL Certificates تلقائي
✅ قابل للتوسع
✅ احترافي

جاهز لإضافة آلاف المتاجر! 🚀
```

---

**تاريخ الإنشاء:** 2026-01-17  
**الدومين:** dokn.net  
**الحالة:** ⏳ في انتظار إكمال الخطوات  
**الوقت المتوقع:** 10-15 دقيقة
