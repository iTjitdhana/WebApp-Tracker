Write-Host "Creating ZIP file..." -ForegroundColor Green

$sourceDir = "esp-tracker-release"
$zipFile = "esp-tracker-web-v2.2.zip"

# ลบไฟล์ ZIP เดิมถ้ามี
if (Test-Path $zipFile) {
    Remove-Item $zipFile -Force
    Write-Host "Removed existing ZIP file" -ForegroundColor Yellow
}

# สร้างไฟล์ ZIP ใหม่
try {
    Compress-Archive -Path "$sourceDir\*" -DestinationPath $zipFile -Force
    $size = (Get-Item $zipFile).Length
    Write-Host "ZIP file created successfully!" -ForegroundColor Green
    Write-Host "File: $zipFile" -ForegroundColor Cyan
    Write-Host "Size: $size bytes" -ForegroundColor Cyan
} catch {
    Write-Host "Error creating ZIP file: $($_.Exception.Message)" -ForegroundColor Red
} 