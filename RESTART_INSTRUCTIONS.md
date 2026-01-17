# 🚀 تعليمات إعادة تشغيل Frontend

## ⚠️ مهم جداً!

للحصول على `shop1.local` ليعمل، يجب إعادة تشغيل Frontend بشكل صحيح!

---

## 📝 الخطوات:

### 1️⃣ أوقف Frontend القديم (إذا كان يعمل):

في terminal Frontend (أو أي مكان يعمل فيه):
```
Ctrl + C
```

اضغط عدة مرات للتأكد من إيقافه تماماً.

---

### 2️⃣ افتح terminal جديد:

في VSCode أو Command Prompt:

```bash
cd C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\SuperEcommere
```

---

### 3️⃣ شغّل Frontend:

```bash
ng serve --host 0.0.0.0 --port 4200 --disable-host-check
```

**أو استخدم الملف الدفعي:**

```bash
start-frontend.bat
```

---

### 4️⃣ انتظر حتى ترى:

```
✔ Browser application bundle generation complete.

Initial Chunk Files | Names         |  Raw Size
main.js             | main          |   XXX kB |
styles.css          | styles        |   XXX kB |

                    | Initial Total |   XXX kB

Application bundle generation complete. [X.XXX seconds]

** Angular Live Development Server is listening on 0.0.0.0:4200, open your browser on http://localhost:4200/ **


✔ Compiled successfully.
```

---

### 5️⃣ اختبر الآن:

افتح المتصفح وجرب:

**1. الموقع الرئيسي:**
```
http://dokan.local:4200
```
يجب أن ترى الصفحة الرئيسية للمنصة ✅

**2. متجر store1 بـ subdomain:**
```
http://store1.dokan.local:4200
```
يجب أن ترى متجر store1 ✅

**3. متجر store1 بـ custom domain:**
```
http://shop1.local:4200
```
يجب أن ترى متجر store1 ✅ (نفس المتجر!)

---

## 🔍 التحقق من Backend Logs:

عند فتح `http://shop1.local:4200`، يجب أن ترى في Backend console:

```
🔍 Resolving store for: shop1.local
✅ Store found by custom domain: store1
```

**إذا رأيت:**
```
🔍 Resolving store for: dokan.local
```

← معناها أن المتصفح لا يستخدم `shop1.local` بشكل صحيح!

**الحل:**
1. امسح cache المتصفح: `Ctrl + Shift + Delete`
2. استخدم Incognito Mode: `Ctrl + Shift + N`
3. جرب متصفح آخر

---

## 🧹 مسح Cache:

### في Windows (DNS Cache):
```bash
ipconfig /flushdns
```

### في المتصفح:
```
Ctrl + Shift + Delete
→ اختر "Cached images and files"
→ Clear data
```

---

## ❌ استكشاف الأخطاء:

### مشكلة: "Host not allowed"

**الحل:**
- تأكد من تحديث `angular.json` ✓ (تم بالفعل)
- أعد تشغيل Frontend ✓

### مشكلة: "Store not found"

**الحل:**
1. تحقق من قاعدة البيانات:
```sql
SELECT * FROM domains WHERE domain = 'shop1.local';
```

2. تأكد من:
   - `type = 'custom'` ✓
   - `status = 'active'` ✓
   - `store.status = 'active'` ✓

### مشكلة: يظهر الموقع الرئيسي بدلاً من المتجر

**الحل:**
- Backend logs لا تُظهر `shop1.local`
- امسح DNS cache: `ipconfig /flushdns`
- امسح cache المتصفح
- استخدم Incognito Mode

---

## ✅ ملاحظات:

1. **hosts file** محدث ✓
```
127.0.0.1   shop1.local
```

2. **angular.json** محدث ✓
```json
"allowedHosts": [
  "shop1.local",
  "*.local"
]
```

3. **قاعدة البيانات** محدثة ✓
```
shop1.local → store1 (id=2) → active
```

4. **Backend** يعمل ✓
```
https://dokan.local:3000
```

---

## 🎯 الخلاصة:

**الآن شغّل Frontend وجرب `http://shop1.local:4200`!**

يجب أن يعمل! 🚀
