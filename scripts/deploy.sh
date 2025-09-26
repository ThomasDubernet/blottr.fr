#!/bin/bash

# =================================================================
# BLOTTR DEPLOYMENT SCRIPT
# =================================================================
# Production deployment script with comprehensive checks and rollback capability

set -euo pipefail

# =================================================================
# CONFIGURATION
# =================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENVIRONMENT="${1:-production}"
DEPLOY_VERSION="${2:-$(git rev-parse --short HEAD)}"
BACKUP_DIR="/var/backups/blottr"
DEPLOY_LOG="/var/log/blottr/deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# =================================================================
# UTILITY FUNCTIONS
# =================================================================
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$DEPLOY_LOG"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a "$DEPLOY_LOG"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}" | tee -a "$DEPLOY_LOG"
}

success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}" | tee -a "$DEPLOY_LOG"
}

# =================================================================
# VALIDATION FUNCTIONS
# =================================================================
validate_environment() {
    log "Validating environment: $ENVIRONMENT"

    case "$ENVIRONMENT" in
        production|staging|development)
            ;;
        *)
            error "Invalid environment: $ENVIRONMENT. Must be production, staging, or development"
            exit 1
            ;;
    esac

    # Check if environment file exists
    local env_file=".env.$ENVIRONMENT"
    if [[ ! -f "$env_file" ]]; then
        error "Environment file not found: $env_file"
        exit 1
    fi

    success "Environment validation passed"
}

validate_git_status() {
    log "Checking git status"

    # Check if working directory is clean
    if [[ -n $(git status --porcelain) ]]; then
        error "Working directory is not clean. Commit or stash changes before deploying."
        exit 1
    fi

    # Check if on correct branch for production
    if [[ "$ENVIRONMENT" == "production" ]]; then
        local current_branch=$(git branch --show-current)
        if [[ "$current_branch" != "main" ]]; then
            error "Production deployments must be from main branch (currently on: $current_branch)"
            exit 1
        fi
    fi

    success "Git status validation passed"
}

validate_dependencies() {
    log "Validating dependencies"

    # Check required tools
    local required_tools=("node" "npm" "git" "pg_dump")
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            error "Required tool not found: $tool"
            exit 1
        fi
    done

    # Validate Node.js version
    local node_version=$(node --version | cut -d'v' -f2)
    local required_version="18.0.0"
    if ! printf '%s\n%s\n' "$required_version" "$node_version" | sort -V -C; then
        error "Node.js version $node_version is below required version $required_version"
        exit 1
    fi

    success "Dependencies validation passed"
}

# =================================================================
# BACKUP FUNCTIONS
# =================================================================
create_backup() {
    log "Creating backup for deployment $DEPLOY_VERSION"

    local backup_timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_name="blottr_${ENVIRONMENT}_${backup_timestamp}_${DEPLOY_VERSION}"
    local backup_path="$BACKUP_DIR/$backup_name"

    mkdir -p "$backup_path"

    # Backup database
    log "Backing up database"
    pg_dump "$DATABASE_URL" > "$backup_path/database.sql"

    # Backup uploaded files
    if [[ -d "uploads" ]]; then
        log "Backing up uploaded files"
        tar -czf "$backup_path/uploads.tar.gz" uploads/
    fi

    # Backup current environment
    cp ".env" "$backup_path/env.backup" 2>/dev/null || true

    # Create backup metadata
    cat > "$backup_path/metadata.json" << EOF
{
    "environment": "$ENVIRONMENT",
    "version": "$DEPLOY_VERSION",
    "timestamp": "$backup_timestamp",
    "git_commit": "$(git rev-parse HEAD)",
    "git_branch": "$(git branch --show-current)",
    "node_version": "$(node --version)",
    "npm_version": "$(npm --version)"
}
EOF

    success "Backup created: $backup_path"
    echo "$backup_path" > "/tmp/blottr_last_backup"
}

# =================================================================
# DEPLOYMENT FUNCTIONS
# =================================================================
setup_environment() {
    log "Setting up environment configuration"

    # Copy environment file
    cp ".env.$ENVIRONMENT" ".env"

    # Validate environment configuration
    if command -v node &> /dev/null; then
        log "Validating environment configuration"
        npm run env:validate || {
            error "Environment validation failed"
            exit 1
        }
    fi

    success "Environment setup completed"
}

install_dependencies() {
    log "Installing dependencies"

    # Clean install for production
    if [[ "$ENVIRONMENT" == "production" ]]; then
        npm ci --only=production
    else
        npm ci
    fi

    success "Dependencies installed"
}

build_application() {
    log "Building application"

    # Build frontend assets
    npm run build

    # Run TypeScript compilation check
    npm run typecheck

    success "Application built successfully"
}

run_migrations() {
    log "Running database migrations"

    # Run migrations
    node ace migration:run --force

    success "Database migrations completed"
}

run_health_checks() {
    log "Running health checks"

    # Start application in background for health check
    npm start &
    local app_pid=$!

    # Wait for application to start
    sleep 10

    # Health check
    local health_url="http://localhost:${PORT:-3333}/api/health/contact-inquiries"
    local max_attempts=5
    local attempt=1

    while [[ $attempt -le $max_attempts ]]; do
        if curl -f -s "$health_url" > /dev/null; then
            success "Health check passed"
            kill $app_pid
            return 0
        fi

        warning "Health check attempt $attempt failed, retrying..."
        sleep 5
        ((attempt++))
    done

    error "Health check failed after $max_attempts attempts"
    kill $app_pid
    exit 1
}

# =================================================================
# ROLLBACK FUNCTIONS
# =================================================================
rollback_deployment() {
    error "Deployment failed, initiating rollback"

    local last_backup=$(cat "/tmp/blottr_last_backup" 2>/dev/null || echo "")

    if [[ -z "$last_backup" || ! -d "$last_backup" ]]; then
        error "No backup found for rollback"
        exit 1
    fi

    log "Rolling back to backup: $last_backup"

    # Restore database
    if [[ -f "$last_backup/database.sql" ]]; then
        log "Restoring database"
        psql "$DATABASE_URL" < "$last_backup/database.sql"
    fi

    # Restore uploaded files
    if [[ -f "$last_backup/uploads.tar.gz" ]]; then
        log "Restoring uploaded files"
        tar -xzf "$last_backup/uploads.tar.gz"
    fi

    # Restore environment
    if [[ -f "$last_backup/env.backup" ]]; then
        cp "$last_backup/env.backup" ".env"
    fi

    success "Rollback completed"
}

# =================================================================
# CLEANUP FUNCTIONS
# =================================================================
cleanup_old_backups() {
    log "Cleaning up old backups"

    # Keep only last 10 backups
    if [[ -d "$BACKUP_DIR" ]]; then
        find "$BACKUP_DIR" -type d -name "blottr_${ENVIRONMENT}_*" | \
            sort -r | tail -n +11 | xargs rm -rf
    fi

    success "Old backups cleaned up"
}

# =================================================================
# MAIN DEPLOYMENT FLOW
# =================================================================
main() {
    log "Starting deployment of Blottr $ENVIRONMENT environment (version: $DEPLOY_VERSION)"

    # Create log directory
    mkdir -p "$(dirname "$DEPLOY_LOG")"
    mkdir -p "$BACKUP_DIR"

    # Set trap for cleanup on failure
    trap rollback_deployment ERR

    # Validation phase
    validate_environment
    validate_git_status
    validate_dependencies

    # Backup phase
    create_backup

    # Deployment phase
    setup_environment
    install_dependencies
    build_application
    run_migrations

    # Validation phase
    run_health_checks

    # Cleanup phase
    cleanup_old_backups

    success "Deployment completed successfully!"
    log "Version $DEPLOY_VERSION is now live on $ENVIRONMENT"

    # Remove rollback trap
    trap - ERR
}

# =================================================================
# SCRIPT EXECUTION
# =================================================================
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi