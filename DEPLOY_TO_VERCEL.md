# 🚀 Deploy Frontend to Vercel - خطوات النشر

## ✅ التعديلات المطبقة

تم إصلاح مشكلة الدومين بنجاح! 🎉

- ✅ `environment.prod.ts` - تم تصحيح `platformDomain` و `appUrl`
- ✅ `view.component.ts` - يستخدم `environment.platformDomain`
- ✅ `sidebar-dashboard.component.ts` - يستخدم `environment.platformDomain`
- ✅ `app.component.ts` - يستخدم `environment.platformDomain`
- ✅ Build نجح بدون أخطاء

---

## 📦 الخطوات للنشر على Vercel

### **الطريقة 1: من خلال Vercel CLI (الأسرع)**

```powershell
# 1. الدخول إلى مجلد Frontend
cd C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\SuperEcommere

# 2. تسجيل الدخول إلى Vercel (إذا لم تكن مسجل)
vercel login

# 3. Deploy للإنتاج
vercel --prod
```

**ملاحظة:** اتبع التعليمات التفاعلية إذا كانت أول مرة.

---

### **الطريقة 2: من خلال Vercel Dashboard (الموصى بها)**

#### 1️⃣ رفع الكود إلى GitHub

```powershell
cd C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\SuperEcommere

git add .
git commit -m "Fix: Update platform domain to dokn.net in production environment"
git push
```

#### 2️⃣ ربط Repo بـ Vercel

1. اذهب إلى: https://vercel.com/dashboard
2. **Add New Project**
3. اختر **Import Git Repository**
4. اختر الـ Repo الخاص بالـ Frontend
5. **Configure Project:**
   - **Framework Preset:** Angular
   - **Root Directory:** `./` (أو المجلد إذا كان داخل repo أكبر)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/super-ecommere/browser`

#### 3️⃣ إضافة Environment Variables

في **Vercel Dashboard** → Project Settings → **Environment Variables**، أضف:

| Key | Value | Environments |
|-----|-------|--------------|
| `PLATFORM_DOMAIN` | `dokn.net` | Production |
| `NEXT_PUBLIC_API_URL` | `https://dokan-backend-dev.fly.dev/api` | Production |

**⚠️ هام:** بعد إضافة Environment Variables، اضغط **Redeploy**.

#### 4️⃣ إعدادات الدومين

1. في Vercel → Project → **Domains**
2. أضف الدومين الرئيسي: `dokn.net`
3. اتبع التعليمات لتحديث DNS Records عند مزود الدومين:

```
Type: A
Name: @
Value: 76.76.21.21 (Vercel IP)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. **إضافة Wildcard Subdomain** لـ Subdomains (`*.dokn.net`):

```
Type: A
Name: *
Value: 76.76.21.21

Type: CNAME
Name: *.dokn
Value: cname.vercel-dns.com
```

**⚠️ ملاحظة:** بعض مزودي DNS لا يدعمون wildcard `CNAME`، استخدم `A` record بدلاً منه.

---

## 🧪 الاختبار بعد Deploy

### 1️⃣ الدومين الرئيسي

```
✅ https://dokn.net/
```

**النتيجة المتوقعة:**
- ✅ الصفحة الرئيسية للمنصة
- ✅ لا توجد أخطاء في Console
- ✅ لا يحاول تحميل بيانات متجر

### 2️⃣ Subdomain للمتجر

```
✅ https://store1.dokn.net/
```

**النتيجة المتوقعة:**
- ✅ يحمل بيانات المتجر `store1`
- ✅ يعرض محتوى المتجر
- ✅ Console يظهر: `✅ Store loaded`

### 3️⃣ Custom Domain (إذا كان موجود)

```
✅ https://shop1.local/ (Local)
✅ https://mystore.com/ (Production)
```

**النتيجة المتوقعة:**
- ✅ يحمل بيانات المتجر المرتبط بهذا الدومين
- ✅ يعرض محتوى المتجر

---

## 🔧 استكشاف الأخطاء

### ❌ المشكلة: لا يزال يظهر `❌ Store not found for: dokn.net`

**الحل:**
1. تأكد من أن Environment Variables تم حفظها في Vercel
2. تأكد من عمل **Redeploy** بعد إضافة Environment Variables
3. افحص في **Vercel Logs** → Runtime Logs

### ❌ المشكلة: `https://store1.dokn.net/` لا يعمل

**الحل:**
1. تأكد من أن Wildcard Subdomain (`*.dokn.net`) مُضاف في DNS
2. تأكد من أن المتجر `store1` موجود في قاعدة البيانات (راجع SQL script)
3. افحص Backend logs: `flyctl logs -a dokan-backend-dev`

### ❌ المشكلة: CORS Error

**الحل:**
تأكد من إعدادات CORS في Backend (`src/main.ts`):

```typescript
app.enableCors({
  origin: [
    'https://dokn.net',
    'https://*.dokn.net',
    'http://localhost:4200',
  ],
  credentials: true,
});
```

---

## 📋 الملخص النهائي

| المهمة | الحالة |
|--------|--------|
| ✅ إصلاح Frontend Domain Logic | تم |
| ✅ Build Frontend نجح | تم |
| 📦 Deploy إلى Vercel | **انتظار** |
| ⚙️ إعداد Environment Variables | **انتظار** |
| 🌐 ربط الدومين `dokn.net` | **انتظار** |
| 🌐 إضافة Wildcard `*.dokn.net` | **انتظار** |
| 🧪 اختبار Main Platform | **انتظار** |
| 🧪 اختبار Subdomain | **انتظار** |

---

## 🎉 بعد النشر الناجح

عندما تنتهي من Deploy:

1. أرسل لي الـ URLs لأتحقق منها:
   - `https://dokn.net/`
   - `https://store1.dokn.net/`
   
2. إذا واجهت أي مشكلة، أرسل لي:
   - Screenshot من Console Errors
   - Vercel Logs
   - Backend Logs (`flyctl logs`)

---

**جاهز للـ Deploy! 🚀**

إذا احتجت مساعدة في أي خطوة، أخبرني! 😊
