"""
In this file, we will define the models for the authors app.
"""

from django.db import models
from django.utils import timezone


class Author(models.Model):
    """
    Author model representing a book author.

    Relationships:
        - books: Reverse ForeignKey from Book (one-to-many)
    """

    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "authors"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["email"]),
            models.Index(fields=["name"]),
            models.Index(fields=["created_at"]),
        ]
        verbose_name = "Author"
        verbose_name_plural = "Authors"

    def __str__(self):
        return self.name
