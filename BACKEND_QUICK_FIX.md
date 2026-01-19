# إصلاح سريع - Custom Domain Backend
## Quick Fix for Custom Domain Support

## 🔥 المشكلة الحالية

```
❌ Exception: {
  status: 404,
  message: 'Store not found with custom domain: www.dokn.shop'
}
```

الباك إند يبحث عن المتجر لكن لا يجده!

---

## ✅ الحل السريع (5 دقائق)

### الخطوة 1️⃣: تحديث قاعدة البيانات

**تأكد من أن `CustomDomain` محفوظ بدون `www.`:**

```sql
-- تحديث السجل الموجود
UPDATE Stores 
SET CustomDomain = 'dokn.shop'
WHERE CustomDomain = 'www.dokn.shop' OR Name = 'اسم_متجرك';

-- التحقق من القيمة
SELECT Id, Name, Slug, CustomDomain 
FROM Stores 
WHERE CustomDomain LIKE '%dokn%';
```

**يجب أن يكون الناتج:**
```
Id | Name     | Slug | CustomDomain
---|----------|------|-------------
1  | متجري   | test | dokn.shop
```

---

### الخطوة 2️⃣: إضافة Endpoint في الباك إند

في ملف **`store.controller.ts`** (أو `StoreController.cs`)، أضف:

#### لـ NestJS (TypeScript):

```typescript
@Get('by-custom-domain/:domain')
async getStoreByCustomDomain(@Param('domain') domain: string) {
  console.log('🔍 Searching for custom domain:', domain);
  
  // البحث عن المتجر
  const store = await this.storesService.findByCustomDomain(domain);
  
  if (!store) {
    throw new NotFoundException(`Store not found with custom domain: ${domain}`);
  }
  
  return store;
}
```

في ملف **`stores.service.ts`**، أضف:

```typescript
async findByCustomDomain(domain: string): Promise<Store> {
  // تطبيع الدومين (إزالة www. إذا وُجد)
  const normalizedDomain = domain.toLowerCase().replace(/^www\./, '');
  
  console.log('🔍 Searching for:', normalizedDomain);
  
  return this.storesRepository.findOne({
    where: { 
      customDomain: normalizedDomain,
      isDeleted: false 
    }
  });
}
```

#### لـ ASP.NET Core (C#):

```csharp
[HttpGet("by-custom-domain/{domain}")]
public async Task<ActionResult<StoreDto>> GetStoreByCustomDomain(string domain)
{
    // تطبيع الدومين
    var normalizedDomain = domain.ToLower().Replace("www.", "");
    
    Console.WriteLine($"🔍 Searching for: {normalizedDomain}");
    
    var store = await _context.Stores
        .FirstOrDefaultAsync(s => 
            s.CustomDomain == normalizedDomain && 
            !s.IsDeleted
        );

    if (store == null)
    {
        return NotFound(new { 
            message = $"Store not found with custom domain: {domain}" 
        });
    }

    return Ok(new StoreDto
    {
        Id = store.Id,
        Name = store.Name,
        Slug = store.Slug,
        CustomDomain = store.CustomDomain
    });
}
```

---

### الخطوة 3️⃣: إعادة Deploy الباك إند

```bash
# في مجلد الباك إند
cd C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\dokan-backend

# Build
npm run build
# أو
dotnet build

# Deploy إلى Fly.io
fly deploy
```

---

## 🧪 اختبار الحل

### 1. اختبار الـ API مباشرة:

```bash
# من Postman أو Browser
GET https://dokan-backend-dev.fly.dev/api/Store/by-custom-domain/dokn.shop
```

**يجب أن يرجع:**
```json
{
  "id": 1,
  "name": "متجري",
  "slug": "test",
  "customDomain": "dokn.shop"
}
```

### 2. اختبار من المتصفح:

```
افتح: http://www.dokn.shop:4200
أو: http://dokn.shop:4200
```

**يجب أن يعمل بدون أخطاء! ✅**

---

## 📊 تتبع المشكلة (Debugging)

إذا لم يعمل، تحقق من:

### 1️⃣ قاعدة البيانات:
```sql
SELECT * FROM Stores WHERE CustomDomain LIKE '%dokn%';
```

### 2️⃣ Logs الباك إند:
```bash
fly logs -a dokan-backend-dev
```

### 3️⃣ Console الفرونت إند:
```
افتح DevTools (F12) → Console
ابحث عن: "🔍 Loading store by custom domain"
```

---

## 🎯 ملخص التغييرات

### ✅ الفرونت إند (تم):
- `www.dokn.shop` → يُحوّل إلى → `dokn.shop`
- يستدعي `/api/Store/by-custom-domain/dokn.shop`

### ⏳ الباك إند (مطلوب):
- إضافة endpoint جديد: `/by-custom-domain/:domain`
- البحث في جدول `Stores` → حقل `CustomDomain`
- إرجاع بيانات المتجر

### ⏳ قاعدة البيانات:
- التأكد من أن `CustomDomain = 'dokn.shop'` (بدون www.)
- التأكد من أن `IsDeleted = false`

---

## 🚨 ملاحظة مهمة

**الدومين في قاعدة البيانات يجب أن يكون بدون `www.`:**
- ✅ `dokn.shop`
- ❌ `www.dokn.shop`

**الفرونت إند يزيل `www.` تلقائياً قبل الإرسال للباك إند.**

---

## 📞 المساعدة

إذا واجهت أي مشكلة:

1. تحقق من Logs: `fly logs`
2. تحقق من Database: `SELECT * FROM Stores`
3. اختبر الـ API: `GET /by-custom-domain/dokn.shop`

**الآن يجب أن يعمل Custom Domain بدون مشاكل! 🎉**
