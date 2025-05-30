# Run both frontend and backend development servers
# This script ensures the ports are consistent across the application

# Define colors for output
$Green = [ConsoleColor]::Green
$Cyan = [ConsoleColor]::Cyan
$Yellow = [ConsoleColor]::Yellow
$Red = [ConsoleColor]::Red

# Function to print colored messages
function Write-ColorMessage {
    param (
        [string]$Message,
        [ConsoleColor]$Color
    )
    Write-Host $Message -ForegroundColor $Color
}

Write-ColorMessage "Starting ParkWise Development Environment..." $Cyan
Write-ColorMessage "----------------------------------------" $Cyan

# Check if .env files exist
$backendEnvPath = "c:\Users\Tharindu\Desktop\nw\GAHDSE241F-ParkWise\back-end\.env"
$frontendEnvPath = "c:\Users\Tharindu\Desktop\nw\GAHDSE241F-ParkWise\new front-end\.env"

if (-not (Test-Path $backendEnvPath)) {
    Write-ColorMessage "❌ Backend .env file not found. Creating default .env file..." $Yellow
    
    @"
# MongoDB Connection - Update with your actual MongoDB URI
MONGO_URI=mongodb://localhost:27017/parkwise

# JWT Secret
JWT_SECRET=parkwise_jwt_secret_key_for_development

# Server Port - Make sure this matches with frontend API_URL
PORT=5000

# Other Environment Variables
NODE_ENV=development
"@ | Out-File -FilePath $backendEnvPath -Encoding utf8
    
    Write-ColorMessage "✅ Backend .env file created at $backendEnvPath" $Green
    Write-ColorMessage "⚠️ Please update the MONGO_URI with your actual MongoDB connection string" $Yellow
}

if (-not (Test-Path $frontendEnvPath)) {
    Write-ColorMessage "❌ Frontend .env file not found. Creating default .env file..." $Yellow
    
    @"
# API URL - Make sure this matches with backend PORT
VITE_API_URL=http://localhost:5000/api

# Environment
VITE_APP_ENV=development

# Debug mode
VITE_APP_DEBUG=true
"@ | Out-File -FilePath $frontendEnvPath -Encoding utf8
    
    Write-ColorMessage "✅ Frontend .env file created at $frontendEnvPath" $Green
}

# Verify that backend and frontend ports match
$backendPort = Get-Content $backendEnvPath | Where-Object { $_ -match "PORT=" } | ForEach-Object { $_.Split("=")[1] }
$frontendApiUrl = Get-Content $frontendEnvPath | Where-Object { $_ -match "VITE_API_URL=" } | ForEach-Object { $_.Split("=")[1] }

if ($backendPort -and $frontendApiUrl) {
    if (-not $frontendApiUrl.Contains("localhost:$backendPort")) {
        Write-ColorMessage "⚠️ Warning: Frontend API URL doesn't match backend port!" $Yellow
        Write-ColorMessage "Backend PORT=$backendPort, Frontend API URL=$frontendApiUrl" $Yellow
        Write-ColorMessage "Please update the VITE_API_URL in the frontend .env file to match the backend port" $Yellow
    } else {
        Write-ColorMessage "✅ Frontend and backend ports are correctly configured" $Green
    }
}

# Check if the MongoDB connection can be established
Write-ColorMessage "Testing MongoDB connection..." $Cyan
$testResult = node "c:\Users\Tharindu\Desktop\nw\GAHDSE241F-ParkWise\back-end\tests\testMongoConnection.js"
if ($testResult -match "MongoDB Connection successful") {
    Write-ColorMessage "✅ MongoDB connection successful!" $Green
} else {
    Write-ColorMessage "❌ MongoDB connection failed. Please check your connection settings." $Red
    Write-ColorMessage "You might need to whitelist your IP address in MongoDB Atlas." $Yellow
    Write-ColorMessage "Continue anyway? (y/n)" $Yellow
    $continue = Read-Host
    if ($continue -ne "y") {
        Write-ColorMessage "Exiting..." $Red
        exit
    }
}

# Start the backend and frontend servers in separate PowerShell windows
Write-ColorMessage "Starting backend server..." $Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\Tharindu\Desktop\nw\GAHDSE241F-ParkWise\back-end' && npm run dev"

Write-ColorMessage "Starting frontend server..." $Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\Tharindu\Desktop\nw\GAHDSE241F-ParkWise\new front-end' && npm run dev"

Write-ColorMessage "✅ Development environment started!" $Green
Write-ColorMessage "Backend: http://localhost:$backendPort" $Cyan
Write-ColorMessage "Frontend: http://localhost:5173" $Cyan
Write-ColorMessage "----------------------------------------" $Cyan
