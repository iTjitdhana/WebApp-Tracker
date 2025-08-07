@echo off
echo Creating ZIP file...
powershell -Command "Compress-Archive -Path 'esp-tracker-release\*' -DestinationPath 'esp-tracker-web-v2.2.zip' -Force"
echo ZIP file created successfully!
pause 