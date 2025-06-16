"""
Business logic services for author management.
This layer handles complex business operations and keeps viewsets clean.
"""

from django.db import models, transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

from books.models.author import Author


class AuthorService:
    """
    Service class for handling author-related business logic.
    """

    @staticmethod
    def get_all_authors():
        """
        Retrieve all authors with optimized queries.
        """
        return Author.objects.prefetch_related("books").all()

    @staticmethod
    def get_author_by_id(author_id):
        """
        Retrieve a specific author by ID.
        """
        return get_object_or_404(Author.objects.prefetch_related("books"), id=author_id)

    @staticmethod
    @transaction.atomic
    def create_author(validated_data):
        """
        Create a new author with business logic validation.
        """
        # Check for duplicate email
        email = validated_data.get("email")
        if Author.objects.filter(email=email).exists():
            raise ValidationError({"email": "Author with this email already exists."})

        author = Author.objects.create(**validated_data)
        return author

    @staticmethod
    @transaction.atomic
    def update_author(author_id, validated_data):
        """
        Update an existing author with business logic validation.
        """
        author = AuthorService.get_author_by_id(author_id)

        # Check for duplicate email (excluding current author)
        email = validated_data.get("email")
        if email and Author.objects.filter(email=email).exclude(id=author_id).exists():
            raise ValidationError({"email": "Author with this email already exists."})

        # Update fields
        for field, value in validated_data.items():
            setattr(author, field, value)

        author.save()
        return author

    @staticmethod
    @transaction.atomic
    def delete_author(author_id):
        """
        Delete an author with business logic checks.
        """
        author = AuthorService.get_author_by_id(author_id)

        # Check if author has books
        book_count = author.books.count()
        if book_count > 0:
            raise ValidationError(
                {
                    "detail": f"Cannot delete author. Author has {book_count} book(s) assigned. "
                    "Please reassign or delete the books first."
                }
            )

        author.delete()
        return True

    @staticmethod
    def get_author_books(author_id):
        """
        Get all books by a specific author.
        """
        author = AuthorService.get_author_by_id(author_id)
        return author.books.all()

    @staticmethod
    def get_author_statistics(author_id):
        """
        Get statistics for an author.
        """
        author = AuthorService.get_author_by_id(author_id)
        books = author.books.all()

        return {
            "total_books": books.count(),
            "total_categories": books.values("categories").distinct().count(),
            "average_price": books.aggregate(avg_price=models.Avg("price"))["avg_price"]
            or 0,
            "latest_book": books.first().title if books.exists() else None,
        }
