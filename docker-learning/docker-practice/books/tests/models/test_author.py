"""
Test the Author model.
"""

from django.db import IntegrityError
from django.test import TestCase

from books.models.author import Author


class AuthorModelTest(TestCase):
    """
    Test the Author model.
    """

    def test_str_representation(self):
        """Test the string representation of the Author model."""
        author = Author.objects.create(name="John Doe", email="john.doe@example.com")
        self.assertEqual(str(author), "John Doe")

    def test_email_uniqueness(self):
        """Test that email addresses must be unique."""
        Author.objects.create(name="John Doe", email="john.doe@example.com")
        with self.assertRaises(IntegrityError):
            Author.objects.create(name="Jane Doe", email="john.doe@example.com")

    def test_bio_optional(self):
        """Test that bio is optional."""
        author = Author.objects.create(
            name="John Doe", email="john.doe@example.com", bio="A great author"
        )
        self.assertEqual(author.bio, "A great author")

        author_no_bio = Author.objects.create(
            name="Jane Doe", email="jane.doe@example.com"
        )
        self.assertEqual(author_no_bio.bio, "")
