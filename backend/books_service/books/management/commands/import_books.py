import random
from django.core.management.base import BaseCommand
from books.models import Book
import string

class Command(BaseCommand):
    help = 'Imports or generates 10,000 mock books into the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--total',
            type=int,
            default=10000,
            help='The total number of books to generate',
        )

    def handle(self, *args, **options):
        total = options['total']
        self.stdout.write(self.style.SUCCESS(f'Starting generation of {total} books...'))

        categories = [
            'FICTION', 'NON_FICTION', 'SCIENCE', 'TECHNOLOGY', 
            'HISTORY', 'BIOGRAPHY', 'CHILDREN', 'EDUCATION', 
            'POETRY', 'OTHER'
        ]
        
        adjectives = ['The Great', 'Advanced', 'Secret of', 'Understanding', 'A Guide to', 'Modern', 'Ancient', 'Forgotten', 'Infinite', 'Elementary']
        nouns = ['Universe', 'Coding', 'Mind', 'Library', 'Galaxy', 'Database', 'Python', 'History', 'Philosophy', 'Art', 'Design', 'Architecture', 'Cooking']
        authors = ['Jean-Marc Dubois', 'Alice Durand', 'Houssem Keddam', 'Marie Lefebvre', 'Pierre Martin', 'Lucie Bernard', 'Thomas Petit', 'Sarah Richard', 'Kevin Lopez', 'Emma Fournier']
        publishers = ['Addison-Wesley', 'O\'Reilly', 'Pearson', 'Academic Press', 'Manning', 'Springer', 'Penguin', 'HarperCollins']
        languages = ['Français', 'English', 'Español']

        books_to_create = []
        isbns_seen = set()

        # Get existing ISBNs to avoid collisions
        existing_isbns = set(Book.objects.values_list('isbn', flat=True))
        isbns_seen.update(existing_isbns)

        for i in range(total):
            # Generate a unique 13-digit ISBN
            while True:
                isbn = ''.join(random.choices(string.digits, k=13))
                if isbn not in isbns_seen:
                    isbns_seen.add(isbn)
                    break
            
            title = f"{random.choice(adjectives)} {random.choice(nouns)} Vol. {random.randint(1, 100)}"
            author = random.choice(authors)
            publisher = random.choice(publishers)
            category = random.choice(categories)
            year = random.randint(1950, 2024)
            pages = random.randint(50, 1200)
            copies = random.randint(1, 10)
            
            description = f"Une étude approfondie sur {title.lower()}, couvrant les aspects essentiels de {category.lower()}."
            
            book = Book(
                isbn=isbn,
                title=title,
                author=author,
                publisher=publisher,
                publication_year=year,
                category=category,
                description=description,
                cover_image_url=f"https://picsum.photos/seed/{isbn}/200/300",
                language=random.choice(languages),
                pages=pages,
                total_copies=copies,
                available_copies=copies,
                average_rating=round(random.uniform(3.0, 5.0), 2),
                times_borrowed=random.randint(0, 100),
                is_available=True
            )
            books_to_create.append(book)

            # Bulk create in chunks to avoid memory issues
            if len(books_to_create) >= 1000:
                Book.objects.bulk_create(books_to_create)
                self.stdout.write(self.style.SUCCESS(f'Inserted {i+1} books...'))
                books_to_create = []

        # Insert remaining books
        if books_to_create:
            Book.objects.bulk_create(books_to_create)

        self.stdout.write(self.style.SUCCESS(f'Successfully imported {total} books!'))
