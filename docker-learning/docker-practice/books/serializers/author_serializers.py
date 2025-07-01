"""
Main serializers for the Author model.
This file serves as the primary interface for author serialization.
"""

from rest_framework import serializers

from books.models.author import Author


class AuthorSerializer(serializers.ModelSerializer):
    """
    Main serializer for the Author model.
    """

    class Meta:
        model = Author
        fields = ["id", "name", "email", "bio", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
