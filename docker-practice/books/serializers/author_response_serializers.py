"""
Response serializers for the Author model.
These serializers handle output formatting and nested relationships.
"""

from typing import Any

from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from books.serializers.author_serializers import AuthorSerializer


class AuthorListResponseSerializer(AuthorSerializer):
    """
    Serializer for listing authors.
    Includes basic author information and book count.
    """

    book_count = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta(AuthorSerializer.Meta):
        fields = ["id", "name", "full_name", "email", "book_count"]

    @extend_schema_field(serializers.IntegerField)
    def get_book_count(self, obj) -> int:
        """Get the number of books by this author."""
        return obj.books.count()

    @extend_schema_field(serializers.CharField)
    def get_full_name(self, obj) -> str:
        """Get the author's full name."""
        return f"{obj.name} ({obj.email})"


class AuthorDetailResponseSerializer(AuthorSerializer):
    """
    Serializer for detailed author information.
    Includes list of books.
    """

    books = serializers.SerializerMethodField()

    class Meta(AuthorSerializer.Meta):
        fields = AuthorSerializer.Meta.fields + [
            "bio",
            "books",
            "created_at",
            "updated_at",
        ]

    @extend_schema_field(serializers.ListField(child=serializers.DictField()))
    def get_books(self, obj) -> list[dict[str, Any]]:
        """Get list of books by this author."""
        return [
            {
                "id": book.id,
                "title": book.title,
                "isbn": book.isbn,
                "price": str(book.price),
            }
            for book in obj.books.all()
        ]
