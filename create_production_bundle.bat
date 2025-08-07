@echo off
echo Creating production bundle...

REM Create a clean directory for production
if exist "production-bundle" rmdir /s /q "production-bundle"
mkdir "production-bundle"

REM Copy essential files
copy package.json production-bundle\
copy next.config.js production-bundle\
copy tailwind.config.js production-bundle\
copy tsconfig.json production-bundle\
copy postcss.config.js production-bundle\
copy next-env.d.ts production-bundle\

REM Copy directories
xcopy /E /I "pages" "production-bundle\pages"
xcopy /E /I "components" "production-bundle\components"
xcopy /E /I "lib" "production-bundle\lib"
xcopy /E /I "styles" "production-bundle\styles"
xcopy /E /I "public" "production-bundle\public"

REM Create .env template
echo # Environment Variables > production-bundle\.env.local
echo DB_HOST=localhost >> production-bundle\.env.local
echo DB_USER=your_username >> production-bundle\.env.local
echo DB_PASSWORD=your_password >> production-bundle\.env.local
echo DB_NAME=tracker_db >> production-bundle\.env.local
echo NEXTAUTH_URL=http://localhost:3000 >> production-bundle\.env.local
echo NEXTAUTH_SECRET=your_secret_key >> production-bundle\.env.local

REM Create deployment instructions
echo # Deployment Instructions > production-bundle\DEPLOY.md
echo 1. Extract this bundle to your server >> production-bundle\DEPLOY.md
echo 2. Install Node.js 18+ on your server >> production-bundle\DEPLOY.md
echo 3. Run: npm install >> production-bundle\DEPLOY.md
echo 4. Configure .env.local with your database credentials >> production-bundle\DEPLOY.md
echo 5. Run: npm run build >> production-bundle\DEPLOY.md
echo 6. Run: npm start >> production-bundle\DEPLOY.md
echo 7. Access: http://your-server-ip:3000 >> production-bundle\DEPLOY.md

REM Create ZIP file
powershell Compress-Archive -Path "production-bundle\*" -DestinationPath "tracker-production-bundle.zip" -Force

echo Production bundle created: tracker-production-bundle.zip
echo Ready to upload to your server!
pause 