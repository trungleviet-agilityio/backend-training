"""
Views for the authors using proper serializer separation.
"""

from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import OpenApiExample, OpenApiParameter, extend_schema
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action

from books.serializers.author_request_serializers import (
    AuthorCreateRequestSerializer,
    AuthorUpdateRequestSerializer,
)
from books.serializers.author_response_serializers import (
    AuthorDetailResponseSerializer,
    AuthorListResponseSerializer,
)
from books.serializers.book_response_serializers import BookListResponseSerializer
from books.services.author_services import AuthorService
from books.utils import success_response
from core_commons.response_mixins import ServiceAndUserAuthenticationMixin


class AuthorViewSet(ServiceAndUserAuthenticationMixin, viewsets.ModelViewSet):
    """
    API endpoint for managing authors.
    Uses proper request/response serializer separation.
    """

    lookup_field = "id"
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["name", "email"]
    ordering_fields = ["name", "email", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """Get queryset using service layer."""
        return AuthorService.get_all_authors()

    def get_serializer_class(self):
        """
        Return appropriate serializer class based on the action.
        Uses request serializers for input, response serializers for output.
        """
        if self.action in ["create"]:
            return AuthorCreateRequestSerializer
        elif self.action in ["update", "partial_update"]:
            return AuthorUpdateRequestSerializer
        elif self.action == "list":
            return AuthorListResponseSerializer
        elif self.action == "retrieve":
            return AuthorDetailResponseSerializer
        # Default fallback
        return AuthorDetailResponseSerializer

    @extend_schema(
        summary="List all authors",
        description="Returns a paginated list of all authors with basic information.",
        parameters=[
            OpenApiParameter(
                name="search", type=str, description="Search in name or email"
            ),
            OpenApiParameter(
                name="ordering",
                type=str,
                description="Order by field (prefix with '-' for descending)",
            ),
        ],
        responses={200: AuthorListResponseSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        """Return a list of all authors with basic information."""
        # Let DRF handle pagination automatically
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Get author details",
        description="Returns detailed information about a specific author including their books.",
        responses={200: AuthorDetailResponseSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        """Return detailed information about a specific author."""
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Create a new author",
        description="Creates a new author with the provided information.",
        request=AuthorCreateRequestSerializer,
        responses={201: AuthorDetailResponseSerializer},
    )
    def create(self, request, *args, **kwargs):
        """Create a new author using service layer."""
        # Use request serializer for validation
        serializer = AuthorCreateRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Use service layer for business logic
        author = AuthorService.create_author(serializer.validated_data)

        # Use response serializer for output
        response_serializer = AuthorDetailResponseSerializer(
            author, context={"request": request}
        )

        return success_response(
            data=response_serializer.data,
            message="Author created successfully",
            status_code=status.HTTP_201_CREATED,
        )

    @extend_schema(
        summary="Update an author",
        description="Updates all fields of an existing author.",
        request=AuthorUpdateRequestSerializer,
        responses={200: AuthorDetailResponseSerializer},
    )
    def update(self, request, *args, **kwargs):
        """Update an author using service layer."""
        partial = kwargs.pop("partial", False)

        # Use request serializer for validation
        serializer = AuthorUpdateRequestSerializer(data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # Use service layer for business logic
        author = AuthorService.update_author(
            self.kwargs["id"], serializer.validated_data
        )

        # Use response serializer for output
        response_serializer = AuthorDetailResponseSerializer(
            author, context={"request": request}
        )

        return success_response(
            data=response_serializer.data, message="Author updated successfully"
        )

    @extend_schema(
        summary="Partially update an author",
        description="Updates specific fields of an existing author.",
        request=AuthorUpdateRequestSerializer,
        responses={200: AuthorDetailResponseSerializer},
    )
    def partial_update(self, request, *args, **kwargs):
        """Partially update an author using service layer."""
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    @extend_schema(
        summary="Delete an author",
        description="Deletes an existing author.",
        responses={204: None},
    )
    def destroy(self, request, *args, **kwargs):
        """Delete an author using service layer."""
        AuthorService.delete_author(self.kwargs["id"])
        return success_response(
            data=None,
            message="Author deleted successfully",
            status_code=status.HTTP_204_NO_CONTENT,
        )

    @extend_schema(
        summary="Get author's books",
        description="Returns all books written by this author.",
        responses={
            200: BookListResponseSerializer(many=True),
            404: None,
        },
        examples=[
            OpenApiExample(
                "Success Response",
                value={
                    "success": True,
                    "message": "Author books retrieved successfully",
                    "timestamp": "2024-03-20T10:00:00.000Z",
                    "data": [
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
    )
    @action(detail=True, methods=["get"])
    def books(self, request, id=None):
        """
        Get all books by a specific author.
        """
        try:
            books = AuthorService.get_author_books(id)
            serializer = BookListResponseSerializer(
                books, many=True, context={"request": request}
            )

            return self.success_response(
                data=serializer.data, message="Author books retrieved successfully"
            )
        except Exception as e:
            if "not found" in str(e).lower():
                return self.not_found_response("Author not found")
            return self.internal_server_error_response(str(e))

    @extend_schema(
        summary="Get author statistics",
        description="Returns statistics about the author's books including total books, categories, average price, and latest book.",
        responses={
            200: AuthorDetailResponseSerializer,
            404: None,
        },
        examples=[
            OpenApiExample(
                "Success Response",
                value={
                    "success": True,
                    "message": "Author statistics retrieved successfully",
                    "timestamp": "2024-03-20T10:00:00.000Z",
                    "data": {
                        "total_books": 5,
                        "categories": ["Fiction", "Mystery", "Thriller"],
                        "average_price": "32.50",
                        "latest_book": {
                            "id": 1,
                            "title": "Latest Book",
                            "created_at": "2024-03-20T10:00:00Z",
                        },
                    },
                },
            )
        ],
    )
    @action(detail=True, methods=["get"])
    def statistics(self, request, id=None):
        """
        Get statistics for an author.
        """
        try:
            stats = AuthorService.get_author_statistics(id)

            return self.success_response(
                data=stats, message="Author statistics retrieved successfully"
            )
        except Exception as e:
            if "not found" in str(e).lower():
                return self.not_found_response("Author not found")
            return self.internal_server_error_response(str(e))
