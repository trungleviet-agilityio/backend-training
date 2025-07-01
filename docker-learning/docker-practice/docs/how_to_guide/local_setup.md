# Local Setup Guide

This guide will help you set up your local development environment for the Django Docker Practice project.

## Prerequisites

- Python 3.10+ installed on your system
- Git installed
- [uv](https://github.com/astral-sh/uv) installed (fast Python package installer)

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd backend-training/docker-learning/docker-practice
```

### 2. Set up Virtual Environment with uv
This project uses `uv` for fast package management instead of traditional pip.

```bash
# Create virtual environment
uv venv

# Activate virtual environment
source .venv/bin/activate

# Install dependencies
uv pip install -r requirements.txt
```

### 3. Environment Variables
Copy the local environment file and configure it:
```bash
cp local.env .env
# Edit .env file with your local settings
```

### 4. Database Setup
```bash
# Run database migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### 5. Pre-commit Hooks Setup
This project uses pre-commit hooks to ensure code quality. The hooks are automatically configured when you install dependencies.

```bash
# Install pre-commit hooks
pre-commit install

# Run pre-commit on all files (optional, to test setup)
pre-commit run --all-files
```

#### Pre-commit Hooks Included:
- **Ruff**: Fast Python linter and formatter
- **Black**: Python code formatter
- **isort**: Python import sorting
- **General checks**: Trailing whitespace, end-of-file-fixer, YAML/JSON/TOML validation
- **Django-upgrade**: Automatically upgrade Django syntax
- **Security checks**: Various security-related checks

### 6. Git Commit Signing Setup
This project requires signed commits for all changes. Follow these steps to set up commit signing:

#### Check Existing GPG Keys
```bash
# List existing GPG keys
gpg --list-secret-keys --keyid-format LONG
```

#### Generate New GPG Key (if needed)
```bash
# Generate new GPG key
gpg --full-generate-key

# Follow the prompts:
# 1. Select key type (RSA and RSA)
# 2. Select key size (4096 bits)
# 3. Select key validity (0 = key does not expire)
# 4. Enter your name and email
# 5. Enter a secure passphrase
```

#### Configure Git for Signing
```bash
# Get your GPG key ID
gpg --list-secret-keys --keyid-format LONG

# Configure Git to use your key
git config --global user.signingkey YOUR_KEY_ID

# Enable automatic commit signing
git config --global commit.gpgsign true
```

#### Export and Add GPG Key to GitHub
```bash
# Export your public key
gpg --armor --export YOUR_KEY_ID

# Copy the output and add it to GitHub:
# 1. Go to GitHub Settings
# 2. Click "SSH and GPG keys"
# 3. Click "New GPG key"
# 4. Paste your public key
```

#### Verify Setup
```bash
# Make a test commit
git commit -m "test: verify commit signing"

# Check the signature
git log -1 --show-signature
```

#### Troubleshooting
If you encounter signing issues:
```bash
# Start GPG agent
gpgconf --launch gpg-agent

# Set GPG TTY
export GPG_TTY=$(tty)
```

### 7. Running the Development Server
```bash
# Start the Django development server
python manage.py runserver
```

The development server will be available at `http://localhost:8000`

## Development Workflow

### Code Quality Checks
The pre-commit hooks will automatically run when you commit changes. You can also run them manually:

```bash
# Run all pre-commit hooks
pre-commit run --all-files

# Run specific hook
pre-commit run ruff
pre-commit run black
```

### Testing
```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov

# Run specific test file
pytest path/to/test_file.py
```

### Package Management with uv
Instead of pip, this project uses `uv` for faster package management:

```bash
# Install new package
uv pip install package-name

# Update requirements.txt after adding packages
uv pip freeze > requirements.txt

# Install from requirements.txt
uv pip install -r requirements.txt
```

## Docker Setup (Alternative)
If you prefer to use Docker for development:

```bash
# Build and run with docker-compose
docker-compose up --build

# Run commands in container
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
```

## Troubleshooting

### Common Issues

1. **Python version mismatch**: Ensure you're using Python 3.10+
2. **Virtual environment not activated**: Make sure you see `(docker-learning/docker-practice)` in your terminal prompt
3. **Pre-commit hooks failing**: Run `pre-commit run --all-files` to see detailed error messages
4. **Package installation issues**: Make sure `uv` is installed and up to date
5. **Commit signing issues**:
   - Check if GPG agent is running
   - Verify GPG key is properly configured
   - Ensure GitHub has your public GPG key

### Getting Help
- Check the project README.md for additional information
- Review Django documentation for Django-specific issues
- Check pre-commit documentation for hook-related issues
- Review GitHub's GPG documentation for signing issues

## Project Structure
```
docker-learning/docker-practice/
├── books/          # Django app for book management
├── core/           # Django project settings
├── docs/           # Project documentation
├── scripts/        # Utility scripts
├── .venv/          # Virtual environment (created by uv)
├── requirements.txt # Python dependencies
├── pyproject.toml  # Tool configurations
├── .pre-commit-config.yaml # Pre-commit hook configurations
└── manage.py       # Django management script
```
