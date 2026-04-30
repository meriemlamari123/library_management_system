from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from .models import Book

class BookResource(resources.ModelResource):
    class Meta:
        model = Book
        fields = ('title', 'author', 'isbn', 'category', 'total_copies', 'available_copies', 'language', 'pages')

@admin.register(Book)
class BookAdmin(ImportExportModelAdmin):
    resource_class = BookResource
    list_display = ('title', 'author', 'isbn', 'category', 'total_copies', 'available_copies')
    search_fields = ('title', 'author', 'isbn')
    list_filter = ('category', 'language')