@echo off
echo =================================================================
echo   DEMARRAGE DU SYSTEME DE GESTION DE BIBLIOTHEQUE (MICROSERVICES)
echo =================================================================
echo.
echo [1/5] Lancement du User Service (Port 8001)...
start cmd.exe /k "cd backend && call venv\Scripts\activate.bat && cd user_service && python manage.py runserver 8001"

echo [2/5] Lancement du Books Service (Port 8002)...
start cmd.exe /k "cd backend && call venv\Scripts\activate.bat && cd books_service && python manage.py runserver 8002"

echo [3/5] Lancement du Loans Service (Port 8003)...
start cmd.exe /k "cd backend && call venv\Scripts\activate.bat && cd loans_service && python manage.py runserver 8003"

echo [4/5] Lancement du Notifications Service (Port 8004)...
start cmd.exe /k "cd backend && call venv\Scripts\activate.bat && cd library_notifications_service && python manage.py runserver 8004"

echo [5/5] Lancement du Frontend (Port 3000/5173)...
start cmd.exe /k "cd frontend && npm run dev"

echo.
echo Tous les terminaux ont ete lances ! 
echo N'oubliez pas d'avoir Docker (Consul/RabbitMQ) et MySQL en cours d'execution au prealable.
echo.
pause
