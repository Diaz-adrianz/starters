#!/bin/sh
set -e

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
  aws --endpoint-url "$ENDPOINT" s3api create-bucket --bucket "${bucket}" \
    || echo "  (bucket may already exist, continuing)"
done

echo "Bucket creation complete."