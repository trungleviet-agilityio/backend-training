"""
Views for the categories using proper serializer separation.
"""

from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import OpenApiExample, OpenApiParameter, extend_schema
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from books.serializers.book_response_serializers import BookListResponseSerializer
from books.serializers.category_request_serializers import (
    CategoryCreateRequestSerializer,
    CategoryUpdateRequestSerializer,
)
from books.serializers.category_response_serializers import (
    CategoryDetailResponseSerializer,
    CategoryListResponseSerializer,
)
from books.services.category_services import CategoryService
from books.utils import success_response
from core_commons.response_mixins import ServiceAndUserAuthenticationMixin


class CategoryViewSet(ServiceAndUserAuthenticationMixin, viewsets.ModelViewSet):
    """
    API endpoint for managing categories.
    Uses proper request/response serializer separation.
    """

    lookup_field = "id"
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["name", "description"]
    ordering_fields = ["name", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """Get queryset using service layer."""
        return CategoryService.get_all_categories()

    def get_serializer_class(self):
        """
        Return appropriate serializer class based on the action.
        Uses request serializers for input, response serializers for output.
        """
        if self.action in ["create"]:
            return CategoryCreateRequestSerializer
        elif self.action in ["update", "partial_update"]:
            return CategoryUpdateRequestSerializer
        elif self.action == "list":
            return CategoryListResponseSerializer
        elif self.action == "retrieve":
            return CategoryDetailResponseSerializer
        # Default fallback
        return CategoryDetailResponseSerializer

    @extend_schema(
        summary="List all categories",
        description="Returns a paginated list of all categories with basic information.",
        parameters=[
            OpenApiParameter(
                name="search", type=str, description="Search in name or description"
            ),
            OpenApiParameter(
                name="ordering",
                type=str,
                description="Order by field (prefix with '-' for descending)",
            ),
        ],
        responses={200: CategoryListResponseSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        """Return a list of all categories with basic information."""
        # Let DRF handle pagination automatically
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Get category details",
        description="Returns detailed information about a specific category including associated books.",
        responses={200: CategoryDetailResponseSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        """Return detailed information about a specific category."""
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Create a new category",
        description="Creates a new category with the provided information.",
        request=CategoryCreateRequestSerializer,
        responses={201: CategoryDetailResponseSerializer},
    )
    def create(self, request, *args, **kwargs):
        """Create a new category using service layer."""
        # Use request serializer for validation
        serializer = CategoryCreateRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Use service layer for business logic
        category = CategoryService.create_category(serializer.validated_data)

        # Use response serializer for output
        response_serializer = CategoryDetailResponseSerializer(
            category, context={"request": request}
        )

        return success_response(
            data=response_serializer.data,
            message="Category created successfully",
            status_code=status.HTTP_201_CREATED,
        )

    @extend_schema(
        summary="Update a category",
        description="Updates all fields of an existing category.",
        request=CategoryUpdateRequestSerializer,
        responses={200: CategoryDetailResponseSerializer},
    )
    def update(self, request, *args, **kwargs):
        """Update a category using service layer."""
        partial = kwargs.pop("partial", False)

        # Use request serializer for validation
        serializer = CategoryUpdateRequestSerializer(data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # Use service layer for business logic
        category = CategoryService.update_category(
            self.kwargs["id"], serializer.validated_data
        )

        # Use response serializer for output
        response_serializer = CategoryDetailResponseSerializer(
            category, context={"request": request}
        )

        return success_response(
            data=response_serializer.data, message="Category updated successfully"
        )

    @extend_schema(
        summary="Partially update a category",
        description="Updates specific fields of an existing category.",
        request=CategoryUpdateRequestSerializer,
        responses={200: CategoryDetailResponseSerializer},
    )
    def partial_update(self, request, *args, **kwargs):
        """Partially update a category using service layer."""
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    @extend_schema(
        summary="Delete a category",
        description="Deletes an existing category.",
        responses={204: None},
    )
    def destroy(self, request, *args, **kwargs):
        """Delete a category using service layer."""
        CategoryService.delete_category(self.kwargs["id"])
        return success_response(
            data=None,
            message="Category deleted successfully",
            status_code=status.HTTP_204_NO_CONTENT,
        )

    @extend_schema(
        summary="Get category's books",
        description="Returns all books in this category.",
        responses={
            200: BookListResponseSerializer(many=True),
            404: None,
        },
        examples=[
            OpenApiExample(
                "Success Response",
                value=[
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
            )
        ],
    )
    @action(detail=True, methods=["get"])
    def books(self, request, id=None):
        """
        Get all books in a specific category.
        """
        books = CategoryService.get_category_books(id)
        serializer = BookListResponseSerializer(books, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Get category statistics",
        description="Returns statistics about the category's books including total books, authors, price ranges, and latest book.",
        responses={
            200: {
                "type": "object",
                "properties": {
                    "total_books": {"type": "integer"},
                    "total_authors": {"type": "integer"},
                    "price_range": {
                        "type": "object",
                        "properties": {
                            "min_price": {"type": "string"},
                            "max_price": {"type": "string"},
                            "avg_price": {"type": "string"},
                        },
                    },
                    "latest_book": {"type": "object"},
                },
            },
            404: None,
        },
        examples=[
            OpenApiExample(
                "Success Response",
                value={
                    "total_books": 15,
                    "total_authors": 8,
                    "price_range": {
                        "min_price": "15.99",
                        "max_price": "49.99",
                        "avg_price": "32.50",
                    },
                    "latest_book": {
                        "id": 1,
                        "title": "Latest Book",
                        "created_at": "2024-03-20T10:00:00Z",
                    },
                },
            )
        ],
    )
    @action(detail=True, methods=["get"])
    def statistics(self, request, id=None):
        """
        Get statistics for a category.
        """
        stats = CategoryService.get_category_statistics(id)
        return Response(stats)

    @extend_schema(
        summary="Get popular categories",
        description="Returns most popular categories by book count.",
        parameters=[
            OpenApiParameter(
                name="limit",
                type=int,
                description="Number of categories to return (default: 10)",
            ),
        ],
        responses={
            200: CategoryListResponseSerializer(many=True),
        },
        examples=[
            OpenApiExample(
                "Success Response",
                value=[
                    {
                        "id": 1,
                        "name": "Fiction",
                        "description": "Fictional books and novels",
                        "created_at": "2024-03-20T10:00:00Z",
                    },
                    {
                        "id": 2,
                        "name": "Mystery",
                        "description": "Mystery and thriller books",
                        "created_at": "2024-03-20T10:00:00Z",
                    },
                ],
            )
        ],
    )
    @action(detail=False, methods=["get"])
    def popular(self, request):
        """
        Get most popular categories by book count.
        """
        limit = int(request.query_params.get("limit", 10))
        categories = CategoryService.get_popular_categories(limit)
        serializer = CategoryListResponseSerializer(categories, many=True)
        return Response(serializer.data)
