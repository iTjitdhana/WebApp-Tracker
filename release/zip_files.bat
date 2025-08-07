@echo off
echo Creating ZIP file...
echo.

REM ลบไฟล์ ZIP เดิมถ้ามี
if exist "esp-tracker-web-v2.2.zip" (
    del "esp-tracker-web-v2.2.zip"
    echo Removed existing ZIP file
)

REM สร้างไฟล์ ZIP ใหม่
echo Creating new ZIP file...
powershell -command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('esp-tracker-release', 'esp-tracker-web-v2.2.zip')"

if exist "esp-tracker-web-v2.2.zip" (
    echo.
    echo ZIP file created successfully!
    echo File: esp-tracker-web-v2.2.zip
    for %%A in ("esp-tracker-web-v2.2.zip") do echo Size: %%~zA bytes
) else (
    echo.
    echo Failed to create ZIP file!
)

echo.
pause 