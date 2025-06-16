"""
Main serializers for the Category model.
This file serves as the primary interface for category serialization.
"""

from rest_framework import serializers

from books.models.category import Category


class CategorySerializer(serializers.ModelSerializer):
    """
    Main serializer for the Category model.
    """

    class Meta:
        model = Category
        fields = ["id", "name", "description", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
