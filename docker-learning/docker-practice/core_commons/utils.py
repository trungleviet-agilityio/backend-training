import os


def infer_environment():
    app_environment = os.environ.get("APP_ENVIRONMENT")
    if app_environment in ["production", "development", "local", "test"]:
        return app_environment
    return "local"
