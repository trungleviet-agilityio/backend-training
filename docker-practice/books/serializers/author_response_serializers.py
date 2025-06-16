"""
Response serializers for the Author model.
These serializers handle output formatting and nested relationships.
"""

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

    def get_book_count(self, obj):
        """Get the number of books by this author."""
        return obj.books.count()

    def get_full_name(self, obj):
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

    def get_books(self, obj):
        """Get list of books by this author."""
        return [
            {"id": book.id, "title": book.title, "isbn": book.isbn, "price": book.price}
            for book in obj.books.all()
        ]
