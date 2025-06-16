"""
Request serializers for the Author model.
These serializers handle incoming data validation and transformation.
"""

from rest_framework import serializers

from books.models.author import Author
from books.serializers.author_serializers import AuthorSerializer


class AuthorCreateRequestSerializer(AuthorSerializer):
    """
    Serializer for creating a new author.
    Handles validation of incoming data for author creation.
    """

    class Meta(AuthorSerializer.Meta):
        fields = ["name", "email", "bio"]

    def validate_email(self, value):
        """Validate email format and uniqueness."""
        if not value or "@" not in value:
            raise serializers.ValidationError("Please enter a valid email address.")

        if Author.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "An author with this email already exists."
            )
        return value

    def validate_name(self, value):
        """Validate author name."""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError(
                "Author name must be at least 2 characters long."
            )
        return value.strip()

    def validate(self, data):
        """Validate the entire data set."""
        # Add any cross-field validation here
        return data


class AuthorUpdateRequestSerializer(AuthorSerializer):
    """
    Serializer for updating an existing author.
    All fields are optional for partial updates.
    """

    class Meta(AuthorSerializer.Meta):
        fields = ["name", "email", "bio"]

    def validate_email(self, value):
        """Validate email format and uniqueness, excluding current instance."""
        if not value or "@" not in value:
            raise serializers.ValidationError("Please enter a valid email address.")

        if (
            self.instance
            and Author.objects.exclude(pk=self.instance.pk).filter(email=value).exists()
        ):
            raise serializers.ValidationError(
                "An author with this email already exists."
            )
        return value

    def validate_name(self, value):
        """Validate author name."""
        if value and len(value.strip()) < 2:
            raise serializers.ValidationError(
                "Author name must be at least 2 characters long."
            )
        return value.strip() if value else value

    def validate(self, data):
        """Validate the entire data set."""
        # Add any cross-field validation here
        return data
