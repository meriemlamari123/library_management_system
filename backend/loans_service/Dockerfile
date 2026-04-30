FROM python:3.10-slim

# Évite la génération de fichiers .pyc et assure un affichage immédiat des logs
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Installation des dépendances système nécessaires pour mysqlclient et autres
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Installation des dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie du code source
COPY . .

# Le port sera exposé via docker-compose
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
