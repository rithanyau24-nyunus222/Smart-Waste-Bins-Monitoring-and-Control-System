@echo off
title CleanChennai — Hyper-Local Smart Waste Governance Platform
echo ===============================================================================
echo   CleanChennai: Hyper-Local Smart Waste Governance Platform
echo   Greater Chennai Corporation (GCC) Boundary: [80.1200 - 80.3500, 12.8500 - 13.2500]
echo ===============================================================================
echo.

echo [1/3] Starting Python FastAPI AI & Vision Microservice (Port 8000)...
start "CleanChennai AI Microservice (Port 8000)" cmd /k "cd ai-microservice && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/3] Starting Node.js / Express Core Backend (Port 5000)...
start "CleanChennai Backend Server (Port 5000)" cmd /k "cd server && npm start"

echo [3/3] Starting React 18 + Vite Client Application (Port 3000)...
start "CleanChennai React Client (Port 3000)" cmd /k "cd client && npm run dev"

echo.
echo ===============================================================================
echo   CleanChennai Platform Launched!
echo   - Web Application:       http://localhost:3000
echo   - Express Backend API:   http://localhost:5000
echo   - AI Vision Service:     http://localhost:8000
echo   - OGD GeoJSON Pipeline:  http://localhost:5000/api/v1/ogd/chennai-waste.geojson
echo   - PPT Diagrams:          Accessible directly inside the app under 'PPT Slides'
echo ===============================================================================
pause
