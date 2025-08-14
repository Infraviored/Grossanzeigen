#!/usr/bin/env bash
set -euo pipefail
npm run build -w services/payments && npm run start -w services/payments

