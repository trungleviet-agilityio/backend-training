"""
Request serializers for the Category model.
These serializers handle incoming data validation and transformation.
"""

from rest_framework import serializers

from books.models.category import Category
from books.serializers.category_serializers import CategorySerializer


class CategoryCreateRequestSerializer(CategorySerializer):
    """
    Serializer for creating a new category.
    Handles validation of incoming data for category creation.
    """

    class Meta(CategorySerializer.Meta):
        fields = ["name", "description"]

    def validate_name(self, value):
        """Validate category name format and uniqueness."""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError(
                "Category name must be at least 2 characters long."
            )

        if Category.objects.filter(name=value.strip()).exists():
            raise serializers.ValidationError(
                "A category with this name already exists."
            )
        return value.strip()

    def validate_description(self, value):
        """Validate category description."""
        if value and len(value.strip()) < 10:
            raise serializers.ValidationError(
                "Description must be at least 10 characters long."
            )
        return value.strip() if value else value

    def validate(self, data):
        """Validate the entire data set."""
        # Add any cross-field validation here
        return data


class CategoryUpdateRequestSerializer(CategorySerializer):
    """
    Serializer for updating an existing category.
    All fields are optional for partial updates.
    """

    class Meta(CategorySerializer.Meta):
        fields = ["name", "description"]

    def validate_name(self, value):
        """Validate category name format and uniqueness, excluding current instance."""
        if value and len(value.strip()) < 2:
            raise serializers.ValidationError(
                "Category name must be at least 2 characters long."
            )

        if (
            self.instance
            and Category.objects.exclude(pk=self.instance.pk)
            .filter(name=value.strip())
            .exists()
        ):
            raise serializers.ValidationError(
                "A category with this name already exists."
            )
        return value.strip() if value else value

    def validate_description(self, value):
        """Validate category description."""
        if value and len(value.strip()) < 10:
            raise serializers.ValidationError(
                "Description must be at least 10 characters long."
            )
        return value.strip() if value else value

    def validate(self, data):
        """Validate the entire data set."""
        # Add any cross-field validation here
        return data
