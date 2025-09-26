#!/bin/bash

# Blottr.fr Auto-Fix Script
# Fixes ESLint and Prettier errors automatically

set -e

echo "🔧 Starting auto-fix for ESLint and Prettier errors..."

# Step 1: Auto-fix prettier and eslint errors
echo "📝 Running ESLint --fix..."
pnpm eslint . --fix --quiet || true

echo "✨ Running Prettier --write..."
pnpm prettier --write . --log-level warn

# Step 2: Handle filename casing issues (unicorn/filename-case)
echo "📁 Fixing filename casing..."

# Rename artistService.ts to artist_service.ts if it exists
if [ -f "inertia/services/artistService.ts" ]; then
    echo "   Renaming artistService.ts → artist_service.ts"
    mv "inertia/services/artistService.ts" "inertia/services/artist_service.ts"
fi

# Rename tattooService.ts to tattoo_service.ts if it exists
if [ -f "inertia/services/tattooService.ts" ]; then
    echo "   Renaming tattooService.ts → tattoo_service.ts"
    mv "inertia/services/tattooService.ts" "inertia/services/tattoo_service.ts"
fi

# Step 3: Update imports in index.ts if needed
if [ -f "inertia/services/index.ts" ]; then
    echo "🔗 Updating service imports..."
    sed -i '' 's/artistService/artist_service/g' "inertia/services/index.ts"
    sed -i '' 's/tattooService/tattoo_service/g' "inertia/services/index.ts"
fi

# Step 4: Find and update any other imports
echo "🔍 Updating imports in other files..."
find inertia -name "*.ts" -o -name "*.tsx" | xargs grep -l "artistService\|tattooService" | while read file; do
    echo "   Updating imports in $file"
    sed -i '' 's/artistService/artist_service/g' "$file"
    sed -i '' 's/tattooService/tattoo_service/g' "$file"
done

# Step 5: Run final prettier pass
echo "✨ Final Prettier formatting..."
pnpm prettier --write inertia/ --log-level warn

# Step 6: Verify fixes
echo "✅ Running final lint check..."
if pnpm eslint inertia/ --quiet; then
    echo "🎉 All ESLint and Prettier errors fixed!"
else
    echo "⚠️  Some issues remain - running with details:"
    pnpm eslint inertia/
fi

echo "🏁 Auto-fix complete!"