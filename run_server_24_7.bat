@echo off
title AI Summarizer Server (24/7 Run)
:loop
echo [%date% %time%] Starting server (serving frontend on port 5000)...
call .\env\Scripts\python.exe backend/App.py
echo [%date% %time%] Server stopped or crashed. Restarting in 5 seconds...
timeout /t 5
goto loop
