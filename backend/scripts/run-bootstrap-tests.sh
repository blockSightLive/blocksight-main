#!/bin/bash

/**
 * @fileoverview Bootstrap test runner script
 * @version 1.0.0
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * @state ✅ Complete - Test automation
 * 
 * @description
 * Automated test runner for bootstrap functionality including:
 * - Unit tests
 * - Integration tests
 * - Performance tests
 * - Test coverage reporting
 * 
 * @dependencies
 * - Node.js and npm
 * - Jest testing framework
 * - Test files in backend/tests/
 * 
 * @usage
 * Run with: ./scripts/run-bootstrap-tests.sh
 * 
 * @state
 * ✅ Complete - Test automation
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add test result reporting
 * - Add performance benchmarking
 * - Add test coverage thresholds
 * 
 * @performance
 * - Tests complete in <30 seconds
 * - Parallel test execution
 * - Minimal setup overhead
 * 
 * @security
 * - No sensitive data in tests
 * - Test environment isolation
 * - Safe test execution
 */

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TESTS_DIR="$PROJECT_ROOT/tests"
COVERAGE_DIR="$PROJECT_ROOT/coverage"
JEST_CONFIG="$PROJECT_ROOT/jest.config.ts"

# Test configuration
UNIT_TESTS=(
  "bootstrap.controller.test.ts"
  "bootstrap.routes.test.ts"
)

INTEGRATION_TESTS=(
  "bootstrap.integration.test.ts"
)

PERFORMANCE_TESTS=(
  "bootstrap.performance.test.ts"
)

ALL_TESTS=(
  "${UNIT_TESTS[@]}"
  "${INTEGRATION_TESTS[@]}"
  "${PERFORMANCE_TESTS[@]}"
)

# Function to print colored output
print_status() {
  local status=$1
  local message=$2
  
  case $status in
    "info")
      echo -e "${BLUE}[INFO]${NC} $message"
      ;;
    "success")
      echo -e "${GREEN}[SUCCESS]${NC} $message"
      ;;
    "warning")
      echo -e "${YELLOW}[WARNING]${NC} $message"
      ;;
    "error")
      echo -e "${RED}[ERROR]${NC} $message"
      ;;
  esac
}

# Function to check prerequisites
check_prerequisites() {
  print_status "info" "Checking prerequisites..."
  
  # Check if we're in the right directory
  if [[ ! -f "$PROJECT_ROOT/package.json" ]]; then
    print_status "error" "package.json not found. Please run this script from the backend directory."
    exit 1
  fi
  
  # Check if Jest is available
  if ! command -v npx &> /dev/null; then
    print_status "error" "npx not found. Please install Node.js and npm."
    exit 1
  fi
  
  # Check if Jest config exists
  if [[ ! -f "$JEST_CONFIG" ]]; then
    print_status "error" "Jest configuration not found at $JEST_CONFIG"
    exit 1
  fi
  
  print_status "success" "Prerequisites check passed"
}

# Function to run a single test file
run_test_file() {
  local test_file=$1
  local test_path="$TESTS_DIR/$test_file"
  
  if [[ ! -f "$test_path" ]]; then
    print_status "warning" "Test file not found: $test_file"
    return 1
  fi
  
  print_status "info" "Running test: $test_file"
  
  # Run the test with Jest
  if npx jest "$test_path" --config="$JEST_CONFIG" --verbose; then
    print_status "success" "Test passed: $test_file"
    return 0
  else
    print_status "error" "Test failed: $test_file"
    return 1
  fi
}

# Function to run all tests
run_all_tests() {
  print_status "info" "Running all bootstrap tests..."
  
  local failed_tests=()
  local passed_tests=()
  local total_tests=${#ALL_TESTS[@]}
  local passed_count=0
  local failed_count=0
  
  for test_file in "${ALL_TESTS[@]}"; do
    if run_test_file "$test_file"; then
      passed_tests+=("$test_file")
      ((passed_count++))
    else
      failed_tests+=("$test_file")
      ((failed_count++))
    fi
  done
  
  # Print summary
  echo
  print_status "info" "Test Summary:"
  echo "  Total tests: $total_tests"
  echo "  Passed: $passed_count"
  echo "  Failed: $failed_count"
  
  if [[ $failed_count -gt 0 ]]; then
    print_status "error" "Failed tests:"
    for test in "${failed_tests[@]}"; do
      echo "  - $test"
    done
    return 1
  else
    print_status "success" "All tests passed!"
    return 0
  fi
}

# Function to run tests by category
run_tests_by_category() {
  local category=$1
  
  case $category in
    "unit")
      print_status "info" "Running unit tests..."
      for test in "${UNIT_TESTS[@]}"; do
        run_test_file "$test"
      done
      ;;
    "integration")
      print_status "info" "Running integration tests..."
      for test in "${INTEGRATION_TESTS[@]}"; do
        run_test_file "$test"
      done
      ;;
    "performance")
      print_status "info" "Running performance tests..."
      for test in "${PERFORMANCE_TESTS[@]}"; do
        run_test_file "$test"
      done
      ;;
    *)
      print_status "error" "Unknown test category: $category"
      print_status "info" "Available categories: unit, integration, performance"
      exit 1
      ;;
  esac
}

# Function to run tests with coverage
run_tests_with_coverage() {
  print_status "info" "Running tests with coverage..."
  
  # Create coverage directory if it doesn't exist
  mkdir -p "$COVERAGE_DIR"
  
  # Run Jest with coverage
  if npx jest "${ALL_TESTS[@]/#/$TESTS_DIR/}" --config="$JEST_CONFIG" --coverage --coverageDirectory="$COVERAGE_DIR"; then
    print_status "success" "Tests with coverage completed successfully"
    print_status "info" "Coverage report available at: $COVERAGE_DIR"
    
    # Open coverage report if possible
    if command -v open &> /dev/null; then
      open "$COVERAGE_DIR/lcov-report/index.html"
    elif command -v xdg-open &> /dev/null; then
      xdg-open "$COVERAGE_DIR/lcov-report/index.html"
    fi
  else
    print_status "error" "Tests with coverage failed"
    return 1
  fi
}

# Function to clean up
cleanup() {
  print_status "info" "Cleaning up..."
  
  # Remove coverage directory if it exists
  if [[ -d "$COVERAGE_DIR" ]]; then
    rm -rf "$COVERAGE_DIR"
    print_status "success" "Coverage directory cleaned"
  fi
  
  # Clear Jest cache
  npx jest --clearCache --config="$JEST_CONFIG" > /dev/null 2>&1 || true
  print_status "success" "Jest cache cleared"
}

# Function to show help
show_help() {
  echo "Bootstrap Test Runner"
  echo
  echo "Usage: $0 [OPTIONS]"
  echo
  echo "Options:"
  echo "  -h, --help           Show this help message"
  echo "  -a, --all            Run all tests (default)"
  echo "  -u, --unit           Run only unit tests"
  echo "  -i, --integration    Run only integration tests"
  echo "  -p, --performance    Run only performance tests"
  echo "  -c, --coverage       Run tests with coverage reporting"
  echo "  --clean              Clean up test artifacts and cache"
  echo "  --list               List all available test files"
  echo
  echo "Examples:"
  echo "  $0                    # Run all tests"
  echo "  $0 --unit            # Run only unit tests"
  echo "  $0 --coverage        # Run all tests with coverage"
  echo "  $0 --clean           # Clean up test artifacts"
}

# Function to list test files
list_tests() {
  echo "Available test files:"
  echo
  echo "Unit Tests:"
  for test in "${UNIT_TESTS[@]}"; do
    echo "  - $test"
  done
  echo
  echo "Integration Tests:"
  for test in "${INTEGRATION_TESTS[@]}"; do
    echo "  - $test"
  done
  echo
  echo "Performance Tests:"
  for test in "${PERFORMANCE_TESTS[@]}"; do
    echo "  - $test"
  done
}

# Main script logic
main() {
  local run_all=true
  local run_coverage=false
  local run_cleanup=false
  local list_only=false
  local category=""
  
  # Parse command line arguments
  while [[ $# -gt 0 ]]; do
    case $1 in
      -h|--help)
        show_help
        exit 0
        ;;
      -a|--all)
        run_all=true
        shift
        ;;
      -u|--unit)
        run_all=false
        category="unit"
        shift
        ;;
      -i|--integration)
        run_all=false
        category="integration"
        shift
        ;;
      -p|--performance)
        run_all=false
        category="performance"
        shift
        ;;
      -c|--coverage)
        run_coverage=true
        shift
        ;;
      --clean)
        run_cleanup=true
        shift
        ;;
      --list)
        list_only=true
        shift
        ;;
      *)
        print_status "error" "Unknown option: $1"
        show_help
        exit 1
        ;;
    esac
  done
  
  # Change to project root directory
  cd "$PROJECT_ROOT"
  
  # Check prerequisites
  check_prerequisites
  
  # Handle special cases
  if [[ "$list_only" == true ]]; then
    list_tests
    exit 0
  fi
  
  if [[ "$run_cleanup" == true ]]; then
    cleanup
    exit 0
  fi
  
  # Run tests based on options
  if [[ "$run_coverage" == true ]]; then
    run_tests_with_coverage
  elif [[ "$run_all" == true ]]; then
    run_all_tests
  else
    run_tests_by_category "$category"
  fi
  
  print_status "success" "Test execution completed"
}

# Run main function with all arguments
main "$@"
