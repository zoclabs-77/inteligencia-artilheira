$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path -LiteralPath $chrome)) {
  $chrome = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
}
if (-not (Test-Path -LiteralPath $chrome)) {
  throw "Chrome or Edge was not found."
}

$htmlPath = Join-Path $root "index.html"
$profile = Join-Path $root "chrome-profile"
New-Item -ItemType Directory -Force -Path $profile | Out-Null

$fileUrl = "file:///" + ($htmlPath -replace "\\", "/")

for ($i = 1; $i -le 5; $i++) {
  $slide = "{0:D2}" -f $i
  $out = Join-Path $root ("slide-$slide.png")
  if (Test-Path -LiteralPath $out) {
    Remove-Item -LiteralPath $out -Force
  }

  & $chrome `
    --headless=new `
    --disable-gpu `
    --disable-background-networking `
    --disable-sync `
    --hide-scrollbars `
    --force-device-scale-factor=1 `
    --window-size=1080,1350 `
    "--user-data-dir=$profile" `
    "--screenshot=$out" `
    "$fileUrl`?slide=$i"

  $attempt = 0
  while (-not (Test-Path -LiteralPath $out) -and $attempt -lt 30) {
    Start-Sleep -Milliseconds 250
    $attempt++
  }

  if (-not (Test-Path -LiteralPath $out)) {
    throw "Failed to export slide $slide."
  }
}

Get-ChildItem -LiteralPath $root -Filter "slide-*.png" | Select-Object Name, Length
