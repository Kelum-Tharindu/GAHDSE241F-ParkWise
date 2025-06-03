# Customer Assignments Integration Test Script
# This script tests the complete Sub Bulk Booking system

param(
    [switch]$BackendOnly,
    [switch]$FrontendOnly,
    [switch]$TestOnly,
    [switch]$Help
)

if ($Help) {
    Write-Host "🚀 Customer Assignments Integration Test Script" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\test-customer-assignments.ps1          # Run full integration test"
    Write-Host "  .\test-customer-assignments.ps1 -BackendOnly    # Start only backend server"
    Write-Host "  .\test-customer-assignments.ps1 -FrontendOnly   # Start only frontend server"
    Write-Host "  .\test-customer-assignments.ps1 -TestOnly       # Run API tests only"
    Write-Host "  .\test-customer-assignments.ps1 -Help           # Show this help"
    Write-Host ""
    Write-Host "Features:" -ForegroundColor Green
    Write-Host "  ✅ Automated server startup"
    Write-Host "  ✅ Backend API testing"
    Write-Host "  ✅ Frontend component verification"
    Write-Host "  ✅ End-to-end integration testing"
    Write-Host "  ✅ Error reporting and troubleshooting"
    exit 0
}

function Write-ColorMessage {
    param (
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Test-Port {
    param (
        [int]$Port
    )
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port $Port -WarningAction SilentlyContinue
        return $connection.TcpTestSucceeded
    } catch {
        return $false
    }
}

function Start-Backend {
    Write-ColorMessage "🔧 Starting Backend Server..." "Cyan"
    
    # Check if backend directory exists
    if (-not (Test-Path "back-end")) {
        Write-ColorMessage "❌ Backend directory not found!" "Red"
        Write-ColorMessage "💡 Make sure you're running this script from the project root directory" "Yellow"
        return $false
    }
    
    # Navigate to backend directory and start server
    Push-Location "back-end"
    
    try {
        # Check if dependencies are installed
        if (-not (Test-Path "node_modules")) {
            Write-ColorMessage "📦 Installing backend dependencies..." "Yellow"
            npm install
        }
        
        Write-ColorMessage "🚀 Starting backend server on port 5000..." "Green"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal
        
        # Wait for server to start
        Write-ColorMessage "⏳ Waiting for backend server to start..." "Yellow"
        $timeout = 30
        $elapsed = 0
        
        do {
            Start-Sleep -Seconds 1
            $elapsed++
            if (Test-Port 5000) {
                Write-ColorMessage "✅ Backend server is running on http://localhost:5000" "Green"
                Pop-Location
                return $true
            }
        } while ($elapsed -lt $timeout)
        
        Write-ColorMessage "❌ Backend server failed to start within $timeout seconds" "Red"
        Pop-Location
        return $false
        
    } catch {
        Write-ColorMessage "❌ Error starting backend: $($_.Exception.Message)" "Red"
        Pop-Location
        return $false
    }
}

function Start-Frontend {
    Write-ColorMessage "🎨 Starting Frontend Server..." "Cyan"
    
    # Check if frontend directory exists
    if (-not (Test-Path "new front-end")) {
        Write-ColorMessage "❌ Frontend directory not found!" "Red"
        return $false
    }
    
    # Navigate to frontend directory and start server
    Push-Location "new front-end"
    
    try {
        # Check if dependencies are installed
        if (-not (Test-Path "node_modules")) {
            Write-ColorMessage "📦 Installing frontend dependencies..." "Yellow"
            npm install
        }
        
        Write-ColorMessage "🚀 Starting frontend server..." "Green"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal
        
        # Wait for server to start
        Write-ColorMessage "⏳ Waiting for frontend server to start..." "Yellow"
        $timeout = 30
        $elapsed = 0
        
        do {
            Start-Sleep -Seconds 1
            $elapsed++
            # Vite typically uses port 5173
            if (Test-Port 5173) {
                Write-ColorMessage "✅ Frontend server is running on http://localhost:5173" "Green"
                Pop-Location
                return $true
            }
        } while ($elapsed -lt $timeout)
        
        Write-ColorMessage "❌ Frontend server failed to start within $timeout seconds" "Red"
        Pop-Location
        return $false
        
    } catch {
        Write-ColorMessage "❌ Error starting frontend: $($_.Exception.Message)" "Red"
        Pop-Location
        return $false
    }
}

function Test-BackendAPI {
    Write-ColorMessage "🧪 Testing Backend API..." "Cyan"
    
    if (-not (Test-Path "back-end\tests\testSubBulkBookingAPI.js")) {
        Write-ColorMessage "❌ Test file not found!" "Red"
        return $false
    }
    
    Push-Location "back-end"
    
    try {
        Write-ColorMessage "🔬 Running Sub Bulk Booking API tests..." "Yellow"
        $result = node "tests\testSubBulkBookingAPI.js"
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorMessage "✅ Backend API tests completed successfully" "Green"
            Pop-Location
            return $true
        } else {
            Write-ColorMessage "❌ Backend API tests failed" "Red"
            Write-ColorMessage $result "Red"
            Pop-Location
            return $false
        }
        
    } catch {
        Write-ColorMessage "❌ Error running API tests: $($_.Exception.Message)" "Red"
        Pop-Location
        return $false
    }
}

function Open-TestPage {
    Write-ColorMessage "🌐 Opening Integration Test Page..." "Cyan"
    
    $testPagePath = "customer-assignments-test.html"
    
    if (Test-Path $testPagePath) {
        $fullPath = Resolve-Path $testPagePath
        Write-ColorMessage "📄 Opening test page: $fullPath" "Green"
        Start-Process $fullPath
        return $true
    } else {
        Write-ColorMessage "❌ Test page not found: $testPagePath" "Red"
        return $false
    }
}

function Show-Instructions {
    Write-ColorMessage "" "White"
    Write-ColorMessage "📋 Manual Testing Instructions:" "Yellow"
    Write-ColorMessage "═══════════════════════════════════════" "Yellow"
    Write-ColorMessage "1. Navigate to: http://localhost:5173" "White"
    Write-ColorMessage "2. Login as an Event Coordinator" "White"
    Write-ColorMessage "3. Go to the Dashboard" "White"
    Write-ColorMessage "4. Click on 'Customer Assignments' tab" "White"
    Write-ColorMessage "5. Test the following features:" "White"
    Write-ColorMessage "   ✓ View existing assignments" "Green"
    Write-ColorMessage "   ✓ Create new assignment (click '+' button)" "Green"
    Write-ColorMessage "   ✓ Edit existing assignment" "Green"
    Write-ColorMessage "   ✓ Delete assignment" "Green"
    Write-ColorMessage "   ✓ Form validation" "Green"
    Write-ColorMessage "   ✓ Error handling" "Green"
    Write-ColorMessage "" "White"
    Write-ColorMessage "🔍 Backend API is available at: http://localhost:5000/api" "Cyan"
    Write-ColorMessage "📊 Sub Bulk Booking endpoints:" "Cyan"
    Write-ColorMessage "   - GET  /api/sub-bulk-booking/owner/{id}" "White"
    Write-ColorMessage "   - GET  /api/sub-bulk-booking/available/{id}" "White"
    Write-ColorMessage "   - POST /api/sub-bulk-booking" "White"
    Write-ColorMessage "   - PUT  /api/sub-bulk-booking/{id}" "White"
    Write-ColorMessage "   - DELETE /api/sub-bulk-booking/{id}" "White"
    Write-ColorMessage "" "White"
}

# Main execution
Write-ColorMessage "🚀 Customer Assignments Integration Test" "Cyan"
Write-ColorMessage "════════════════════════════════════════" "Cyan"

# Handle different execution modes
if ($TestOnly) {
    Write-ColorMessage "🧪 Running API tests only..." "Yellow"
    Test-BackendAPI
    exit 0
}

if ($BackendOnly) {
    Write-ColorMessage "🔧 Starting backend server only..." "Yellow"
    $backendStarted = Start-Backend
    if ($backendStarted) {
        Show-Instructions
        Write-ColorMessage "Press any key to run API tests..." "Yellow"
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        Test-BackendAPI
    }
    exit 0
}

if ($FrontendOnly) {
    Write-ColorMessage "🎨 Starting frontend server only..." "Yellow"
    $frontendStarted = Start-Frontend
    if ($frontendStarted) {
        Show-Instructions
    }
    exit 0
}

# Full integration test
Write-ColorMessage "🔄 Running full integration test..." "Yellow"

# Step 1: Start Backend
$backendStarted = Start-Backend
if (-not $backendStarted) {
    Write-ColorMessage "❌ Cannot continue without backend server" "Red"
    exit 1
}

# Step 2: Start Frontend
$frontendStarted = Start-Frontend
if (-not $frontendStarted) {
    Write-ColorMessage "⚠️  Frontend failed to start, but backend is running" "Yellow"
    Write-ColorMessage "You can still test the API endpoints manually" "Yellow"
}

# Step 3: Run API Tests
Write-ColorMessage "🧪 Running automated API tests..." "Yellow"
$apiTestsPass = Test-BackendAPI

# Step 4: Open test page
Write-ColorMessage "🌐 Opening integration test page..." "Yellow"
$testPageOpened = Open-TestPage

# Step 5: Show results and instructions
Write-ColorMessage "" "White"
Write-ColorMessage "📊 Integration Test Results:" "Yellow"
Write-ColorMessage "═══════════════════════════════════" "Yellow"
Write-ColorMessage "Backend Server: $(if ($backendStarted) { '✅ Running' } else { '❌ Failed' })" "$(if ($backendStarted) { 'Green' } else { 'Red' })"
Write-ColorMessage "Frontend Server: $(if ($frontendStarted) { '✅ Running' } else { '❌ Failed' })" "$(if ($frontendStarted) { 'Green' } else { 'Red' })"
Write-ColorMessage "API Tests: $(if ($apiTestsPass) { '✅ Passed' } else { '❌ Failed' })" "$(if ($apiTestsPass) { 'Green' } else { 'Red' })"
Write-ColorMessage "Test Page: $(if ($testPageOpened) { '✅ Opened' } else { '❌ Failed' })" "$(if ($testPageOpened) { 'Green' } else { 'Red' })"

if ($backendStarted -and $frontendStarted) {
    Write-ColorMessage "" "White"
    Write-ColorMessage "🎉 Integration test setup complete!" "Green"
    Show-Instructions
} else {
    Write-ColorMessage "" "White"
    Write-ColorMessage "⚠️  Some components failed to start. Check the errors above." "Yellow"
}

Write-ColorMessage "" "White"
Write-ColorMessage "💡 Tips for troubleshooting:" "Yellow"
Write-ColorMessage "   - Ensure Node.js is installed and up to date" "White"
Write-ColorMessage "   - Check that ports 5000 and 5173 are available" "White"
Write-ColorMessage "   - Verify MongoDB is running (for backend)" "White"
Write-ColorMessage "   - Check network connectivity" "White"
Write-ColorMessage "" "White"
Write-ColorMessage "Press any key to exit..." "Gray"
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
