# Test Deployment Script
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "   Dokan Deployment Test" -ForegroundColor Yellow
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

# Test DNS Resolution
Write-Host "1. Testing DNS Resolution..." -ForegroundColor Yellow
Write-Host ""

Write-Host "   Checking dokn.net..." -ForegroundColor Cyan
try {
    $dnsMain = Resolve-DnsName dokn.net -Type A -ErrorAction Stop
    Write-Host "   OK: dokn.net resolves to: $($dnsMain.IPAddress)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: dokn.net does not resolve!" -ForegroundColor Red
    Write-Host "   You need to add DNS records in Cloudflare" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "   Checking store1.dokn.net..." -ForegroundColor Cyan
try {
    $dnsSub = Resolve-DnsName store1.dokn.net -ErrorAction Stop
    if ($dnsSub.Type -eq "CNAME") {
        Write-Host "   OK: store1.dokn.net CNAME: $($dnsSub.NameHost)" -ForegroundColor Green
    } elseif ($dnsSub.Type -eq "A") {
        Write-Host "   OK: store1.dokn.net A: $($dnsSub.IPAddress)" -ForegroundColor Green
    }
} catch {
    Write-Host "   ERROR: store1.dokn.net does not resolve!" -ForegroundColor Red
    Write-Host "   You need to add wildcard DNS (*.dokn.net) in Cloudflare" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==============================================================" -ForegroundColor Cyan

# Test Backend API
Write-Host "2. Testing Backend API..." -ForegroundColor Yellow
Write-Host ""

Write-Host "   Checking Backend Health..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "https://dokan-backend-dev.fly.dev/api/health" -Method Get -ErrorAction Stop
    Write-Host "   OK: Backend is healthy: $($healthResponse.status)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: Backend health check failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "   Checking Store API (store1)..." -ForegroundColor Cyan
try {
    $storeResponse = Invoke-RestMethod -Uri "https://dokan-backend-dev.fly.dev/api/Store/by-subdomain/store1" -Method Get -ErrorAction Stop
    Write-Host "   OK: Store API works! Store: $($storeResponse.name)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "   WARNING: Store 'store1' not found in database" -ForegroundColor Yellow
        Write-Host "   Run setup_store1_dokn.sql to create the store" -ForegroundColor Cyan
    } else {
        Write-Host "   ERROR: Store API failed!" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==============================================================" -ForegroundColor Cyan

# Test Frontend
Write-Host "3. Testing Frontend..." -ForegroundColor Yellow
Write-Host ""

Write-Host "   Checking https://dokn.net ..." -ForegroundColor Cyan
try {
    $frontendResponse = Invoke-WebRequest -Uri "https://dokn.net" -Method Get -ErrorAction Stop -UseBasicParsing
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "   OK: Frontend is deployed and accessible!" -ForegroundColor Green
    }
} catch {
    Write-Host "   ERROR: Frontend is not accessible!" -ForegroundColor Red
    Write-Host "   You need to deploy Frontend to Vercel" -ForegroundColor Yellow
    Write-Host "   Run: cd SuperEcommere && vercel --prod" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "   Checking https://store1.dokn.net ..." -ForegroundColor Cyan
try {
    $subdomainResponse = Invoke-WebRequest -Uri "https://store1.dokn.net" -Method Get -ErrorAction Stop -UseBasicParsing
    if ($subdomainResponse.StatusCode -eq 200) {
        Write-Host "   OK: Subdomain is working!" -ForegroundColor Green
    }
} catch {
    Write-Host "   ERROR: Subdomain is not accessible!" -ForegroundColor Red
    Write-Host "   Make sure you added *.dokn.net in Vercel Domains" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==============================================================" -ForegroundColor Cyan

# Summary
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   If Frontend is not accessible:" -ForegroundColor Cyan
Write-Host "   1. Deploy to Vercel: vercel --prod" -ForegroundColor White
Write-Host "   2. Add domains in Vercel: dokn.net and *.dokn.net" -ForegroundColor White
Write-Host ""
Write-Host "   If DNS does not resolve:" -ForegroundColor Cyan
Write-Host "   1. Go to Cloudflare DNS settings" -ForegroundColor White
Write-Host "   2. Add A record for root domain" -ForegroundColor White
Write-Host "   3. Add CNAME for wildcard subdomain" -ForegroundColor White
Write-Host ""
Write-Host "   If Store not found:" -ForegroundColor Cyan
Write-Host "   1. Run setup_store1_dokn.sql in Supabase" -ForegroundColor White
Write-Host ""
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""
