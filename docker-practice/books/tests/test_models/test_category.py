"""
Test the Category model.
"""

from django.db import IntegrityError
from django.test import TestCase

from books.models.category import Category


class CategoryModelTest(TestCase):
    """
    Test the Category model.
    """

    def test_str_representation(self):
        """Test the string representation of the Category model."""
        category = Category.objects.create(name="Fiction")
        self.assertEqual(str(category), "Fiction")

    def test_name_uniqueness(self):
        """Test that category names must be unique."""
        Category.objects.create(name="Fiction")
        with self.assertRaises(IntegrityError):
            Category.objects.create(name="Fiction")

    def test_description_optional(self):
        """Test that description is optional."""
        category = Category.objects.create(
            name="Fiction", description="Fictional works"
        )
        self.assertEqual(category.description, "Fictional works")

        category_no_desc = Category.objects.create(name="Non-Fiction")
        self.assertEqual(category_no_desc.description, "")
