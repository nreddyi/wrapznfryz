# Downloads Wrapz N Fryz product photos from the live site into images/products/.
# Run from the project folder:  powershell -ExecutionPolicy Bypass -File tools\get-photos.ps1
# Any photo that can't be found is skipped; the site keeps the cartoon for that item.

$dest = Join-Path $PSScriptRoot "..\images\products"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$base = "https://wrapznfryz.com"
$photos = [ordered]@{
  "classic-veggie.png"          = "/Wraps/Classic Veggie_wrap.png"
  "butter-garlic-mushroom.png"  = "/Wraps/Butter Garlic Mushroom_wrap.png"
  "crispy-paneer.png"           = "/Wraps/Crispy Paneer_wrap.png"
  "cheesy-paneer.png"           = "/Wraps/Cheesy Paneer_wrap.png"
  "crispy-chicken.png"          = "/Wraps/Crispy Chicken_wrap.png"
  "chilli-chicken.png"          = "/Wraps/Chilli Chicken_wrap.png"
  "smoky-tandoori-chicken.png"  = "/Wraps/Smoky Tandoori Chicken_wrap.png"
  "cheesy-mexican-chicken.png"  = "/Wraps/Cheesy Mexican Chicken_wrap.png"
  "fully-loaded-chicken.png"    = "/Wraps/Fully Loaded Chicken_wrap.png"
  "cheesy-loaded-fries.png"     = "/Fries/Cheesy Loaded Fries.png"
  "salted-fries.png"            = "/Fries/Salted Fries.png"
  "plain-fries.png"             = "/Fries/Plain Fries.png"
}

foreach ($name in $photos.Keys) {
  $url = $base + ($photos[$name] -replace ' ', '%20')
  $out = Join-Path $dest $name
  try {
    Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing -ErrorAction Stop
    Write-Host "OK    $name" -ForegroundColor Green
  } catch {
    Write-Host "skip  $name (not found at $url)" -ForegroundColor Yellow
    if (Test-Path $out) { Remove-Item $out }
  }
}
Write-Host "`nDone. Open index.html to see the photos." -ForegroundColor Cyan
