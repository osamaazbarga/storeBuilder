# إصلاح Custom Domain في الباك إند
## Backend Custom Domain Fix

## المشكلة (Problem)

عندما يستخدم المستخدم Custom Domain مثل `www.dokn.shop`:

1. **المستخدم يدخل**: `www.dokn.shop` في المتصفح
2. **الفرونت إند يرسل**: `/api/Store/by-custom-domain/dokn.shop` (بعد إزالة www.)
3. **الباك إند يبحث عن**: `customDomain = 'dokn.shop'` في قاعدة البيانات
4. **المشكلة**: الباك إند الحالي يدعم فقط:
   - `/api/Store/by-subdomain/{subdomain}` - يبحث في حقل `Slug` فقط
   - لا يوجد endpoint للبحث في `CustomDomain`

## الحل المطلوب (Solution)

### 1. إضافة Endpoint جديد في StoreController

```csharp
[HttpGet("by-custom-domain/{domain}")]
public async Task<ActionResult<StoreDto>> GetStoreByCustomDomain(string domain)
{
    try
    {
        // البحث عن المتجر بـ CustomDomain
        var store = await _context.Stores
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.CustomDomain == domain && !s.IsDeleted);

        if (store == null)
        {
            return NotFound(new { message = $"Store not found with custom domain: {domain}" });
        }

        var storeDto = new StoreDto
        {
            Id = store.Id,
            Name = store.Name,
            Slug = store.Slug,
            CustomDomain = store.CustomDomain,
            Description = store.Description,
            LogoUrl = store.LogoUrl,
            UserId = store.UserId,
            // ... باقي الحقول
        };

        return Ok(storeDto);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "Error retrieving store", error = ex.Message });
    }
}
```

### 2. أو تعديل الـ Endpoint الحالي (خيار أفضل)

بدلاً من إضافة endpoint جديد، يمكنك تعديل `/by-subdomain/` ليبحث في كلا الحقلين:

```csharp
[HttpGet("by-subdomain/{identifier}")]
public async Task<ActionResult<StoreDto>> GetStoreByIdentifier(string identifier)
{
    try
    {
        // البحث في كلا الحقلين: Slug و CustomDomain
        var store = await _context.Stores
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => 
                (s.Slug == identifier || s.CustomDomain == identifier) 
                && !s.IsDeleted
            );

        if (store == null)
        {
            return NotFound(new { message = $"Store not found with identifier: {identifier}" });
        }

        var storeDto = new StoreDto
        {
            Id = store.Id,
            Name = store.Name,
            Slug = store.Slug,
            CustomDomain = store.CustomDomain,
            Description = store.Description,
            LogoUrl = store.LogoUrl,
            UserId = store.UserId,
            // ... باقي الحقول
        };

        return Ok(storeDto);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "Error retrieving store", error = ex.Message });
    }
}
```

### 3. أو إضافة Endpoint جديد `/by-identifier/` (الخيار الموصى به)

```csharp
[HttpGet("by-identifier/{identifier}")]
public async Task<ActionResult<StoreDto>> GetStoreByIdentifier(string identifier)
{
    try
    {
        // البحث في كلا الحقلين
        var store = await _context.Stores
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => 
                (s.Slug == identifier || s.CustomDomain == identifier) 
                && !s.IsDeleted
            );

        if (store == null)
        {
            return NotFound(new { message = $"Store not found with identifier: {identifier}" });
        }

        var storeDto = new StoreDto
        {
            Id = store.Id,
            Name = store.Name,
            Slug = store.Slug,
            CustomDomain = store.CustomDomain,
            Description = store.Description,
            LogoUrl = store.LogoUrl,
            UserId = store.UserId,
            CreatedAt = store.CreatedAt,
            UpdatedAt = store.UpdatedAt
        };

        return Ok(storeDto);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "Error retrieving store", error = ex.Message });
    }
}
```

## اختبار الـ Endpoints (Testing)

### Test 1: Subdomain
```bash
GET https://dokan-backend-dev.fly.dev/api/Store/by-identifier/test
# يجب أن يرجع المتجر الذي Slug = "test"
```

### Test 2: Custom Domain
```bash
GET https://dokan-backend-dev.fly.dev/api/Store/by-custom-domain/www.dokn.shop
# يجب أن يرجع المتجر الذي CustomDomain = "www.dokn.shop"
```

### Test 3: Unified Endpoint (Recommended)
```bash
# Subdomain
GET https://dokan-backend-dev.fly.dev/api/Store/by-identifier/test

# Custom Domain
GET https://dokan-backend-dev.fly.dev/api/Store/by-identifier/www.dokn.shop
```

## التحقق من قاعدة البيانات (Database Check)

تأكد من أن الجدول `Stores` يحتوي على:

```sql
SELECT Id, Name, Slug, CustomDomain, IsDeleted 
FROM Stores 
WHERE CustomDomain = 'www.dokn.shop' OR Slug = 'test';
```

يجب أن يكون:
- `CustomDomain` = `'www.dokn.shop'` أو `'dokn.shop'`
- `IsDeleted` = `false` أو `0`

## ملاحظات مهمة (Important Notes)

1. **Case Sensitivity**: تأكد من أن المقارنة غير حساسة لحالة الأحرف
   ```csharp
   s.CustomDomain.ToLower() == identifier.ToLower()
   ```

2. **www Prefix**: تأكد من التعامل مع `www.` prefix بشكل صحيح
   ```csharp
   var normalizedIdentifier = identifier.StartsWith("www.") 
       ? identifier.Substring(4) 
       : identifier;
   
   s.CustomDomain == identifier || 
   s.CustomDomain == normalizedIdentifier ||
   s.CustomDomain == $"www.{identifier}"
   ```

3. **CORS**: تأكد من أن الباك إند يسمح بالطلبات من Custom Domains:
   ```csharp
   services.AddCors(options =>
   {
       options.AddPolicy("AllowAll",
           builder => builder
               .SetIsOriginAllowedToAllowWildcardSubdomains()
               .AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader());
   });
   ```

## التحديثات في الفرونت إند (Frontend Updates)

✅ تم تحديث `store.service.ts`:
- إضافة `loadStoreByCustomDomain()` method
- تعديل `loadStoreBySubdomain()` method

✅ تم تحديث `view.component.ts`:
- إضافة logic للتفريق بين Subdomain و Custom Domain
- استخدام الـ method المناسب حسب نوع الدومين

## الخطوات التالية (Next Steps)

1. ✅ تحديث الفرونت إند (تم)
2. ⏳ تحديث الباك إند (مطلوب)
3. ⏳ اختبار الـ Custom Domains
4. ⏳ Deploy التحديثات

## مثال كامل للـ Controller

```csharp
namespace DokanBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoreController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StoreController(ApplicationDbContext context)
        {
            _context = context;
        }

        // الـ endpoint الموحد (Recommended)
        [HttpGet("by-identifier/{identifier}")]
        public async Task<ActionResult<StoreDto>> GetStoreByIdentifier(string identifier)
        {
            try
            {
                // Normalize identifier
                var normalizedIdentifier = identifier.ToLower().Trim();
                var withoutWww = normalizedIdentifier.StartsWith("www.") 
                    ? normalizedIdentifier.Substring(4) 
                    : normalizedIdentifier;
                var withWww = $"www.{withoutWww}";

                // البحث في Slug أو CustomDomain (مع دعم www.)
                var store = await _context.Stores
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => 
                        (s.Slug.ToLower() == normalizedIdentifier ||
                         s.CustomDomain.ToLower() == normalizedIdentifier ||
                         s.CustomDomain.ToLower() == withoutWww ||
                         s.CustomDomain.ToLower() == withWww)
                        && !s.IsDeleted
                    );

                if (store == null)
                {
                    return NotFound(new { 
                        message = $"Store not found with identifier: {identifier}",
                        searchedFor = new[] { normalizedIdentifier, withoutWww, withWww }
                    });
                }

                var storeDto = new StoreDto
                {
                    Id = store.Id,
                    Name = store.Name,
                    Slug = store.Slug,
                    CustomDomain = store.CustomDomain,
                    Description = store.Description,
                    LogoUrl = store.LogoUrl,
                    UserId = store.UserId,
                    CreatedAt = store.CreatedAt,
                    UpdatedAt = store.UpdatedAt
                };

                return Ok(storeDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Error retrieving store", 
                    error = ex.Message 
                });
            }
        }

        // Endpoint منفصل للـ Custom Domain (Optional)
        [HttpGet("by-custom-domain/{domain}")]
        public async Task<ActionResult<StoreDto>> GetStoreByCustomDomain(string domain)
        {
            return await GetStoreByIdentifier(domain);
        }

        // الـ endpoint القديم (للتوافق مع الإصدارات السابقة)
        [HttpGet("by-subdomain/{subdomain}")]
        public async Task<ActionResult<StoreDto>> GetStoreBySubdomain(string subdomain)
        {
            return await GetStoreByIdentifier(subdomain);
        }
    }
}
```
