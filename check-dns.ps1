# Quick DNS Check
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "   DNS Status Check" -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# Flush DNS first
Write-Host "Flushing DNS cache..." -ForegroundColor Cyan
ipconfig /flushdns | Out-Null
Write-Host "OK: DNS cache cleared" -ForegroundColor Green
Write-Host ""

# Check main domain
Write-Host "Checking dokn.net..." -ForegroundColor Cyan
$dnsMain = nslookup dokn.net 2>&1 | Out-String
if ($dnsMain -match "76.76.21") {
    Write-Host "OK: dokn.net resolves correctly" -ForegroundColor Green
} else {
    Write-Host "ERROR: dokn.net does not resolve!" -ForegroundColor Red
    Write-Host $dnsMain -ForegroundColor Gray
}

Write-Host ""

# Check wildcard subdomain
Write-Host "Checking store1.dokn.net..." -ForegroundColor Cyan
$dnsSub = nslookup store1.dokn.net 2>&1 | Out-String
if ($dnsSub -match "76.76.21" -or $dnsSub -match "cname.vercel-dns.com") {
    Write-Host "OK: store1.dokn.net resolves correctly" -ForegroundColor Green
} else {
    Write-Host "ERROR: store1.dokn.net does not resolve!" -ForegroundColor Red
    Write-Host "Make sure wildcard CNAME (*) is set to DNS only in Cloudflare" -ForegroundColor Yellow
}

Write-Host ""

# Check if sites are accessible
Write-Host "Checking https://dokn.net ..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://dokn.net" -Method Get -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    Write-Host "OK: Main site is accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Main site is not accessible!" -ForegroundColor Red
}

Write-Host ""

Write-Host "Checking https://store1.dokn.net ..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://store1.dokn.net" -Method Get -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    Write-Host "OK: Subdomain is accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Subdomain is not accessible!" -ForegroundColor Red
    Write-Host "This is expected if DNS has not propagated yet." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If wildcard subdomain does not work:" -ForegroundColor Yellow
Write-Host "1. Check Cloudflare: CNAME * -> cname.vercel-dns.com (DNS only)" -ForegroundColor White
Write-Host "2. Wait 5-10 minutes for DNS propagation" -ForegroundColor White
Write-Host "3. In Vercel: Remove and re-add *.dokn.net domain" -ForegroundColor White
Write-Host ""
