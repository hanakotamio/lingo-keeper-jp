#!/bin/bash

###############################################################################
# セキュリティチェック自動実行スクリプト
#
# 使い方:
#   ./scripts/security-check.sh [options]
#
# オプション:
#   --all          すべてのチェックを実行
#   --headers      セキュリティヘッダーチェック
#   --ssl          SSL/TLS チェック
#   --zap          OWASP ZAP スキャン
#   --lighthouse   Lighthouse CI スキャン
#   --npm-audit    npm audit 実行
#   --report       レポート生成
#
# 例:
#   ./scripts/security-check.sh --all
#   ./scripts/security-check.sh --headers --ssl
###############################################################################

set -e

# カラー出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# プロジェクト設定
FRONTEND_URL="https://frontend-seven-beta-72.vercel.app"
BACKEND_URL="https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app"
REPORT_DIR="./security-reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# レポートディレクトリ作成
mkdir -p "$REPORT_DIR"

###############################################################################
# ヘルパー関数
###############################################################################

print_header() {
  echo -e "\n${BLUE}========================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

###############################################################################
# セキュリティヘッダーチェック
###############################################################################

check_security_headers() {
  print_header "Security Headers Check"

  if [ -z "$SECURITY_HEADERS_API_KEY" ]; then
    print_warning "SECURITY_HEADERS_API_KEY not set. Using manual check."
    echo "Please visit: https://securityheaders.com/?q=$FRONTEND_URL"
    echo "Please visit: https://securityheaders.com/?q=$BACKEND_URL"
    return
  fi

  echo "Checking frontend headers..."
  frontend_response=$(curl -s -H "x-api-key: $SECURITY_HEADERS_API_KEY" \
    "https://api-test.securityheaders.com/?q=$FRONTEND_URL&hide=on&followRedirects=on")
  frontend_grade=$(echo "$frontend_response" | jq -r '.grade')

  if [ "$frontend_grade" = "A" ] || [ "$frontend_grade" = "A+" ]; then
    print_success "Frontend headers: $frontend_grade"
  else
    print_warning "Frontend headers: $frontend_grade (Expected A or A+)"
  fi

  echo "Checking backend headers..."
  backend_response=$(curl -s -H "x-api-key: $SECURITY_HEADERS_API_KEY" \
    "https://api-test.securityheaders.com/?q=$BACKEND_URL&hide=on&followRedirects=on")
  backend_grade=$(echo "$backend_response" | jq -r '.grade')

  if [ "$backend_grade" = "A" ] || [ "$backend_grade" = "A+" ]; then
    print_success "Backend headers: $backend_grade"
  else
    print_warning "Backend headers: $backend_grade (Expected A or A+)"
  fi

  # レポート保存
  echo "$frontend_response" > "$REPORT_DIR/security-headers-frontend-$TIMESTAMP.json"
  echo "$backend_response" > "$REPORT_DIR/security-headers-backend-$TIMESTAMP.json"

  print_success "Reports saved to $REPORT_DIR"
}

###############################################################################
# SSL/TLS チェック
###############################################################################

check_ssl() {
  print_header "SSL/TLS Check"

  if ! command -v ssllabs-scan &> /dev/null; then
    print_warning "ssllabs-scan not installed. Installing..."
    go install github.com/ssllabs/ssllabs-scan@latest
  fi

  echo "Checking frontend SSL/TLS configuration..."
  ~/go/bin/ssllabs-scan --grade --hostcheck \
    frontend-seven-beta-72.vercel.app > "$REPORT_DIR/ssl-frontend-$TIMESTAMP.txt"

  if grep -q "Grade: A" "$REPORT_DIR/ssl-frontend-$TIMESTAMP.txt"; then
    print_success "Frontend SSL: Grade A or higher"
  else
    print_warning "Frontend SSL: Grade lower than A"
  fi

  cat "$REPORT_DIR/ssl-frontend-$TIMESTAMP.txt"
}

###############################################################################
# OWASP ZAP スキャン
###############################################################################

run_zap_scan() {
  print_header "OWASP ZAP Security Scan"

  if ! command -v docker &> /dev/null; then
    print_error "Docker not installed. Please install Docker first."
    return 1
  fi

  echo "Running ZAP baseline scan on frontend..."
  docker run -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
    -t "$FRONTEND_URL" \
    -r "$REPORT_DIR/zap-frontend-$TIMESTAMP.html" || true

  echo "Running ZAP API scan on backend..."
  docker run -t ghcr.io/zaproxy/zaproxy:stable zap-api-scan.py \
    -t "$BACKEND_URL/api" \
    -f openapi \
    -r "$REPORT_DIR/zap-backend-$TIMESTAMP.html" || true

  print_success "ZAP reports saved to $REPORT_DIR"
  echo "Open reports:"
  echo "  - file://$PWD/$REPORT_DIR/zap-frontend-$TIMESTAMP.html"
  echo "  - file://$PWD/$REPORT_DIR/zap-backend-$TIMESTAMP.html"
}

###############################################################################
# Lighthouse CI スキャン
###############################################################################

run_lighthouse() {
  print_header "Lighthouse CI Scan"

  if ! command -v lhci &> /dev/null; then
    print_warning "Lighthouse CI not installed. Installing..."
    npm install -g @lhci/cli
  fi

  echo "Running Lighthouse CI..."
  lhci autorun || true

  if [ -d ".lighthouseci" ]; then
    cp -r .lighthouseci "$REPORT_DIR/lighthouse-$TIMESTAMP"
    print_success "Lighthouse reports saved to $REPORT_DIR/lighthouse-$TIMESTAMP"
  fi
}

###############################################################################
# npm audit
###############################################################################

run_npm_audit() {
  print_header "npm Audit"

  echo "Checking frontend dependencies..."
  cd frontend
  npm audit --json > "../$REPORT_DIR/npm-audit-frontend-$TIMESTAMP.json" || true
  npm audit
  cd ..

  echo ""
  echo "Checking backend dependencies..."
  cd backend
  npm audit --json > "../$REPORT_DIR/npm-audit-backend-$TIMESTAMP.json" || true
  npm audit
  cd ..

  print_success "npm audit reports saved to $REPORT_DIR"
}

###############################################################################
# レポート生成
###############################################################################

generate_report() {
  print_header "Security Report Generation"

  REPORT_FILE="$REPORT_DIR/security-report-$TIMESTAMP.md"

  cat > "$REPORT_FILE" << EOF
# Security Check Report

**Date**: $(date +"%Y-%m-%d %H:%M:%S %Z")
**Project**: Lingo Keeper JP

---

## Summary

### Frontend
- URL: $FRONTEND_URL
- Security Headers: See \`security-headers-frontend-$TIMESTAMP.json\`
- SSL/TLS: See \`ssl-frontend-$TIMESTAMP.txt\`
- OWASP ZAP: See \`zap-frontend-$TIMESTAMP.html\`
- Lighthouse: See \`lighthouse-$TIMESTAMP/\`

### Backend
- URL: $BACKEND_URL
- Security Headers: See \`security-headers-backend-$TIMESTAMP.json\`
- OWASP ZAP: See \`zap-backend-$TIMESTAMP.html\`

### Dependencies
- Frontend: See \`npm-audit-frontend-$TIMESTAMP.json\`
- Backend: See \`npm-audit-backend-$TIMESTAMP.json\`

---

## Action Items

### High Priority
- [ ] Fix any High risk vulnerabilities from OWASP ZAP
- [ ] Address npm audit High/Critical vulnerabilities
- [ ] Ensure Security Headers grade is A or A+

### Medium Priority
- [ ] Improve Lighthouse scores to 90+
- [ ] Fix Medium risk vulnerabilities
- [ ] Review SSL/TLS configuration

### Low Priority
- [ ] Address informational findings
- [ ] Optimize performance metrics

---

**Next Review**: $(date -d "+7 days" +"%Y-%m-%d")
EOF

  print_success "Security report generated: $REPORT_FILE"
}

###############################################################################
# メイン処理
###############################################################################

main() {
  print_header "Lingo Keeper JP - Security Check"

  if [ $# -eq 0 ]; then
    echo "Usage: $0 [--all|--headers|--ssl|--zap|--lighthouse|--npm-audit|--report]"
    echo ""
    echo "Options:"
    echo "  --all          Run all security checks"
    echo "  --headers      Check security headers"
    echo "  --ssl          Check SSL/TLS configuration"
    echo "  --zap          Run OWASP ZAP scan"
    echo "  --lighthouse   Run Lighthouse CI"
    echo "  --npm-audit    Run npm audit"
    echo "  --report       Generate security report"
    echo ""
    echo "Example:"
    echo "  $0 --all"
    echo "  $0 --headers --ssl"
    exit 1
  fi

  RUN_HEADERS=false
  RUN_SSL=false
  RUN_ZAP=false
  RUN_LIGHTHOUSE=false
  RUN_NPM_AUDIT=false
  RUN_REPORT=false

  for arg in "$@"; do
    case $arg in
      --all)
        RUN_HEADERS=true
        RUN_SSL=true
        RUN_ZAP=true
        RUN_LIGHTHOUSE=true
        RUN_NPM_AUDIT=true
        RUN_REPORT=true
        ;;
      --headers)
        RUN_HEADERS=true
        ;;
      --ssl)
        RUN_SSL=true
        ;;
      --zap)
        RUN_ZAP=true
        ;;
      --lighthouse)
        RUN_LIGHTHOUSE=true
        ;;
      --npm-audit)
        RUN_NPM_AUDIT=true
        ;;
      --report)
        RUN_REPORT=true
        ;;
      *)
        print_error "Unknown option: $arg"
        exit 1
        ;;
    esac
  done

  # チェック実行
  if [ "$RUN_HEADERS" = true ]; then
    check_security_headers
  fi

  if [ "$RUN_SSL" = true ]; then
    check_ssl
  fi

  if [ "$RUN_ZAP" = true ]; then
    run_zap_scan
  fi

  if [ "$RUN_LIGHTHOUSE" = true ]; then
    run_lighthouse
  fi

  if [ "$RUN_NPM_AUDIT" = true ]; then
    run_npm_audit
  fi

  if [ "$RUN_REPORT" = true ]; then
    generate_report
  fi

  print_header "Security Check Completed"
  echo "Reports saved to: $REPORT_DIR"
  echo ""
  echo "Next steps:"
  echo "1. Review reports in $REPORT_DIR"
  echo "2. Address High priority issues immediately"
  echo "3. Plan Medium priority fixes for next sprint"
  echo "4. Schedule next security check"
}

main "$@"
