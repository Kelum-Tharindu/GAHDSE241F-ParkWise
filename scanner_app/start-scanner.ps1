# ParkWise Scanner App - Quick Start Script
# Run this script to quickly set up and run the scanner app

Write-Host "🚀 ParkWise Scanner App - Quick Start" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to scanner app directory
$scannerPath = "c:\Users\Tharindu\Desktop\nw\GAHDSE241F-ParkWise\scanner_app"
Write-Host "📁 Navigating to scanner app directory..." -ForegroundColor Yellow
Set-Location $scannerPath

# Check Flutter installation
Write-Host "🔍 Checking Flutter installation..." -ForegroundColor Yellow
flutter doctor --version

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
flutter pub get

# Run tests
Write-Host "🧪 Running tests..." -ForegroundColor Yellow
dart test_app.dart

# Check for errors
Write-Host "🔍 Checking for compilation errors..." -ForegroundColor Yellow
flutter analyze

Write-Host ""
Write-Host "✅ Setup complete! Choose a platform to run:" -ForegroundColor Green
Write-Host ""
Write-Host "1️⃣  Web (Chrome): flutter run -d chrome --web-port=8080" -ForegroundColor White
Write-Host "2️⃣  Windows: flutter run -d windows" -ForegroundColor White
Write-Host "3️⃣  Android: flutter run -d android" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Available build commands:" -ForegroundColor Cyan
Write-Host "   flutter build web" -ForegroundColor White
Write-Host "   flutter build windows --release" -ForegroundColor White
Write-Host "   flutter build apk --release" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   README.md - Complete setup guide" -ForegroundColor White
Write-Host "   DEPLOYMENT.md - Deployment instructions" -ForegroundColor White
Write-Host "   PROJECT_SUMMARY.md - Project overview" -ForegroundColor White
Write-Host ""

# Prompt user for next action
$choice = Read-Host "Enter platform to run (web/windows/android) or 'exit'"

switch ($choice.ToLower()) {
    "web" {
        Write-Host "🌐 Starting web version..." -ForegroundColor Green
        flutter run -d chrome --web-port=8080
    }
    "windows" {
        Write-Host "🖥️ Starting Windows desktop version..." -ForegroundColor Green
        flutter run -d windows
    }
    "android" {
        Write-Host "📱 Starting Android version..." -ForegroundColor Green
        flutter run -d android
    }
    "exit" {
        Write-Host "👋 Goodbye!" -ForegroundColor Yellow
    }
    default {
        Write-Host "ℹ️ Use the commands above to run the app manually." -ForegroundColor Blue
    }
}
