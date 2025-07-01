# Django Docker Practice

A Django-based project demonstrating best practices for Docker containerization, code quality, and development workflow.

## 🚀 Quick Start

### Using Docker (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd docker-learning/docker-practice

# Start the application
docker-compose up --build
```

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd docker-learning/docker-practice

# Set up virtual environment
uv venv
source .venv/bin/activate

# Install dependencies
uv pip install -r requirements.txt

# Set up environment
cp local.env .env

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

## 📚 Documentation

- [Local Setup Guide](docs/how_to_guide/local_setup.md) - Detailed setup instructions
- [Architecture Overview](docs/architecture/high-level-architecture.md) - System architecture
- [Database Schema](docs/architecture/database-erd.md) - Database structure

## 🛠️ Development Tools

- **Package Management**: [uv](https://github.com/astral-sh/uv) for fast Python package installation
- **Code Quality**:
  - Ruff - Fast Python linter and formatter
  - Black - Code formatting
  - isort - Import sorting
  - Pre-commit hooks for automated checks
- **Testing**: pytest for unit and integration tests
- **Containerization**: Docker and docker-compose for containerized development

## 🔐 Security

- Signed commits required (GPG)
- Pre-commit hooks for security checks
- Environment variable management

## 📦 Project Structure

```
docker-learning/docker-practice/
├── books/          # Book management app
├── core/           # Core functionality
├── docs/           # Documentation
│   ├── architecture/
│   └── how_to_guide/
├── scripts/        # Utility scripts
├── Dockerfile      # Docker configuration
├── docker-compose.yml
└── requirements.txt
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and pre-commit hooks
5. Submit a pull request

## PythonAnywhere Deployment

This project is configured to deploy to PythonAnywhere using GitHub Actions. The deployment process is automated through several workflows:

### Manual Deployment
To manually deploy any branch to production or staging:
1. Go to GitHub Actions
2. Select "Manual Deploy" workflow
3. Click "Run workflow"
4. Select the branch and environment (production/staging)

### Automatic Deployment
- Pushes to `main` branch automatically deploy to production
- Pushes to `develop` branch automatically deploy to staging

### Required Secrets
The following secrets must be configured in GitHub:
- `PYTHONANYWHERE_USERNAME`: Your PythonAnywhere username
- `PYTHONANYWHERE_API_TOKEN`: Your PythonAnywhere API token
- `PYTHONANYWHERE_WEBAPP_NAME`: Your PythonAnywhere webapp name

### Rollback
To rollback to a previous version:
1. Go to GitHub Actions
2. Select "Manual Rollback" workflow
3. Click "Run workflow"
4. Enter the commit hash to rollback to
5. Select the environment (production/staging)

## Deployment Test
This is a test change to verify the CI/CD pipeline.

## 📝 License

This project is created from Trung with love.
