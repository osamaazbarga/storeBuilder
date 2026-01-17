# 🔧 Backend Requirements for Subdomain Support
## متطلبات الباك إند لدعم Subdomains

## 📋 **ما يحتاجه الباك إند:**

### **1. API Endpoint لتحميل المتجر بناءً على Subdomain:**

```csharp
// GET /api/Store/by-subdomain/{subdomain}
[HttpGet("by-subdomain/{subdomain}")]
public async Task<ActionResult<StoreDto>> GetStoreBySubdomain(string subdomain)
{
    try
    {
        // Case 1: Subdomain (e.g., "store1")
        var store = await _context.Stores
            .Where(s => s.Slug == subdomain || s.StoreLink == subdomain)
            .FirstOrDefaultAsync();

        // Case 2: Custom Domain (e.g., "mystore.com")
        if (store == null)
        {
            store = await _context.Stores
                .Where(s => s.CustomDomain == subdomain)
                .FirstOrDefaultAsync();
        }

        if (store == null)
        {
            return NotFound(new { 
                message = $"Store not found for subdomain: {subdomain}" 
            });
        }

        return Ok(store);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { 
            message = "Error loading store", 
            error = ex.Message 
        });
    }
}
```

---

### **2. جدول Store في قاعدة البيانات:**

```sql
CREATE TABLE Stores (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId NVARCHAR(450) NOT NULL,
    StoreName NVARCHAR(200) NOT NULL,
    StoreLink NVARCHAR(100) NOT NULL UNIQUE, -- e.g., "store1"
    Slug NVARCHAR(100) NOT NULL UNIQUE, -- e.g., "store1" (same as StoreLink)
    CustomDomain NVARCHAR(200) NULL UNIQUE, -- e.g., "mystore.com"
    BusinessCategory NVARCHAR(100) NULL,
    StoreAddress NVARCHAR(500) NULL,
    StoreCity NVARCHAR(100) NULL,
    StoreCountry NVARCHAR(100) NULL,
    StoreZipCode NVARCHAR(20) NULL,
    StorePhone NVARCHAR(50) NULL,
    StoreEmail NVARCHAR(200) NULL,
    StoreLogo NVARCHAR(500) NULL,
    StoreTheme NVARCHAR(50) NULL,
    PaymentMethod NVARCHAR(100) NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id)
);

-- Indexes for performance
CREATE INDEX IX_Stores_StoreLink ON Stores(StoreLink);
CREATE INDEX IX_Stores_Slug ON Stores(Slug);
CREATE INDEX IX_Stores_CustomDomain ON Stores(CustomDomain);
CREATE INDEX IX_Stores_UserId ON Stores(UserId);
```

---

### **3. Store Model (C#):**

```csharp
public class Store
{
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string StoreName { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string StoreLink { get; set; } // "store1"
    
    [Required]
    [MaxLength(100)]
    public string Slug { get; set; } // "store1"
    
    [MaxLength(200)]
    public string? CustomDomain { get; set; } // "mystore.com"
    
    [MaxLength(100)]
    public string? BusinessCategory { get; set; }
    
    [MaxLength(500)]
    public string? StoreAddress { get; set; }
    
    [MaxLength(100)]
    public string? StoreCity { get; set; }
    
    [MaxLength(100)]
    public string? StoreCountry { get; set; }
    
    [MaxLength(20)]
    public string? StoreZipCode { get; set; }
    
    [MaxLength(50)]
    public string? StorePhone { get; set; }
    
    [MaxLength(200)]
    public string? StoreEmail { get; set; }
    
    [MaxLength(500)]
    public string? StoreLogo { get; set; }
    
    [MaxLength(50)]
    public string? StoreTheme { get; set; }
    
    [MaxLength(100)]
    public string? PaymentMethod { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public virtual ApplicationUser User { get; set; }
    public virtual ICollection<Product> Products { get; set; }
}
```

---

### **4. CORS Configuration:**

```csharp
// في Program.cs أو Startup.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
    
    // أو للأمان أكثر:
    options.AddPolicy("AllowVercelDomains", builder =>
    {
        builder
            .WithOrigins(
                "https://store-builder-git-dev-osamaazbargas-projects.vercel.app",
                "https://*.store-builder-git-dev-osamaazbargas-projects.vercel.app",
                "https://dokan.shop", // بعد شراء Domain
                "https://*.dokan.shop" // Wildcard
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// في middleware:
app.UseCors("AllowVercelDomains");
```

---

### **5. API Endpoints الإضافية:**

#### **أ. التحقق من توفر Slug:**
```csharp
// GET /api/Store/check-slug/{slug}
[HttpGet("check-slug/{slug}")]
public async Task<ActionResult> CheckSlugAvailability(string slug)
{
    var exists = await _context.Stores
        .AnyAsync(s => s.Slug == slug || s.StoreLink == slug);
    
    if (exists)
    {
        return Ok(new { 
            available = false, 
            reason = "Slug already taken" 
        });
    }
    
    // Check reserved words
    var reservedWords = new[] { "www", "admin", "api", "app", "mail", "ftp" };
    if (reservedWords.Contains(slug.ToLower()))
    {
        return Ok(new { 
            available = false, 
            reason = "Slug is reserved" 
        });
    }
    
    return Ok(new { available = true });
}
```

#### **ب. إضافة/تعديل Custom Domain:**
```csharp
// POST /api/Store/{storeId}/custom-domain
[HttpPost("{storeId}/custom-domain")]
[Authorize]
public async Task<ActionResult> SetCustomDomain(int storeId, [FromBody] CustomDomainDto dto)
{
    var store = await _context.Stores.FindAsync(storeId);
    
    if (store == null)
    {
        return NotFound();
    }
    
    // Verify user owns this store
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (store.UserId != userId)
    {
        return Forbid();
    }
    
    // Check if domain is already used
    var domainExists = await _context.Stores
        .AnyAsync(s => s.CustomDomain == dto.CustomDomain && s.Id != storeId);
    
    if (domainExists)
    {
        return BadRequest(new { 
            message = "Domain already in use" 
        });
    }
    
    store.CustomDomain = dto.CustomDomain;
    store.UpdatedAt = DateTime.UtcNow;
    
    await _context.SaveChangesAsync();
    
    return Ok(new { 
        success = true, 
        message = "Custom domain set successfully" 
    });
}
```

#### **ج. الحصول على متاجر المستخدم:**
```csharp
// GET /api/Store/my-stores
[HttpGet("my-stores")]
[Authorize]
public async Task<ActionResult<List<StoreDto>>> GetMyStores()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    
    var stores = await _context.Stores
        .Where(s => s.UserId == userId && s.IsActive)
        .OrderByDescending(s => s.CreatedAt)
        .ToListAsync();
    
    return Ok(stores);
}

// GET /api/Store/my-store
[HttpGet("my-store")]
[Authorize]
public async Task<ActionResult<StoreDto>> GetMyStore()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    
    var store = await _context.Stores
        .Where(s => s.UserId == userId && s.IsActive)
        .OrderByDescending(s => s.CreatedAt)
        .FirstOrDefaultAsync();
    
    if (store == null)
    {
        return NotFound(new { message = "No store found" });
    }
    
    return Ok(store);
}
```

---

### **6. Middleware للكشف عن Subdomain (اختياري):**

```csharp
public class SubdomainMiddleware
{
    private readonly RequestDelegate _next;

    public SubdomainMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var host = context.Request.Host.Host;
        var parts = host.Split('.');
        
        // Extract subdomain if exists
        if (parts.Length > 2)
        {
            var subdomain = parts[0];
            context.Items["Subdomain"] = subdomain;
        }
        
        await _next(context);
    }
}

// في Program.cs:
app.UseMiddleware<SubdomainMiddleware>();
```

---

### **7. DTOs:**

```csharp
public class StoreDto
{
    public int Id { get; set; }
    public string StoreName { get; set; }
    public string StoreLink { get; set; }
    public string Slug { get; set; }
    public string? CustomDomain { get; set; }
    public string? BusinessCategory { get; set; }
    public string? StoreAddress { get; set; }
    public string? StoreCity { get; set; }
    public string? StoreCountry { get; set; }
    public string? StoreZipCode { get; set; }
    public string? StorePhone { get; set; }
    public string? StoreEmail { get; set; }
    public string? StoreLogo { get; set; }
    public string? StoreTheme { get; set; }
    public string? PaymentMethod { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CustomDomainDto
{
    [Required]
    [MaxLength(200)]
    public string CustomDomain { get; set; }
}

public class CreateStoreDto
{
    [Required]
    [MaxLength(200)]
    public string StoreName { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string StoreLink { get; set; }
    
    [MaxLength(100)]
    public string? BusinessCategory { get; set; }
}
```

---

## 🧪 **اختبار API:**

### **1. تحميل متجر بـ Subdomain:**
```bash
curl https://dokan-backend-dev.fly.dev/api/Store/by-subdomain/store1
```

**Response:**
```json
{
  "id": 1,
  "storeName": "My Store",
  "storeLink": "store1",
  "slug": "store1",
  "customDomain": null,
  "businessCategory": "Electronics",
  "isActive": true
}
```

### **2. التحقق من توفر Slug:**
```bash
curl https://dokan-backend-dev.fly.dev/api/Store/check-slug/store1
```

**Response:**
```json
{
  "available": false,
  "reason": "Slug already taken"
}
```

### **3. إضافة Custom Domain:**
```bash
curl -X POST https://dokan-backend-dev.fly.dev/api/Store/1/custom-domain \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"customDomain": "mystore.com"}'
```

---

## 🔒 **Security Considerations:**

1. **Validate Subdomains:**
   - لا تسمح بـ subdomains محجوزة (admin, api, www)
   - تحقق من طول الـ slug (3-50 حرف)
   - استخدم Regex: `^[a-z0-9-]+$`

2. **Rate Limiting:**
   - حدّد عدد المتاجر لكل مستخدم
   - حدّد عدد طلبات تغيير الـ Custom Domain

3. **Domain Verification:**
   - تحقق من ملكية الـ Custom Domain قبل تفعيله
   - استخدم DNS TXT records للتحقق

---

## ✅ **Checklist للباك إند:**

- [ ] إضافة `by-subdomain/{subdomain}` endpoint
- [ ] إضافة `check-slug/{slug}` endpoint
- [ ] إضافة `custom-domain` endpoints
- [ ] تحديث CORS للسماح بـ Vercel domains
- [ ] إضافة Indexes على `Slug`, `StoreLink`, `CustomDomain`
- [ ] اختبار API مع Postman/curl
- [ ] إضافة validation للـ slugs
- [ ] إضافة rate limiting

---

## 📚 **Resources:**
- [ASP.NET Core CORS](https://docs.microsoft.com/en-us/aspnet/core/security/cors)
- [Entity Framework Core Indexes](https://docs.microsoft.com/en-us/ef/core/modeling/indexes)
- [Multi-Tenant Architecture](https://docs.microsoft.com/en-us/azure/architecture/patterns/multi-tenancy)

---

**تم! 🎉**
الآن الباك إند جاهز لدعم Subdomains والـ Custom Domains.
