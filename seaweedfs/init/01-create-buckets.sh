#!/bin/sh
set -e

GREEN='\033[0;32m'
NC='\033[0m'
echo -e "\n${GREEN}Create Buckets${NC}"

if [[ -z "${S3_ENDPOINT}" || \
      -z "${S3_BUCKETS}" || \
      -z "${AWS_ACCESS_KEY_ID}" || \
      -z "${AWS_SECRET_ACCESS_KEY}" ]]; then
    echo "Skipping create buckets setup."
    echo "Error: some environment variables are not set."
    exit 1
fi

ENDPOINT="${S3_ENDPOINT}"
BUCKETS="${S3_BUCKETS}"

export AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}"
export AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}"
export AWS_DEFAULT_REGION="us-east-1"

echo "Waiting for SeaweedFS S3 gateway..."
until aws --endpoint-url "$ENDPOINT" s3 ls > /dev/null 2>&1; do
  sleep 2
done

IFS=','
for bucket in $BUCKETS; do
  echo "→ Creating bucket: ${bucket}"
  
  if aws --endpoint-url "$ENDPOINT" s3api create-bucket --bucket "${bucket}"; then
    echo "✓ Bucket '${bucket}' created"
  else
    echo "  (bucket ${bucket} may already exist, continuing)"
  fi
done
