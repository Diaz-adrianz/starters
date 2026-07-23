#!/bin/sh
set -e

ENDPOINT="http://seaweedfs-s3:${SEAWEEDFS_S3_PORT}"
BUCKETS="${SEAWEEDFS_BUCKETS}"

export AWS_ACCESS_KEY_ID="${SEAWEEDFS_ADMIN_USER}"
export AWS_SECRET_ACCESS_KEY="${SEAWEEDFS_ADMIN_PASSWORD}"
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