"""
Response serializers for the Category model.
These serializers handle outgoing data formatting and nested relationships.
"""

from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from books.serializers.category_serializers import CategorySerializer


class CategoryListResponseSerializer(CategorySerializer):
    """
    Serializer for listing categories with basic information.
    Includes book count and basic category details.
    """

    book_count = serializers.SerializerMethodField()
    name_display = serializers.SerializerMethodField()

    class Meta(CategorySerializer.Meta):
        fields = ["id", "name", "name_display", "book_count"]
        read_only_fields = fields

    @extend_schema_field(serializers.IntegerField)
    def get_book_count(self, obj) -> int:
        """Get the number of books in this category."""
        return obj.books.count()

    @extend_schema_field(serializers.CharField)
    def get_name_display(self, obj) -> str:
        """Get the formatted category name."""
        return obj.name.strip().title()


class CategoryDetailResponseSerializer(CategorySerializer):
    """
    Serializer for detailed category information.
    Includes full category details and list of books.
    """

    books = serializers.SerializerMethodField()
    book_count = serializers.SerializerMethodField()
    name_display = serializers.SerializerMethodField()

    class Meta(CategorySerializer.Meta):
        fields = [
            "id",
            "name",
            "name_display",
            "description",
            "books",
            "book_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    @extend_schema_field(serializers.IntegerField)
    def get_book_count(self, obj) -> int:
        """Get the number of books in this category."""
        return obj.books.count()

    @extend_schema_field(serializers.CharField)
    def get_name_display(self, obj) -> str:
        """Get the formatted category name."""
        return obj.name.strip().title()

    @extend_schema_field(serializers.ListField(child=serializers.CharField()))
    def get_books(self, obj) -> list[str]:
        """Get list of book titles in this category."""
        return [book.title for book in obj.books.all()]
