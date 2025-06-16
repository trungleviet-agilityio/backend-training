"""
Response serializers for the Book model.
These serializers handle output formatting and nested relationships.
"""

from typing import Any

from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from books.serializers.book_serializers import BookSerializer


class BookListResponseSerializer(BookSerializer):
    """
    Serializer for listing books.
    Includes basic book information and author name.
    """

    author_name = serializers.SerializerMethodField()
    price_display = serializers.SerializerMethodField()

    class Meta(BookSerializer.Meta):
        fields = ["id", "title", "isbn", "price", "price_display", "author_name"]

    @extend_schema_field(serializers.CharField(allow_null=True))
    def get_author_name(self, obj) -> str | None:
        """Get the author's name."""
        return obj.author.name if obj.author else None

    @extend_schema_field(serializers.CharField(allow_null=True))
    def get_price_display(self, obj) -> str | None:
        """Format price with currency symbol."""
        return f"${obj.price:.2f}" if obj.price is not None else None


class BookDetailResponseSerializer(BookListResponseSerializer):
    """
    Serializer for detailed book information.
    Includes full author and category details.
    """

    author = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()

    class Meta(BookSerializer.Meta):
        fields = BookSerializer.Meta.fields + [
            "author",
            "categories",
            "created_at",
            "updated_at",
        ]

    @extend_schema_field(serializers.DictField(allow_null=True))
    def get_author(self, obj) -> dict[str, Any] | None:
        """Get author details."""
        if not obj.author:
            return None
        return {"id": obj.author.id, "name": obj.author.name, "email": obj.author.email}

    @extend_schema_field(serializers.ListField(child=serializers.DictField()))
    def get_categories(self, obj) -> list[dict[str, Any]]:
        """Get category details."""
        return [
            {
                "id": category.id,
                "name": category.name,
                "description": category.description,
            }
            for category in obj.categories.all()
        ]
