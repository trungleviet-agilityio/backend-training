"""
Test the Book model.
"""

from django.db import IntegrityError
from django.test import TestCase

from books.models.author import Author
from books.models.book import Book


class BookModelTest(TestCase):
    """
    Test the Book model.
    """

    def setUp(self):
        """Set up test data."""
        self.author = Author.objects.create(
            name="F. Scott Fitzgerald", email="fitzgerald@example.com"
        )

    def test_str_representation(self):
        """Test the string representation of the Book model."""
        book = Book.objects.create(
            title="The Great Gatsby",
            isbn="9780743273565",
            price=10.99,
            author=self.author,
        )
        self.assertEqual(str(book), "The Great Gatsby")

    def test_isbn_uniqueness(self):
        """Test that ISBNs must be unique."""
        Book.objects.create(
            title="The Great Gatsby",
            isbn="9780743273565",
            price=10.99,
            author=self.author,
        )
        with self.assertRaises(IntegrityError):
            Book.objects.create(
                title="Another Book",
                isbn="9780743273565",
                price=15.99,
                author=self.author,
            )

    def test_author_required(self):
        """Test that author is required."""
        with self.assertRaises(IntegrityError):
            Book.objects.create(
                title="The Great Gatsby", isbn="9780743273565", price=10.99
            )
