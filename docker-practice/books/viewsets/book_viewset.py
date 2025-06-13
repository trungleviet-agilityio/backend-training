"""
Views for the books app
"""

from rest_framework import viewsets
from .models import Book
from .serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    """
    A viewset for the Book model
    """

    queryset = Book.objects.all()
    serializer_class = BookSerializer
