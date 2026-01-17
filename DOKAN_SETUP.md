# 🏪 Dokan Frontend Setup
## إعداد الفرونت إند

---

## ✅ تم الإصلاح!

تم تحديث `angular.json` للسماح بـ `dokan.local` و جميع الـ subdomains.

---

## 🚀 لتشغيل المشروع:

### 1. أوقف الـ dev server إذا كان يعمل
اضغط `Ctrl+C` في Terminal

### 2. شغّل الـ dev server مرة أخرى
```bash
cd C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\SuperEcommere
ng serve --host 0.0.0.0 --disable-host-check
```

### 3. افتح المتصفح
- **المنصة الرئيسية:** `http://dokan.local:4200`
- **متجر تجريبي:** `http://store1.dokan.local:4200`
- **متجر آخر:** `http://store2.dokan.local:4200`

---

## 📝 ملاحظات

### Allowed Hosts المضافة:
```json
"allowedHosts": [
  "dokan.local",         // المنصة الرئيسية
  "*.dokan.local",       // كل الـ subdomains (wildcard)
  ".dokan.local"         // بديل للـ wildcard
]
```

### إذا واجهت مشكلة "Host not allowed":
1. تأكد من إيقاف الـ dev server تماماً
2. امسح الـ cache: `Ctrl+Shift+Delete`
3. شغّل الـ dev server مرة أخرى
4. استخدم Incognito mode للاختبار

### تأكد من hosts file:
```
# Windows: C:\Windows\System32\drivers\etc\hosts
127.0.0.1   dokan.local
127.0.0.1   www.dokan.local
127.0.0.1   store1.dokan.local
127.0.0.1   store2.dokan.local
127.0.0.1   mystore.dokan.local
```

---

## 🔧 إعدادات إضافية

### Proxy Configuration
الملف: `proxy.conf.json`
```json
{
  "/api": {
    "target": "https://dokan.local:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

### Environment
الملف: `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  appUrl: "https://dokan.local:3000/api",
  apiUrl: "https://dokan.local:3000/api",
  platformDomain: "dokan.local",
  websocketUrl: "https://dokan.local:3000",
  userKey: "IdentityAppUser"
};
```

---

## ✅ الآن جاهز!

بعد إعادة تشغيل الـ dev server، يجب أن يعمل الموقع على:
```
http://dokan.local:4200
```

🎉 **Happy Coding!**
