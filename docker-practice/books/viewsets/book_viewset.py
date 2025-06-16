"""
Views for the books app
"""

from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import (
    OpenApiExample,
    OpenApiParameter,
    extend_schema,
    extend_schema_view,
)
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from books.models.book import Book
from books.serializers.book_request_serializers import (
    BookCreateRequestSerializer,
    BookUpdateRequestSerializer,
)
from books.serializers.book_response_serializers import (
    BookDetailResponseSerializer,
    BookListResponseSerializer,
)
from books.serializers.book_serializers import BookSerializer


@extend_schema_view(
    list=extend_schema(
        summary="List all books",
        description="Returns a list of all books with basic information.",
        parameters=[
            OpenApiParameter(
                name="author", type=int, description="Filter by author ID"
            ),
            OpenApiParameter(
                name="categories", type=int, description="Filter by category ID"
            ),
            OpenApiParameter(
                name="search",
                type=str,
                description="Search in title, ISBN, or author name",
            ),
            OpenApiParameter(
                name="ordering",
                type=str,
                description="Order by field (prefix with '-' for descending)",
            ),
        ],
        examples=[
            OpenApiExample(
                "Success Response",
                value={
                    "count": 1,
                    "next": None,
                    "previous": None,
                    "results": [
                        {
                            "id": 1,
                            "title": "Sample Book",
                            "isbn": "9781234567890",
                            "price": "29.99",
                            "author_name": "John Doe",
                            "category_names": ["Fiction", "Mystery"],
                            "created_at": "2024-03-20T10:00:00Z",
                        }
                    ],
                },
            )
        ],
    ),
    retrieve=extend_schema(
        summary="Get book details",
        description="Returns detailed information about a specific book.",
    ),
    create=extend_schema(
        summary="Create a new book",
        description="Creates a new book with the provided information.",
    ),
    update=extend_schema(
        summary="Update a book", description="Updates all fields of an existing book."
    ),
    partial_update=extend_schema(
        summary="Partially update a book",
        description="Updates specific fields of an existing book.",
    ),
    destroy=extend_schema(
        summary="Delete a book", description="Deletes an existing book."
    ),
)
class BookViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing books.

    list:
    Return a list of all books with basic information.

    retrieve:
    Return detailed information about a specific book.

    create:
    Create a new book.

    update:
    Update all fields of a book.

    partial_update:
    Update specific fields of a book.

    destroy:
    Delete a book.
    """

    queryset = (
        Book.objects.select_related("author").prefetch_related("categories").all()
    )
    serializer_class = BookSerializer
    lookup_field = "id"
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["author", "categories"]
    search_fields = ["title", "isbn", "author__name"]
    ordering_fields = ["title", "price", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """
        Optimize queryset based on the action.
        """
        queryset = super().get_queryset()

        if self.action == "list":
            # For list action, we only need basic information
            return queryset.only(
                "id", "title", "isbn", "price", "created_at", "author__name"
            )

        return queryset

    def get_serializer_class(self):
        """
        Return appropriate serializer class based on the action.
        """
        if self.action == "list":
            return BookListResponseSerializer
        elif self.action == "retrieve":
            return BookDetailResponseSerializer
        elif self.action == "create":
            return BookCreateRequestSerializer
        elif self.action in ["update", "partial_update"]:
            return BookUpdateRequestSerializer
        return self.serializer_class

    def create(self, request, *args, **kwargs):
        """
        Create a new book with proper response format.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        book = serializer.save()

        # Use detail serializer for response
        response_serializer = BookDetailResponseSerializer(book)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Update a book with proper response format.
        """
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        book = serializer.save()

        # Use detail serializer for response
        response_serializer = BookDetailResponseSerializer(book)
        return Response(response_serializer.data)

    @extend_schema(
        summary="Add a category to a book",
        description="Adds a category to an existing book.",
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "category_id": {
                        "type": "integer",
                        "description": "ID of the category to add",
                    }
                },
                "required": ["category_id"],
            }
        },
        responses={200: BookDetailResponseSerializer, 400: None, 404: None},
    )
    @action(detail=True, methods=["post"])
    def add_category(self, request, pk=None):
        """
        Add a category to a book.
        """
        book = self.get_object()
        category_id = request.data.get("category_id")

        if not category_id:
            return Response(
                {"error": "category_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        book.categories.add(category_id)
        response_serializer = BookDetailResponseSerializer(book)
        return Response(response_serializer.data)

    @extend_schema(
        summary="Remove a category from a book",
        description="Removes a category from an existing book.",
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "category_id": {
                        "type": "integer",
                        "description": "ID of the category to remove",
                    }
                },
                "required": ["category_id"],
            }
        },
        responses={200: BookDetailResponseSerializer, 400: None, 404: None},
    )
    @action(detail=True, methods=["post"])
    def remove_category(self, request, pk=None):
        """
        Remove a category from a book.
        """
        book = self.get_object()
        category_id = request.data.get("category_id")

        if not category_id:
            return Response(
                {"error": "category_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        book.categories.remove(category_id)
        response_serializer = BookDetailResponseSerializer(book)
        return Response(response_serializer.data)
