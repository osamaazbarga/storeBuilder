// ========================================
// Cloudflare Worker - Multi-Tenant Router
// يدعم: Subdomains + Custom Domains
// ========================================

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const hostname = url.hostname;
  
  console.log(`📍 Request for: ${hostname}`);

  // ========================================
  // التعرف على نوع الطلب
  // ========================================
  
  const PLATFORM_DOMAIN = 'dokn.net';
  const BACKEND_URL = 'https://dokan-backend-dev.fly.dev';
  const FRONTEND_URL = 'https://storebuilder-4qs.pages.dev';

  // 1️⃣ Main Domain (dokn.net)
  if (hostname === PLATFORM_DOMAIN) {
    console.log('✅ Main platform domain');
    return fetch(`${FRONTEND_URL}${url.pathname}${url.search}`, {
      ...request,
      headers: request.headers,
    });
  }

  // 2️⃣ Subdomain (store1.dokn.net)
  if (hostname.endsWith(`.${PLATFORM_DOMAIN}`)) {
    const subdomain = hostname.replace(`.${PLATFORM_DOMAIN}`, '');
    console.log(`🔍 Subdomain detected: ${subdomain}`);

    // تحقق من وجود المتجر في Backend
    const storeExists = await checkStoreBySlug(subdomain, BACKEND_URL);

    if (storeExists) {
      console.log(`✅ Store found: ${subdomain}`);
      return fetch(`${FRONTEND_URL}${url.pathname}${url.search}`, {
        ...request,
        headers: request.headers,
      });
    } else {
      console.log(`❌ Store not found: ${subdomain}`);
      return new Response('Store not found', { status: 404 });
    }
  }

  // 3️⃣ Custom Domain (www.mystore.com)
  console.log(`🔍 Checking if ${hostname} is a custom domain...`);
  
  const storeForCustomDomain = await checkStoreByCustomDomain(hostname, BACKEND_URL);

  if (storeForCustomDomain) {
    console.log(`✅ Custom domain verified: ${hostname} → Store: ${storeForCustomDomain.slug}`);
    
    // إرسال الطلب للفرونت إند مع الاحتفاظ بالـ hostname الأصلي
    return fetch(`${FRONTEND_URL}${url.pathname}${url.search}`, {
      ...request,
      headers: request.headers,
    });
  } else {
    console.log(`❌ No store found for custom domain: ${hostname}`);
    return new Response('Store not found for this domain', { status: 404 });
  }
}

// ========================================
// Helper Functions
// ========================================

/**
 * التحقق من وجود متجر بالـ Slug (للـ Subdomains)
 */
async function checkStoreBySlug(slug, backendUrl) {
  try {
    const response = await fetch(`${backendUrl}/api/stores/by-slug/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const store = await response.json();
      return store && !store.isDeleted;
    }

    return false;
  } catch (error) {
    console.error(`Error checking store by slug: ${slug}`, error);
    return false;
  }
}

/**
 * التحقق من وجود متجر بالـ Custom Domain
 */
async function checkStoreByCustomDomain(domain, backendUrl) {
  try {
    // تطبيع الدومين (إزالة www. إذا وجد)
    let normalizedDomain = domain.toLowerCase().trim();
    if (normalizedDomain.startsWith('www.')) {
      normalizedDomain = normalizedDomain.substring(4);
    }

    console.log(`🔍 Normalized domain: ${domain} → ${normalizedDomain}`);

    const response = await fetch(`${backendUrl}/api/stores/by-domain/${normalizedDomain}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const store = await response.json();
      return store && !store.isDeleted ? store : null;
    }

    return null;
  } catch (error) {
    console.error(`Error checking custom domain: ${domain}`, error);
    return null;
  }
}
