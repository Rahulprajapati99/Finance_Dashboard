@echo off
echo ==========================================
echo   RP Solutionss Finance Dashboard Setup
echo ==========================================
echo.
echo [1/2] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo Error: npm install failed. Please make sure Node.js is installed.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Starting development server...
echo.
echo The application will start shortly. 
echo Please open the Local URL shown below in your browser (usually http://localhost:5173)
echo.
call npm run dev
pause
