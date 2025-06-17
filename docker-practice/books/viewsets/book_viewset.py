"""
Views for the books app using proper serializer separation.
"""

from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from books.serializers.book_request_serializers import (
    BookCreateRequestSerializer,
    BookUpdateRequestSerializer,
)
from books.serializers.book_response_serializers import (
    BookDetailResponseSerializer,
    BookListResponseSerializer,
)
from books.services.book_services import BookService
from books.utils import success_response
from core_commons.response_mixins import ServiceAndUserAuthenticationMixin


class BookViewSet(ServiceAndUserAuthenticationMixin, viewsets.ModelViewSet):
    """
    API endpoint for managing books.
    Uses proper request/response serializer separation.
    """

    lookup_field = "id"
    permission_classes = [IsAuthenticated]
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
        """Get queryset using service layer."""
        return BookService.get_all_books()

    def get_serializer_class(self):
        """
        Return appropriate serializer class based on the action.
        Uses request serializers for input, response serializers for output.
        """
        if self.action in ["create"]:
            return BookCreateRequestSerializer
        elif self.action in ["update", "partial_update"]:
            return BookUpdateRequestSerializer
        elif self.action == "list":
            return BookListResponseSerializer
        elif self.action == "retrieve":
            return BookDetailResponseSerializer
        # Default fallback
        return BookDetailResponseSerializer

    @extend_schema(
        summary="List all books",
        description="Returns a paginated list of all books with basic information.",
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
        responses={200: BookListResponseSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        """Return a list of all books with basic information."""
        # Let DRF handle pagination automatically
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Get book details",
        description="Returns detailed information about a specific book including author and categories.",
        responses={200: BookDetailResponseSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        """Return detailed information about a specific book."""
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Create a new book",
        description="Creates a new book with the provided information.",
        request=BookCreateRequestSerializer,
        responses={201: BookDetailResponseSerializer},
    )
    def create(self, request, *args, **kwargs):
        """Create a new book using service layer."""
        # Use request serializer for validation
        serializer = BookCreateRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Use service layer for business logic
        book = BookService.create_book(serializer.validated_data)

        # Use response serializer for output
        response_serializer = BookDetailResponseSerializer(
            book, context={"request": request}
        )

        return success_response(
            data=response_serializer.data,
            message="Book created successfully",
            status_code=status.HTTP_201_CREATED,
        )

    @extend_schema(
        summary="Update a book",
        description="Updates all fields of an existing book.",
        request=BookUpdateRequestSerializer,
        responses={200: BookDetailResponseSerializer},
    )
    def update(self, request, *args, **kwargs):
        """Update a book using service layer."""
        partial = kwargs.pop("partial", False)

        # Use request serializer for validation
        serializer = BookUpdateRequestSerializer(data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # Use service layer for business logic
        book = BookService.update_book(self.kwargs["id"], serializer.validated_data)

        # Use response serializer for output
        response_serializer = BookDetailResponseSerializer(
            book, context={"request": request}
        )

        return success_response(
            data=response_serializer.data, message="Book updated successfully"
        )

    @extend_schema(
        summary="Partially update a book",
        description="Updates specific fields of an existing book.",
        request=BookUpdateRequestSerializer,
        responses={200: BookDetailResponseSerializer},
    )
    def partial_update(self, request, *args, **kwargs):
        """Partially update a book using service layer."""
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    @extend_schema(
        summary="Delete a book",
        description="Deletes an existing book.",
        responses={204: None},
    )
    def destroy(self, request, *args, **kwargs):
        """Delete a book using service layer."""
        BookService.delete_book(self.kwargs["id"])
        return success_response(
            data=None,
            message="Book deleted successfully",
            status_code=status.HTTP_204_NO_CONTENT,
        )

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
        responses={200: BookDetailResponseSerializer},
    )
    @action(detail=True, methods=["post"])
    def add_category(self, request, id=None):
        """Add a category to a book."""
        category_id = request.data.get("category_id")
        if not category_id:
            return Response(
                {"category_id": ["This field is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        book = BookService.add_category_to_book(id, category_id)
        response_serializer = BookDetailResponseSerializer(
            book, context={"request": request}
        )

        return success_response(
            data=response_serializer.data, message="Category added to book successfully"
        )

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
        responses={200: BookDetailResponseSerializer},
    )
    @action(detail=True, methods=["post"])
    def remove_category(self, request, id=None):
        """Remove a category from a book."""
        category_id = request.data.get("category_id")
        if not category_id:
            return Response(
                {"category_id": ["This field is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        book = BookService.remove_category_from_book(id, category_id)
        response_serializer = BookDetailResponseSerializer(
            book, context={"request": request}
        )

        return success_response(
            data=response_serializer.data,
            message="Category removed from book successfully",
        )
