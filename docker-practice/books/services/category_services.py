"""
Business logic services for category management.
This layer handles complex business operations and keeps viewsets clean.
"""

from django.db import models, transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

from books.models.category import Category


class CategoryService:
    """
    Service class for handling category-related business logic.
    """

    @staticmethod
    def get_all_categories():
        """
        Retrieve all categories with optimized queries.
        """
        return Category.objects.prefetch_related("books").all()

    @staticmethod
    def get_category_by_id(category_id):
        """
        Retrieve a specific category by ID.
        """
        return get_object_or_404(
            Category.objects.prefetch_related("books"), id=category_id
        )

    @staticmethod
    @transaction.atomic
    def create_category(validated_data):
        """
        Create a new category with business logic validation.
        """
        # Check for duplicate name
        name = validated_data.get("name")
        if Category.objects.filter(name__iexact=name).exists():
            raise ValidationError({"name": "Category with this name already exists."})

        category = Category.objects.create(**validated_data)
        return category

    @staticmethod
    @transaction.atomic
    def update_category(category_id, validated_data):
        """
        Update an existing category with business logic validation.
        """
        category = CategoryService.get_category_by_id(category_id)

        # Check for duplicate name (excluding current category)
        name = validated_data.get("name")
        if (
            name
            and Category.objects.filter(name__iexact=name)
            .exclude(id=category_id)
            .exists()
        ):
            raise ValidationError({"name": "Category with this name already exists."})

        # Update fields
        for field, value in validated_data.items():
            setattr(category, field, value)

        category.save()
        return category

    @staticmethod
    @transaction.atomic
    def delete_category(category_id):
        """
        Delete a category with business logic checks.
        """
        category = CategoryService.get_category_by_id(category_id)

        # Check if category has books
        book_count = category.books.count()
        if book_count > 0:
            raise ValidationError(
                {
                    "detail": f"Cannot delete category. Category has {book_count} book(s) assigned. "
                    "Please remove the category from books first."
                }
            )

        category.delete()
        return True

    @staticmethod
    def get_category_books(category_id):
        """
        Get all books in a specific category.
        """
        category = CategoryService.get_category_by_id(category_id)
        return category.books.select_related("author").all()

    @staticmethod
    def get_category_statistics(category_id):
        """
        Get statistics for a category.
        """
        category = CategoryService.get_category_by_id(category_id)
        books = category.books.select_related("author")

        return {
            "total_books": books.count(),
            "total_authors": books.values("author").distinct().count(),
            "average_price": books.aggregate(avg_price=models.Avg("price"))["avg_price"]
            or 0,
            "price_range": {
                "min": books.aggregate(min_price=models.Min("price"))["min_price"] or 0,
                "max": books.aggregate(max_price=models.Max("price"))["max_price"] or 0,
            },
            "latest_book": books.first().title if books.exists() else None,
        }

    @staticmethod
    def get_popular_categories(limit=10):
        """
        Get most popular categories by book count.
        """
        return Category.objects.annotate(book_count=models.Count("books")).order_by(
            "-book_count"
        )[:limit]
