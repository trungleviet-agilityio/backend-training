# Pre-commit Setup Guide

This guide will help you set up and use pre-commit hooks for the Django Docker Practice project to ensure code quality and consistency.

## What is Pre-commit?

Pre-commit is a framework for managing and maintaining multi-language pre-commit hooks. It automatically runs code quality checks before each commit, preventing issues from entering the codebase.

## Prerequisites

- Python 3.11+ (matching your virtual environment)
- Virtual environment activated
- Git repository initialized

## Installation

### 1. Install Pre-commit

Using uv (recommended for this project):
```bash
uv pip install pre-commit
```

Or using pip:
```bash
pip install pre-commit
```

### 2. Install Pre-commit Hooks

```bash
# Install the git hook scripts
pre-commit install

# Install hooks for commit messages (optional)
pre-commit install --hook-type commit-msg
```

## Configuration

The project already includes a `.pre-commit-config.yaml` file with the following hooks:

### Code Quality Tools
- **Ruff** - Fast Python linter and formatter
- **Black** - Python code formatter (line-length: 88)
- **isort** - Python import sorting (black profile)

### General Checks
- **trailing-whitespace** - Removes trailing whitespace
- **end-of-file-fixer** - Ensures files end with newline
- **check-yaml** - Validates YAML files
- **check-json** - Validates JSON files
- **check-toml** - Validates TOML files
- **check-added-large-files** - Prevents large files from being committed
- **check-merge-conflict** - Checks for merge conflict markers
- **debug-statements** - Checks for debugger imports and breakpoints
- **check-docstring-first** - Ensures docstrings come first

### Django-specific
- **django-upgrade** - Automatically upgrades Django syntax to version 5.0

## Usage

### Automatic Execution
Pre-commit hooks run automatically when you make a commit:
```bash
git add .
git commit -m "your commit message"
# Pre-commit hooks will run automatically
```

### Manual Execution

Run all hooks on all files:
```bash
pre-commit run --all-files
```

Run specific hook:
```bash
pre-commit run ruff
pre-commit run black
pre-commit run isort
```

Run hooks on specific files:
```bash
pre-commit run --files path/to/file.py
```

### Skip Hooks (Not Recommended)
If you need to skip pre-commit checks (emergency only):
```bash
git commit -m "emergency fix" --no-verify
```

## Troubleshooting

### Python Version Issues
If you get Python version errors:

1. Check your Python version:
   ```bash
   python --version
   ```

2. Update `.pre-commit-config.yaml` if needed:
   ```yaml
   - id: black
     language_version: python3.11  # Match your Python version
   ```

3. Clean and reinstall:
   ```bash
   pre-commit clean
   pre-commit install
   ```

### Hook Failures
When hooks fail:

1. **Read the error message** - it usually tells you exactly what's wrong
2. **Fix the issues** - most tools will auto-fix when possible
3. **Stage the changes** and commit again:
   ```bash
   git add .
   git commit -m "your message"
   ```

### Common Issues

#### Ruff Issues
```bash
# Fix automatically
ruff --fix .

# Check specific rules
ruff check --select E501  # Line too long
```

#### Black Formatting
```bash
# Format all Python files
black .

# Check what would be formatted
black --check .
```

#### Import Sorting (isort)
```bash
# Sort imports
isort .

# Check import sorting
isort --check-only .
```

### Cache Issues
If hooks behave unexpectedly:
```bash
# Clean pre-commit cache
pre-commit clean

# Update hooks to latest versions
pre-commit autoupdate

# Reinstall hooks
pre-commit install
```

## Configuration Customization

### Adding New Hooks
To add new hooks, edit `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/new-hook-repo
    rev: v1.0.0
    hooks:
      - id: new-hook-id
        args: [--option1, --option2]
```

### Excluding Files
To exclude files from specific hooks:

```yaml
- id: black
  exclude: ^(migrations/|legacy_code/)
```

### Hook-specific Configuration
Some hooks can be configured in `pyproject.toml`:

```toml
[tool.black]
line-length = 88
target-version = ['py311']

[tool.isort]
profile = "black"
line_length = 88

[tool.ruff]
line-length = 88
target-version = "py311"
```

## Best Practices

### 1. Run Before Committing
Always run pre-commit before making commits:
```bash
pre-commit run --all-files
```

### 2. Fix Issues Incrementally
Don't ignore pre-commit failures. Fix them as they appear to maintain code quality.

### 3. Keep Hooks Updated
Regularly update hook versions:
```bash
pre-commit autoupdate
```

### 4. Team Consistency
Ensure all team members have pre-commit installed and configured identically.

### 5. CI/CD Integration
Consider running pre-commit in your CI/CD pipeline:
```yaml
# In GitHub Actions
- name: Run pre-commit
  uses: pre-commit/action@v3.0.0
```

## Integration with IDEs

### VS Code
Install extensions for better integration:
- Python
- Black Formatter
- isort
- Ruff

Configure settings.json:
```json
{
  "python.formatting.provider": "black",
  "python.linting.enabled": true,
  "python.linting.ruffEnabled": true,
  "editor.formatOnSave": true
}
```

### PyCharm
1. Install Black plugin
2. Configure external tools for ruff and isort
3. Set up file watchers for automatic formatting

## Workflow Example

```bash
# 1. Make your changes
vim myfile.py

# 2. Stage changes
git add myfile.py

# 3. Commit (pre-commit runs automatically)
git commit -m "feat: add new feature"

# If pre-commit fails:
# 4. Fix the issues (often auto-fixed)
git add .

# 5. Commit again
git commit -m "feat: add new feature"
```

## Getting Help

- **Pre-commit documentation**: https://pre-commit.com/
- **Ruff documentation**: https://docs.astral.sh/ruff/
- **Black documentation**: https://black.readthedocs.io/
- **isort documentation**: https://pycqa.github.io/isort/

For project-specific issues, check the main [Local Setup Guide](local_setup.md) or create an issue in the repository.
