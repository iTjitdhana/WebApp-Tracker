@echo off
echo Creating ZIP file...
powershell -Command "Compress-Archive -Path 'esp-tracker-release\*' -DestinationPath 'esp-tracker-web-v2.2.zip' -Force"
if exist "esp-tracker-web-v2.2.zip" (
    echo ZIP file created successfully!
    dir esp-tracker-web-v2.2.zip
) else (
    echo Failed to create ZIP file!
)
pause 