"""
Main serializers for the Book model.
This file serves as the primary interface for book serialization.
"""

from rest_framework import serializers

from books.models.book import Book


class BookSerializer(serializers.ModelSerializer):
    """
    Main serializer for the Book model.
    """

    author_id = serializers.IntegerField(write_only=True)
    category_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    price_display = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "isbn",
            "price",
            "price_display",
            "author",
            "author_id",
            "categories",
            "category_ids",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_price_display(self, obj):
        """Format price with currency symbol."""
        return f"${obj.price:.2f}" if obj.price is not None else None

    def get_author(self, obj):
        """Get author details."""
        if not obj.author:
            return None
        return {"id": obj.author.id, "name": obj.author.name, "email": obj.author.email}

    def get_categories(self, obj):
        """Get category details."""
        return [
            {
                "id": category.id,
                "name": category.name,
                "description": category.description,
            }
            for category in obj.categories.all()
        ]

    def create(self, validated_data):
        """Create a new book instance."""
        category_ids = validated_data.pop("category_ids", [])
        book = Book.objects.create(**validated_data)

        if category_ids:
            book.categories.set(category_ids)

        return book

    def update(self, instance, validated_data):
        """Update an existing book instance."""
        category_ids = validated_data.pop("category_ids", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if category_ids is not None:
            instance.categories.set(category_ids)

        return instance
