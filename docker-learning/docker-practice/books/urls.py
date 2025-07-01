"""
URLs for the books app

Following Django REST Framework best practices:
- Using DefaultRouter for automatic API root generation
- Proper viewset registration with meaningful basenames
- Clean URL patterns for scalability
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from books.viewsets.author_viewset import AuthorViewSet
from books.viewsets.book_viewset import BookViewSet
from books.viewsets.category_viewset import CategoryViewSet

# Create a DefaultRouter instance for automatic URL pattern generation
# DefaultRouter provides an API root view with hyperlinks to all registered viewsets
router = DefaultRouter()

# Register viewsets with the router
# The router will automatically generate URL patterns for all CRUD operations
router.register(r"books", BookViewSet, basename="book")
router.register(r"authors", AuthorViewSet, basename="author")
router.register(r"categories", CategoryViewSet, basename="category")

# URL patterns include:
# - / (API root with links to all endpoints)
# - /books/ (list/create books)
# - /books/{id}/ (retrieve/update/delete specific book)
# - /books/{id}/add_category/ (custom action)
# - /books/{id}/remove_category/ (custom action)
# - /authors/ (list/create authors)
# - /authors/{id}/ (retrieve/update/delete specific author)
# - /categories/ (list/create categories)
# - /categories/{id}/ (retrieve/update/delete specific category)

app_name = "books"  # App namespace for URL reversing
urlpatterns = [
    path("", include(router.urls)),
]
