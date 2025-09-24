#!/bin/bash

##
# Quality Gates Execution Script
# Runs systematic validation for design system implementation
##

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
QUALITY_DIR="$PROJECT_ROOT/tests/quality"
REPORTS_DIR="$PROJECT_ROOT/quality-reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create reports directory
mkdir -p "$REPORTS_DIR"

# Logging setup
LOG_FILE="$REPORTS_DIR/quality-gates_$TIMESTAMP.log"
SUMMARY_FILE="$REPORTS_DIR/summary_$TIMESTAMP.json"

log() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

log_error() {
    log "${RED}❌ $1${NC}"
}

log_success() {
    log "${GREEN}✅ $1${NC}"
}

log_warning() {
    log "${YELLOW}⚠️  $1${NC}"
}

log_info() {
    log "${BLUE}ℹ️  $1${NC}"
}

# Initialize summary
init_summary() {
    cat > "$SUMMARY_FILE" << EOF
{
  "timestamp": "$TIMESTAMP",
  "project": "blottr.fr",
  "version": "0.0.0",
  "phases": {},
  "overall": {
    "status": "running",
    "start_time": "$(date -Iseconds)",
    "end_time": null,
    "duration": null,
    "gates_total": 0,
    "gates_passed": 0,
    "gates_failed": 0,
    "gates_warning": 0
  }
}
EOF
}

# Update summary with phase results
update_summary() {
    local phase=$1
    local status=$2
    local passed=$3
    local failed=$4
    local warnings=$5

    # Use node to update JSON (more reliable than bash)
    node -e "
        const fs = require('fs');
        const summary = JSON.parse(fs.readFileSync('$SUMMARY_FILE', 'utf8'));
        summary.phases['$phase'] = {
            status: '$status',
            passed: $passed,
            failed: $failed,
            warnings: $warnings,
            timestamp: new Date().toISOString()
        };
        summary.overall.gates_total += ($passed + $failed + $warnings);
        summary.overall.gates_passed += $passed;
        summary.overall.gates_failed += $failed;
        summary.overall.gates_warning += $warnings;
        fs.writeFileSync('$SUMMARY_FILE', JSON.stringify(summary, null, 2));
    "
}

# Finalize summary
finalize_summary() {
    local overall_status=$1
    node -e "
        const fs = require('fs');
        const summary = JSON.parse(fs.readFileSync('$SUMMARY_FILE', 'utf8'));
        const start = new Date(summary.overall.start_time);
        const end = new Date();
        summary.overall.end_time = end.toISOString();
        summary.overall.duration = end - start;
        summary.overall.status = '$overall_status';
        fs.writeFileSync('$SUMMARY_FILE', JSON.stringify(summary, null, 2));
    "
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if Node.js is available
    if ! command -v node >/dev/null 2>&1; then
        log_error "Node.js is not installed"
        return 1
    fi

    # Check if npm is available
    if ! command -v npm >/dev/null 2>&1; then
        log_error "npm is not installed"
        return 1
    fi

    # Check if project dependencies are installed
    if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
        log_warning "Node modules not found, installing..."
        cd "$PROJECT_ROOT"
        npm ci --silent
    fi

    # Check if development server is running
    if ! curl -sf "http://localhost:3333" >/dev/null 2>&1; then
        log_warning "Development server not running on localhost:3333"
        log_info "Please run 'npm run dev' in another terminal"
        return 1
    fi

    log_success "Prerequisites check passed"
    return 0
}

# Phase 1: Pre-Implementation Gates
run_pre_implementation_gates() {
    log_info "🚀 Phase 1: Pre-Implementation Gates"

    local phase="pre-implementation"
    local passed=0
    local failed=0
    local warnings=0

    # Dependency compatibility check
    log_info "Checking dependency compatibility..."
    if npm audit --audit-level high >/dev/null 2>&1; then
        log_success "Dependency security check passed"
        ((passed++))
    else
        log_error "High severity vulnerabilities found"
        ((failed++))
    fi

    # Check for outdated dependencies
    local outdated_count
    outdated_count=$(npm outdated --json 2>/dev/null | jq '. | length' 2>/dev/null || echo "0")
    if [ "$outdated_count" -lt 10 ]; then
        log_success "Dependencies are reasonably up to date"
        ((passed++))
    else
        log_warning "$outdated_count dependencies are outdated"
        ((warnings++))
    fi

    # TypeScript compilation check
    log_info "Checking TypeScript compilation..."
    if npm run typecheck >/dev/null 2>&1; then
        log_success "TypeScript compilation successful"
        ((passed++))
    else
        log_error "TypeScript compilation failed"
        ((failed++))
    fi

    # Linting check
    log_info "Running linter..."
    if npm run lint >/dev/null 2>&1; then
        log_success "Linting passed"
        ((passed++))
    else
        log_warning "Linting issues found"
        ((warnings++))
    fi

    # Build check
    log_info "Testing build process..."
    if npm run build >/dev/null 2>&1; then
        log_success "Build process successful"
        ((passed++))
    else
        log_error "Build process failed"
        ((failed++))
    fi

    local status="passed"
    if [ $failed -gt 0 ]; then
        status="failed"
    elif [ $warnings -gt 0 ]; then
        status="warning"
    fi

    update_summary "$phase" "$status" $passed $failed $warnings

    if [ $failed -gt 0 ]; then
        log_error "Pre-implementation phase failed: $failed critical issues"
        return 1
    fi

    log_success "Pre-implementation phase completed: $passed passed, $warnings warnings"
    return 0
}

# Phase 2: Development Phase Gates
run_development_gates() {
    log_info "🔨 Phase 2: Development Phase Gates"

    local phase="development"
    local passed=0
    local failed=0
    local warnings=0

    # Test execution
    log_info "Running test suite..."
    if npm test >/dev/null 2>&1; then
        log_success "Test suite passed"
        ((passed++))
    else
        log_error "Test suite failed"
        ((failed++))
    fi

    # Test coverage check (if coverage is configured)
    if npm run test:coverage >/dev/null 2>&1; then
        log_success "Test coverage check passed"
        ((passed++))
    else
        log_warning "Test coverage check not available or failed"
        ((warnings++))
    fi

    # Component standards check
    log_info "Checking component standards..."
    if find "$PROJECT_ROOT/inertia" -name "*.tsx" -o -name "*.ts" | xargs grep -l "export default" >/dev/null 2>&1; then
        log_success "Component export standards met"
        ((passed++))
    else
        log_warning "Component export standards check inconclusive"
        ((warnings++))
    fi

    local status="passed"
    if [ $failed -gt 0 ]; then
        status="failed"
    elif [ $warnings -gt 0 ]; then
        status="warning"
    fi

    update_summary "$phase" "$status" $passed $failed $warnings

    if [ $failed -gt 0 ]; then
        log_error "Development phase failed: $failed critical issues"
        return 1
    fi

    log_success "Development phase completed: $passed passed, $warnings warnings"
    return 0
}

# Phase 3: Integration Gates
run_integration_gates() {
    log_info "🔗 Phase 3: Integration Gates"

    local phase="integration"
    local passed=0
    local failed=0
    local warnings=0

    # SSR compatibility check
    log_info "Testing SSR compatibility..."
    if curl -sf "http://localhost:3333" | grep -q "<!DOCTYPE html>" 2>/dev/null; then
        log_success "SSR rendering working"
        ((passed++))
    else
        log_error "SSR rendering check failed"
        ((failed++))
    fi

    # Bundle size check (if build artifacts exist)
    if [ -d "$PROJECT_ROOT/build" ] || [ -d "$PROJECT_ROOT/dist" ]; then
        local bundle_size
        bundle_size=$(find "$PROJECT_ROOT" -name "*.js" -path "*/build/*" -o -path "*/dist/*" -exec wc -c {} + 2>/dev/null | tail -1 | awk '{print $1}' || echo "0")

        local max_bundle_size=$((500 * 1024)) # 500KB limit

        if [ "$bundle_size" -lt "$max_bundle_size" ]; then
            log_success "Bundle size within limits ($bundle_size bytes)"
            ((passed++))
        else
            log_error "Bundle size too large: $bundle_size bytes (limit: $max_bundle_size bytes)"
            ((failed++))
        fi
    else
        log_warning "Build artifacts not found, skipping bundle size check"
        ((warnings++))
    fi

    # API endpoint check
    log_info "Testing API endpoints..."
    if curl -sf "http://localhost:3333/api/health" >/dev/null 2>&1 || curl -sf "http://localhost:3333/_health" >/dev/null 2>&1; then
        log_success "API endpoints accessible"
        ((passed++))
    else
        log_warning "Health check endpoint not found"
        ((warnings++))
    fi

    local status="passed"
    if [ $failed -gt 0 ]; then
        status="failed"
    elif [ $warnings -gt 0 ]; then
        status="warning"
    fi

    update_summary "$phase" "$status" $passed $failed $warnings

    if [ $failed -gt 0 ]; then
        log_error "Integration phase failed: $failed critical issues"
        return 1
    fi

    log_success "Integration phase completed: $passed passed, $warnings warnings"
    return 0
}

# Phase 4: Production Readiness Gates
run_production_readiness_gates() {
    log_info "🚀 Phase 4: Production Readiness Gates"

    local phase="production-readiness"
    local passed=0
    local failed=0
    local warnings=0

    # Security headers check
    log_info "Checking security headers..."
    local response_headers
    response_headers=$(curl -sI "http://localhost:3333" 2>/dev/null || echo "")

    if echo "$response_headers" | grep -qi "x-frame-options\|content-security-policy"; then
        log_success "Security headers present"
        ((passed++))
    else
        log_warning "Security headers missing or incomplete"
        ((warnings++))
    fi

    # Performance check (basic load time)
    log_info "Basic performance check..."
    local load_time
    load_time=$(curl -w "%{time_total}" -o /dev/null -s "http://localhost:3333" 2>/dev/null | cut -d. -f1)

    if [ "$load_time" -lt 3 ]; then
        log_success "Basic load time acceptable (${load_time}s)"
        ((passed++))
    else
        log_warning "Load time high: ${load_time}s"
        ((warnings++))
    fi

    # Documentation check
    log_info "Checking documentation completeness..."
    local docs_count
    docs_count=$(find "$PROJECT_ROOT" -name "*.md" -not -path "*/node_modules/*" | wc -l)

    if [ "$docs_count" -gt 3 ]; then
        log_success "Documentation appears complete ($docs_count files)"
        ((passed++))
    else
        log_warning "Limited documentation found ($docs_count files)"
        ((warnings++))
    fi

    # Environment configuration check
    log_info "Checking environment configuration..."
    if [ -f "$PROJECT_ROOT/.env.example" ]; then
        log_success "Environment configuration template exists"
        ((passed++))
    else
        log_warning "Environment configuration template missing"
        ((warnings++))
    fi

    local status="passed"
    if [ $failed -gt 0 ]; then
        status="failed"
    elif [ $warnings -gt 0 ]; then
        status="warning"
    fi

    update_summary "$phase" "$status" $passed $failed $warnings

    if [ $failed -gt 0 ]; then
        log_error "Production readiness phase failed: $failed critical issues"
        return 1
    fi

    log_success "Production readiness phase completed: $passed passed, $warnings warnings"
    return 0
}

# Run quality gates for specific phase
run_phase() {
    local phase=$1

    case "$phase" in
        "pre-implementation"|"pre"|"1")
            run_pre_implementation_gates
            ;;
        "development"|"dev"|"2")
            run_development_gates
            ;;
        "integration"|"int"|"3")
            run_integration_gates
            ;;
        "production-readiness"|"prod"|"4")
            run_production_readiness_gates
            ;;
        *)
            log_error "Unknown phase: $phase"
            echo "Available phases: pre-implementation, development, integration, production-readiness"
            return 1
            ;;
    esac
}

# Run all quality gates
run_all_gates() {
    log_info "🌟 Running complete quality gate validation"

    local overall_success=true
    local phases=("pre-implementation" "development" "integration" "production-readiness")

    for phase in "${phases[@]}"; do
        if ! run_phase "$phase"; then
            overall_success=false
            log_error "Phase '$phase' failed - stopping execution"
            break
        fi

        log_info "✓ Phase '$phase' completed successfully"
        echo "" # Add spacing between phases
    done

    if [ "$overall_success" = true ]; then
        finalize_summary "passed"
        log_success "🎉 All quality gates passed successfully!"
        return 0
    else
        finalize_summary "failed"
        log_error "💥 Quality gates validation failed"
        return 1
    fi
}

# Generate HTML report
generate_html_report() {
    log_info "Generating HTML report..."

    cat > "$REPORTS_DIR/quality-report_$TIMESTAMP.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quality Gates Report - $TIMESTAMP</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .status-passed { color: #28a745; }
        .status-failed { color: #dc3545; }
        .status-warning { color: #ffc107; }
        .phase { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { text-align: center; padding: 15px; background: #f8f9fa; border-radius: 6px; }
        .metric-value { font-size: 2em; font-weight: bold; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 6px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Blottr.fr Quality Gates Report</h1>
        <p>Generated: $TIMESTAMP</p>
    </div>

    <div id="summary"></div>
    <div id="phases"></div>
    <div id="logs">
        <h2>Execution Log</h2>
        <pre>$(cat "$LOG_FILE")</pre>
    </div>

    <script>
        // Load and display JSON summary
        fetch('./summary_$TIMESTAMP.json')
            .then(response => response.json())
            .then(data => {
                // Display overall summary
                const summary = document.getElementById('summary');
                const overall = data.overall;
                const statusClass = 'status-' + overall.status;

                summary.innerHTML = \`
                    <h2>Overall Results</h2>
                    <div class="metrics">
                        <div class="metric">
                            <div class="metric-value \${statusClass}">\${overall.status.toUpperCase()}</div>
                            <div>Status</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value status-passed">\${overall.gates_passed}</div>
                            <div>Passed</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value status-failed">\${overall.gates_failed}</div>
                            <div>Failed</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value status-warning">\${overall.gates_warning}</div>
                            <div>Warnings</div>
                        </div>
                    </div>
                \`;

                // Display phase results
                const phases = document.getElementById('phases');
                phases.innerHTML = '<h2>Phase Results</h2>';

                Object.entries(data.phases).forEach(([phaseName, phaseData]) => {
                    const statusClass = 'status-' + phaseData.status;
                    phases.innerHTML += \`
                        <div class="phase">
                            <h3>\${phaseName.replace('-', ' ')} <span class="\${statusClass}">[\${phaseData.status.toUpperCase()}]</span></h3>
                            <p>Passed: \${phaseData.passed}, Failed: \${phaseData.failed}, Warnings: \${phaseData.warnings}</p>
                        </div>
                    \`;
                });
            })
            .catch(error => {
                console.error('Failed to load summary:', error);
                document.getElementById('summary').innerHTML = '<p>Failed to load summary data</p>';
            });
    </script>
</body>
</html>
EOF

    log_success "HTML report generated: quality-report_$TIMESTAMP.html"
}

# Main execution
main() {
    log_info "🎯 Blottr.fr Quality Gates Runner"
    log_info "Starting validation at $(date)"

    init_summary

    # Change to project directory
    cd "$PROJECT_ROOT"

    # Check prerequisites
    if ! check_prerequisites; then
        log_error "Prerequisites check failed"
        finalize_summary "failed"
        exit 1
    fi

    # Parse command line arguments
    if [ $# -eq 0 ]; then
        # Run all gates
        if run_all_gates; then
            generate_html_report
            exit 0
        else
            generate_html_report
            exit 1
        fi
    else
        # Run specific phase
        local phase=$1
        if run_phase "$phase"; then
            log_success "Phase '$phase' completed successfully"
            finalize_summary "passed"
            generate_html_report
            exit 0
        else
            log_error "Phase '$phase' failed"
            finalize_summary "failed"
            generate_html_report
            exit 1
        fi
    fi
}

# Show help
show_help() {
    cat << EOF
Quality Gates Runner for Blottr.fr

Usage:
    $0                           Run all quality gates
    $0 <phase>                   Run specific phase
    $0 --help                    Show this help

Available phases:
    pre-implementation (pre, 1)  Pre-implementation checks
    development (dev, 2)         Development phase checks
    integration (int, 3)         Integration testing
    production-readiness (prod, 4) Production readiness

Examples:
    $0                           # Run all phases
    $0 development               # Run only development phase
    $0 pre                       # Run pre-implementation phase

Reports are saved in: quality-reports/
EOF
}

# Handle command line arguments
if [ $# -gt 0 ] && [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

# Run main function
main "$@"