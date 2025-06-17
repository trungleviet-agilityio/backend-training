"""
Business logic services for the books app.
This layer handles complex business operations and keeps viewsets clean.
"""

from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

from books.models.author import Author
from books.models.book import Book
from books.models.category import Category


class BookService:
    """
    Service class for handling book-related business logic.
    """

    @staticmethod
    def get_all_books():
        """
        Retrieve all books with optimized queries.
        """
        return (
            Book.objects.select_related("author").prefetch_related("categories").all()
        )

    @staticmethod
    def get_book_by_id(book_id):
        """
        Retrieve a specific book by ID.
        """
        return get_object_or_404(
            Book.objects.select_related("author").prefetch_related("categories"),
            id=book_id,
        )

    @staticmethod
    @transaction.atomic
    def create_book(validated_data):
        """
        Create a new book with business logic validation.
        """
        # Extract author and categories data
        author_id = validated_data.pop("author_id")
        category_ids = validated_data.pop("category_ids", [])

        # Validate author exists
        try:
            author = Author.objects.get(id=author_id)
        except Author.DoesNotExist as err:
            raise ValidationError(
                {"author_id": "Author with this ID does not exist."}
            ) from err

        # Validate categories exist
        if category_ids:
            existing_categories = Category.objects.filter(id__in=category_ids)
            if len(existing_categories) != len(category_ids):
                invalid_ids = set(category_ids) - set(
                    existing_categories.values_list("id", flat=True)
                )
                raise ValidationError(
                    {
                        "category_ids": f"Categories with IDs {list(invalid_ids)} do not exist."
                    }
                )

        # Create book
        book = Book.objects.create(author=author, **validated_data)

        # Add categories
        if category_ids:
            book.categories.set(category_ids)

        return book

    @staticmethod
    @transaction.atomic
    def update_book(book_id, validated_data):
        """
        Update an existing book with business logic validation.
        """
        book = BookService.get_book_by_id(book_id)

        # Handle author update
        if "author_id" in validated_data:
            author_id = validated_data.pop("author_id")
            try:
                author = Author.objects.get(id=author_id)
                book.author = author
            except Author.DoesNotExist as err:
                raise ValidationError(
                    {"author_id": "Author with this ID does not exist."}
                ) from err

        # Handle categories update
        if "category_ids" in validated_data:
            category_ids = validated_data.pop("category_ids")
            if category_ids:
                existing_categories = Category.objects.filter(id__in=category_ids)
                if len(existing_categories) != len(category_ids):
                    invalid_ids = set(category_ids) - set(
                        existing_categories.values_list("id", flat=True)
                    )
                    raise ValidationError(
                        {
                            "category_ids": f"Categories with IDs {list(invalid_ids)} do not exist."
                        }
                    )
                book.categories.set(category_ids)
            else:
                book.categories.clear()

        # Update other fields
        for field, value in validated_data.items():
            setattr(book, field, value)

        book.save()
        return book

    @staticmethod
    @transaction.atomic
    def delete_book(book_id):
        """
        Delete a book with business logic checks.
        """
        book = BookService.get_book_by_id(book_id)
        book.delete()
        return True

    @staticmethod
    @transaction.atomic
    def add_category_to_book(book_id, category_id):
        """
        Add a category to a book.
        """
        book = BookService.get_book_by_id(book_id)

        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist as err:
            raise ValidationError(
                {"category_id": "Category with this ID does not exist."}
            ) from err

        if book.categories.filter(id=category_id).exists():
            raise ValidationError(
                {"category_id": "Category is already assigned to this book."}
            )

        book.categories.add(category)
        return book

    @staticmethod
    @transaction.atomic
    def remove_category_from_book(book_id, category_id):
        """
        Remove a category from a book.
        """
        book = BookService.get_book_by_id(book_id)

        if not book.categories.filter(id=category_id).exists():
            raise ValidationError(
                {"category_id": "Category is not assigned to this book."}
            )

        book.categories.remove(category_id)
        return book
