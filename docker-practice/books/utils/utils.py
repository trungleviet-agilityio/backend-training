"""
Utilities for consistent API responses using existing serializers.
"""

from datetime import datetime

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """
    Custom exception handler that formats error responses consistently.
    """
    response = exception_handler(exc, context)

    if response is not None:
        custom_response = {
            "success": False,
            "message": get_error_message(response.status_code, exc),
            "timestamp": datetime.now().isoformat(),
            "error_code": exc.__class__.__name__.upper(),
        }

        # Add validation errors if they exist
        if hasattr(exc, "detail") and isinstance(exc.detail, dict):
            custom_response["errors"] = format_validation_errors(exc.detail)

        response.data = custom_response

    return response


def format_validation_errors(errors):
    """
    Format validation errors consistently.
    """
    formatted = []
    for field, messages in errors.items():
        if isinstance(messages, list):
            for message in messages:
                formatted.append(
                    {
                        "field": field,
                        "message": str(message),
                        "code": getattr(message, "code", "invalid"),
                    }
                )
        else:
            formatted.append(
                {"field": field, "message": str(messages), "code": "invalid"}
            )
    return formatted


def get_error_message(status_code, exc):
    """
    Get appropriate error message based on status code.
    """
    if status_code == 400:
        return "Validation failed"
    elif status_code == 401:
        return "Authentication required"
    elif status_code == 403:
        return "Permission denied"
    elif status_code == 404:
        return "Resource not found"
    elif status_code == 409:
        return "Conflict occurred"
    else:
        return str(exc) if exc else "An error occurred"


def success_response(data, message=None, status_code=status.HTTP_200_OK):
    """
    Create consistent success response using serialized data.
    """
    return Response(
        {
            "success": True,
            "message": message or get_success_message(status_code),
            "timestamp": datetime.now().isoformat(),
            "data": data,
        },
        status=status_code,
    )


def get_success_message(status_code):
    """
    Get default success message based on status code.
    """
    messages = {
        200: "Data retrieved successfully",
        201: "Resource created successfully",
        204: "Resource deleted successfully",
    }
    return messages.get(status_code, "Operation completed successfully")
