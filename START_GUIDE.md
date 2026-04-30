# 🚀 Guide Complet : Lancer le projet "Library Management System" (Microservices)

Ce projet utilise une architecture **Microservices**. Cela signifie que le backend est divisé en quatre services indépendants (User, Books, Loans, Notifications) tournant sur des ports différents, en plus du Frontend React/Vite. Ces services communiquent ensemble via **Consul** et **RabbitMQ**.

Voici la démarche étape par étape pour tout exécuter sur Windows.

---

## 🛠️ Étape 1 : Prérequis système

1. **Python** (version 3.8 à 3.12).
2. **Node.js** (version 18+).
3. **Serveur MySQL** (ex. WAMP ou XAMPP), en cours d'exécution.
4. **RabbitMQ** ou Docker pour l'exécuter localement.
5. **Consul** (Service Discovery) ou Docker pour l'exécuter localement.

Si vous avez **Docker Desktop**, lancez RabbitMQ et Consul avec ces commandes (dans PowerShell) :
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
docker run -d --name consul -p 8500:8500 -p 8600:8600/udp consul
```

---

## 💾 Étape 2 : Configuration des Bases de Données MySQL

Les services back-end nécessitent leurs propres bases de données dans MySQL.
Ouvrez votre gestionnaire MySQL (phpMyAdmin, DBeaver, ou la CLI MySQL) et exécutez ces requêtes :

```sql
CREATE DATABASE user_service_db;
CREATE DATABASE books_service_db;
CREATE DATABASE loans_service_db;
CREATE DATABASE notifications_service_db;
```
*(Vérifiez les noms exacts dans les fichiers `settings.py` de chaque service sous la clé `DATABASES`. Par défaut, le mot de passe root est supposé vide `''` ou doit être configuré dans les `.env`)*.

---

## 🐍 Étape 3 : Configuration de l'environnement Python

Dans un terminal PowerShell situé à la racine de votre projet :

```powershell
# 1. Allez dans le dossier backend
cd backend

# 2. Créez un environnement virtuel (si ce n'est pas déjà fait)
python -m venv venv

# 3. Activez l'environnement virtuel (important à chaque fois)
.\venv\Scripts\activate

# 4. Installez les dépendances globales du backend
pip install -r requirements.txt
```

---

## ⚙️ Étape 4 : Migrations (Création des tables par service)

Toujours avec l'environnement virtuel **activé** (`(venv)` affiché dans le terminal), vous devez exécuter les migrations pour chaque microservice :

```powershell
# Service Utilisateurs (Port 8001)
cd user_service
python manage.py makemigrations
python manage.py migrate
cd ..

# Service Livres (Port 8002)
cd books_service
python manage.py makemigrations
python manage.py migrate
cd ..

# Service Emprunts (Port 8003)
cd loans_service
python manage.py makemigrations
python manage.py migrate
cd ..

# Service Notifications (Port 8004)
cd library_notifications_service
python manage.py makemigrations
python manage.py migrate
cd ..
```

---

## 🟢 Étape 5 : Démarrage des Microservices (Backend)

Vous devez ouvrir **4 terminaux différents**, un pour chaque microservice. Pour chaque terminal, faites :
1. Allez dans `backend/`
2. Lancez `.\venv\Scripts\activate`
3. Exécutez les commandes ci-dessous :

- **Terminal 1 : User Service**
  ```powershell
  cd user_service
  python manage.py runserver 8001
  ```
- **Terminal 2 : Books Service**
  ```powershell
  cd books_service
  python manage.py runserver 8002
  ```
- **Terminal 3 : Loans Service**
  ```powershell
  cd loans_service
  python manage.py runserver 8003
  ```
- **Terminal 4 : Notifications Service**
  ```powershell
  cd library_notifications_service
  python manage.py runserver 8004
  ```

---

## 🌐 Étape 6 : Démarrage du Frontend (Vite/React)

Ouvrez un **5ème terminal** à la racine de votre projet, et allez dans le dossier frontend :

```powershell
cd frontend

# Installer les dépendances Node (la première fois)
npm install

# Démarrer le serveur React (Vite)
npm run dev
```
*(Le frontend sera généralement disponible sur `http://localhost:3000` ou `http://localhost:5173` dans votre navigateur).*

---

## 💡 Astuce de lancement : Script automatisé (Optionnel)
Pour vous éviter d'ouvrir 5 fenêtres, vous pouvez créer un fichier `start_all.bat` à la racine pour lancer tous ces modules en un clic avec la commande `start cmd /k "..."`.
