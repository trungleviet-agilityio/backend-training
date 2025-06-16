"""
In this file, we will define the models for the books app.
"""

from django.db import models
from django.utils import timezone


class Book(models.Model):
    """
    Book model representing a book in the system.

    Relationships:
        - author: ForeignKey to Author (many-to-one)
        - categories: ManyToManyField to Category (many-to-many)
    """

    title = models.CharField(max_length=200)
    isbn = models.CharField(max_length=13, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    author = models.ForeignKey(
        "books.Author",
        on_delete=models.CASCADE,
        related_name="books",
        help_text="The author of this book",
    )
    categories = models.ManyToManyField(
        "books.Category",
        related_name="books",
        help_text="Categories this book belongs to",
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "books"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["isbn"]),
            models.Index(fields=["title"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return self.title
