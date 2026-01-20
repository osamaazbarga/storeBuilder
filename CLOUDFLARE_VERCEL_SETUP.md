# ☁️ Cloudflare + Vercel Setup Guide

## المشكلة الحالية

```
https://store1.dokn.net/ → ERR_CONNECTION_CLOSED
```

**السبب:** Frontend لم يتم deploy على Vercel، والـ DNS لم يتم ربطه بشكل صحيح.

---

## 🎯 الحل: خطوات الإعداد الكاملة

### **المرحلة 1️⃣: Deploy Frontend على Vercel**

#### خيار A: من خلال Vercel CLI (الأسرع)

```powershell
cd C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\SuperEcommere

# تسجيل الدخول
vercel login

# Deploy للإنتاج
vercel --prod
```

#### خيار B: من خلال Vercel Dashboard

1. افتح: https://vercel.com/dashboard
2. **New Project**
3. **Import Git Repository** (ارفع الكود على GitHub أولاً)
4. **Framework:** Angular
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist/super-ecommere/browser`
7. **Deploy**

---

### **المرحلة 2️⃣: ربط الدومين بـ Vercel**

#### في Vercel Dashboard:

1. اذهب إلى: **Project** → **Settings** → **Domains**
2. أضف الدومين الرئيسي: `dokn.net`
3. Vercel سيعطيك **DNS Records** مثل:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. **أضف Wildcard للـ Subdomains:**

```
Domain: *.dokn.net
```

Vercel سيطلب منك إضافة CNAME record في Cloudflare.

---

### **المرحلة 3️⃣: إعداد Cloudflare DNS**

#### افتح Cloudflare Dashboard → DNS

أضف السجلات التالية:

| Type | Name | Target/Content | Proxy Status | TTL |
|------|------|---------------|--------------|-----|
| **A** | `@` | `76.76.21.21` | 🟠 DNS only | Auto |
| **CNAME** | `www` | `cname.vercel-dns.com` | 🟠 DNS only | Auto |
| **CNAME** | `*` | `cname.vercel-dns.com` | 🟠 DNS only | Auto |

**⚠️ مهم جداً:**
- **Proxy Status** يجب أن يكون **DNS only** (🟠) وليس **Proxied** (🟧)
- لماذا؟ لأن Vercel يحتاج الوصول المباشر للـ DNS

#### Screenshot التوضيحي:

```
┌─────────┬──────┬──────────────────────────┬─────────────┐
│ Type    │ Name │ Target                   │ Proxy       │
├─────────┼──────┼──────────────────────────┼─────────────┤
│ A       │ @    │ 76.76.21.21             │ DNS only 🟠 │
│ CNAME   │ www  │ cname.vercel-dns.com    │ DNS only 🟠 │
│ CNAME   │ *    │ cname.vercel-dns.com    │ DNS only 🟠 │
└─────────┴──────┴──────────────────────────┴─────────────┘
```

---

### **المرحلة 4️⃣: التحقق من Wildcard Subdomain في Vercel**

1. في Vercel → **Domains** tab
2. أضف: `*.dokn.net`
3. Vercel سيتحقق من DNS تلقائياً
4. عندما يظهر ✅ **Valid Configuration** → جاهز!

---

### **المرحلة 5️⃣: إضافة Environment Variables في Vercel**

في **Vercel** → Project Settings → **Environment Variables**:

```
PLATFORM_DOMAIN=dokn.net
```

ثم **Redeploy** من:  
**Deployments** → أحدث deployment → **⋯ (ثلاث نقاط)** → **Redeploy**

---

## 🧪 الاختبار

### 1️⃣ افحص DNS Propagation

```bash
# من Command Prompt أو PowerShell:
nslookup dokn.net
nslookup store1.dokn.net
```

**النتيجة المتوقعة:**
```
dokn.net → 76.76.21.21
store1.dokn.net → CNAME to cname.vercel-dns.com → 76.76.21.21
```

### 2️⃣ افحص الدومين الرئيسي

```
✅ https://dokn.net/
```

**يجب أن يفتح الصفحة الرئيسية للمنصة**

### 3️⃣ افحص Subdomain

```
✅ https://store1.dokn.net/
```

**يجب أن يحمل بيانات المتجر (بعد إضافة `store1` للداتا بيس)**

---

## 🐛 استكشاف الأخطاء

### ❌ المشكلة: `ERR_CONNECTION_CLOSED`

**السبب:** Frontend لم يتم deploy على Vercel.

**الحل:**
1. Deploy Frontend على Vercel (المرحلة 1️⃣)
2. أضف الدومين في Vercel (المرحلة 2️⃣)

---

### ❌ المشكلة: `Domain not verified` في Vercel

**السبب:** DNS Records في Cloudflare غير صحيحة.

**الحل:**
1. تأكد من إضافة CNAME records في Cloudflare
2. تأكد من أن **Proxy Status** هو **DNS only** (🟠)
3. انتظر 5-10 دقائق لـ DNS propagation

---

### ❌ المشكلة: `https://store1.dokn.net/` يعطي 404

**السبب 1:** المتجر `store1` غير موجود في قاعدة البيانات.

**الحل:**
```powershell
# شغّل SQL script لإنشاء المتجر
psql "postgresql://postgres.vatshsvaluqrkkhjabpz:315454199Os!@aws-1-ap-south-1.pooler.supabase.com:5432/postgres" -f setup_store1_dokn.sql
```

**السبب 2:** Backend لا يتعرف على الدومين.

**الحل:** تحقق من Fly.io secrets:
```powershell
flyctl secrets list -a dokan-backend-dev

# يجب أن يحتوي على:
# PLATFORM_DOMAIN=dokn.net
```

---

### ❌ المشكلة: CORS Error

**السبب:** Backend لا يسمح بالدومين.

**الحل:** Backend settings موجودة بالفعل في `src/main.ts` وتسمح بـ `*.dokn.net` ✅

---

## 📊 الخطوات بالترتيب (Quick Checklist)

- [ ] 1. Deploy Frontend على Vercel
- [ ] 2. في Vercel: أضف `dokn.net` domain
- [ ] 3. في Vercel: أضف `*.dokn.net` domain
- [ ] 4. في Cloudflare: أضف A record `@` → `76.76.21.21` (DNS only)
- [ ] 5. في Cloudflare: أضف CNAME `www` → `cname.vercel-dns.com` (DNS only)
- [ ] 6. في Cloudflare: أضف CNAME `*` → `cname.vercel-dns.com` (DNS only)
- [ ] 7. في Vercel: أضف Environment Variable `PLATFORM_DOMAIN=dokn.net`
- [ ] 8. في Vercel: Redeploy
- [ ] 9. انتظر 5-10 دقائق لـ DNS propagation
- [ ] 10. افحص `https://dokn.net/`
- [ ] 11. شغّل SQL لإنشاء متجر `store1`
- [ ] 12. افحص `https://store1.dokn.net/`

---

## 🎯 بعد الانتهاء

عندما تكمل الخطوات، أرسل لي:

1. Screenshot من Vercel Domains page
2. Screenshot من Cloudflare DNS Records
3. نتيجة `nslookup dokn.net` و `nslookup store1.dokn.net`
4. أي أخطاء في Console

وسأساعدك في حل أي مشاكل! 😊

---

## 📚 مراجع إضافية

- [Vercel Custom Domains Guide](https://vercel.com/docs/custom-domains)
- [Vercel Wildcard Domains](https://vercel.com/docs/custom-domains#wildcard-domains)
- [Cloudflare DNS Setup](https://developers.cloudflare.com/dns/)

---

**جاهز للبدء! 🚀**
