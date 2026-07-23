#!/bin/sh
set -e

ENDPOINT="http://seaweedfs-s3:${SEAWEEDFS_S3_PORT}"
BUCKETS="${SEAWEEDFS_BUCKETS}"
TEMP_EXPIRES_DAYS=$(( ${SEAWEEDFS_TMP_EXPIRES:-86400} / 86400 ))
[ "$TEMP_EXPIRES_DAYS" -lt 1 ] && TEMP_EXPIRES_DAYS=1

export AWS_ACCESS_KEY_ID="${SEAWEEDFS_ADMIN_USER}"
export AWS_SECRET_ACCESS_KEY="${SEAWEEDFS_ADMIN_PASSWORD}"
export AWS_DEFAULT_REGION="us-east-1"

IFS=','
for bucket in $BUCKETS; do
  echo "→ Setting tmp/ lifecycle rule (${TEMP_EXPIRES_DAYS}d) on ${bucket}"

  cat > /tmp/lifecycle-${bucket}.json <<EOF
{
  "Rules": [
    {
      "ID": "expire-tmp-objects",
      "Filter": { "Prefix": "tmp/" },
      "Status": "Enabled",
      "Expiration": { "Days": ${TEMP_EXPIRES_DAYS} }
    }
  ]
}
EOF

  aws --endpoint-url "$ENDPOINT" s3api put-bucket-lifecycle-configuration \
    --bucket "${bucket}" \
    --lifecycle-configuration file:///tmp/lifecycle-${bucket}.json

  echo "✓ Lifecycle set for '${bucket}'"
done

echo "Lifecycle configuration complete."