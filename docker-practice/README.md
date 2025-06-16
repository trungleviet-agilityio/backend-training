# Django Docker Practice

A Django-based project demonstrating best practices for Docker containerization, code quality, and development workflow.

## 🚀 Quick Start

### Using Docker (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd docker-practice

# Start the application
docker-compose up --build
```

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd docker-practice

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
docker-practice/
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

## 📝 License

This project is created from Trung with love.
