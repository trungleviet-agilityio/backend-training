"""
Request serializers for the Book model.
These serializers handle incoming data validation and transformation.
"""

from rest_framework import serializers

from books.models.book import Book


class BookCreateRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new book.
    Handles validation of incoming data for book creation.
    """

    author_id = serializers.IntegerField(required=True)
    category_ids = serializers.ListField(
        child=serializers.IntegerField(), required=False, default=list
    )

    class Meta:
        model = Book
        fields = ["title", "isbn", "price", "author_id", "category_ids"]

    def validate_isbn(self, value):
        """Validate ISBN format and uniqueness."""
        if len(value) != 13:
            raise serializers.ValidationError("ISBN must be 13 characters long")
        if Book.objects.filter(isbn=value).exists():
            raise serializers.ValidationError("A book with this ISBN already exists")
        return value

    def validate_price(self, value):
        """Validate price is positive."""
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero")
        return value


class BookUpdateRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for updating an existing book.
    All fields are optional for partial updates.
    """

    author_id = serializers.IntegerField(required=False)
    category_ids = serializers.ListField(
        child=serializers.IntegerField(), required=False
    )

    class Meta:
        model = Book
        fields = ["title", "isbn", "price", "author_id", "category_ids"]

    def validate_isbn(self, value):
        """Validate ISBN format and uniqueness, excluding current instance."""
        if len(value) != 13:
            raise serializers.ValidationError("ISBN must be 13 characters long")

        # Check if ISBN exists for other books
        if (
            self.instance
            and Book.objects.exclude(pk=self.instance.pk).filter(isbn=value).exists()
        ):
            raise serializers.ValidationError("A book with this ISBN already exists")
        return value

    def validate_price(self, value):
        """Validate price is positive."""
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero")
        return value
