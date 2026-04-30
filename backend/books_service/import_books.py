import csv
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'books_service.settings')
django.setup()

from books.models import Book

csv_file = 'livres_10000.csv'

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        Book.objects.create(
            title=row['title'],
            author=row['author'],
            isbn=row['isbn'][:20],
            category=row['category'],
            total_copies=int(row['total_copies']),
            available_copies=int(row['available_copies']),
            publication_year=2000,  # valeur par défaut
            pages=0,                # ← ajouté pour éviter l'erreur
        )
        print(f"Ajouté : {row['title']}")

print("Importation terminée !")