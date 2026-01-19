-- ========================================
-- إصلاح Custom Domain في قاعدة البيانات
-- Fix Custom Domain in Database
-- ========================================

-- 1️⃣ عرض جميع المتاجر مع Custom Domains
-- Display all stores with custom domains
SELECT 
    Id,
    Name,
    Slug,
    CustomDomain,
    IsDeleted,
    CreatedAt
FROM Stores
WHERE CustomDomain IS NOT NULL
ORDER BY CreatedAt DESC;

-- ========================================

-- 2️⃣ تحديث Custom Domain لإزالة www.
-- Update custom domain to remove www.
UPDATE Stores
SET CustomDomain = REPLACE(CustomDomain, 'www.', '')
WHERE CustomDomain LIKE 'www.%';

-- ========================================

-- 3️⃣ تحديث متجر معين (إذا كنت تعرف الـ ID)
-- Update specific store (if you know the ID)
-- غيّر القيم حسب حالتك:
UPDATE Stores
SET CustomDomain = 'dokn.shop'  -- بدون www.
WHERE Id = 1;  -- ضع ID المتجر الصحيح

-- أو إذا كنت تعرف اسم المتجر:
UPDATE Stores
SET CustomDomain = 'dokn.shop'
WHERE Name = 'اسم_متجرك_هنا';

-- أو إذا كنت تعرف الـ Slug:
UPDATE Stores
SET CustomDomain = 'dokn.shop'
WHERE Slug = 'test';

-- ========================================

-- 4️⃣ التحقق من النتيجة
-- Verify the result
SELECT 
    Id,
    Name,
    Slug,
    CustomDomain,
    CASE 
        WHEN CustomDomain LIKE 'www.%' THEN '❌ يحتوي على www.'
        ELSE '✅ صحيح'
    END AS Status
FROM Stores
WHERE CustomDomain IS NOT NULL;

-- ========================================

-- 5️⃣ البحث عن متجر بـ Custom Domain (اختبار)
-- Search for store by custom domain (test)
SELECT * 
FROM Stores 
WHERE CustomDomain = 'dokn.shop'  -- بدون www.
  AND IsDeleted = 0;

-- ========================================

-- 6️⃣ إذا لم يكن موجود، أضف Custom Domain لمتجر موجود
-- If not exists, add custom domain to existing store
UPDATE Stores
SET CustomDomain = 'dokn.shop'
WHERE Slug = 'test'  -- أو أي Slug آخر
  AND CustomDomain IS NULL;

-- ========================================

-- 7️⃣ حذف www. من جميع Custom Domains (تنظيف شامل)
-- Remove www. from all custom domains (cleanup)
UPDATE Stores
SET CustomDomain = 
    CASE 
        WHEN CustomDomain LIKE 'www.%' 
        THEN SUBSTRING(CustomDomain, 5, LEN(CustomDomain))
        ELSE CustomDomain
    END
WHERE CustomDomain IS NOT NULL;

-- ========================================

-- 8️⃣ التحقق النهائي
-- Final verification
SELECT 
    Id,
    Name,
    Slug,
    CustomDomain,
    IsDeleted,
    CASE 
        WHEN CustomDomain IS NULL THEN '⚠️ لا يوجد Custom Domain'
        WHEN CustomDomain LIKE 'www.%' THEN '❌ يحتوي على www.'
        WHEN IsDeleted = 1 THEN '❌ محذوف'
        ELSE '✅ جاهز'
    END AS Status
FROM Stores
ORDER BY CreatedAt DESC;

-- ========================================
-- ملاحظات:
-- Notes:
-- 
-- 1. تأكد من عمل Backup قبل تشغيل UPDATE
-- 2. CustomDomain يجب أن يكون بدون www.
-- 3. IsDeleted يجب أن يكون 0 (false)
-- 4. الدومين يجب أن يكون unique لكل متجر
-- ========================================
