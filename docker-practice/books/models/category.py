"""
In this file, we will define the models for the categories app.
"""

from django.db import models
from django.utils import timezone


class Category(models.Model):
    """
    Category model representing a book category/genre.

    Relationships:
        - books: Reverse ManyToManyField from Book (many-to-many)
    """

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "categories"
        ordering = ["name"]
        verbose_name_plural = "categories"
        indexes = [
            models.Index(fields=["name"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return self.name
