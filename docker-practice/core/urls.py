"""
URL configuration for core project.

Following Django REST Framework best practices:
- Clean separation of concerns
- Proper API versioning structure
- Namespace support for scalability
- DefaultRouter handles API root automatically
"""

from django.conf import settings
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)


def root_redirect(request):
    """Redirect root URL to Swagger documentation for better developer experience."""
    return redirect("/api/v1/schema/swagger-ui/")


# Main URL patterns
urlpatterns = [
    # Root redirect to API documentation
    path("", root_redirect, name="root"),
    # Admin interface
    path("admin/", admin.site.urls),
    # API v1 endpoints with namespace for future versioning
    path("api/v1/", include("books.urls", namespace="v1")),
    # API Documentation endpoints
    path("api/v1/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/v1/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/v1/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]

# Development-only URLs
if settings.DEBUG:
    import debug_toolbar
    from django.conf.urls.static import static

    urlpatterns += [
        path("__debug__/", include(debug_toolbar.urls)),
    ]

    # Serve static files during development
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
