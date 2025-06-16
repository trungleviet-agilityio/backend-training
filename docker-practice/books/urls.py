"""
URLs for the books app
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from books.viewsets.book_viewset import BookViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r"books", BookViewSet, basename="book")

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path("api/v1/", include(router.urls)),
]
