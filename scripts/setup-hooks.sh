#!/bin/bash

# Setup Git Hooks for Blottr.fr
# This script makes the husky hooks executable and initializes the git hooks

echo "🔧 Setting up Git Hooks for automated formatting and linting..."

# Make husky hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/post-commit

# Initialize git hooks if not already done
if [ ! -f .git/hooks/pre-commit ]; then
  echo "📋 Initializing husky git hooks..."
  # Check if husky is available
  if command -v husky &> /dev/null; then
    npx husky install
  else
    echo "⚠️  Husky not found. Please install it first: pnpm add -D husky"
  fi
fi

echo "✅ Git hooks setup complete!"
echo ""
echo "📝 Available npm scripts for code quality:"
echo "  npm run code:quality  - Format code, fix lint issues, and type check"
echo "  npm run post-dev     - Run after development (same as code:quality)"
echo "  npm run code:check   - Check formatting, linting, and types without fixing"
echo "  npm run pre-commit   - Run pre-commit checks"
echo ""
echo "🎯 The pre-commit hook will now automatically:"
echo "  ✓ Check and fix code formatting with Prettier"
echo "  ✓ Check and fix ESLint issues"
echo "  ✓ Run TypeScript type checking"
echo ""