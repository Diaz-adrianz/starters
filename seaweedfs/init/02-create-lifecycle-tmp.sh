#!/bin/sh
set -e

GREEN='\033[0;32m'
NC='\033[0m'
echo -e "\n${GREEN}Create Lifecycle for 'tmp/' Prefix${NC}"

if [[ -z "${S3_ENDPOINT}" || \
      -z "${S3_BUCKETS}" || \
      -z "${S3_TMP_EXPIRES}" || \
      -z "${AWS_ACCESS_KEY_ID}" || \
      -z "${AWS_SECRET_ACCESS_KEY}" ]]; then
    echo "Skipping create lifecycle setup."
    echo "Error: some environment variables are not set."
    exit 1
fi

ENDPOINT="${S3_ENDPOINT}"
BUCKETS="${S3_BUCKETS}"
TEMP_EXPIRES_DAYS=$(( ${S3_TMP_EXPIRES:-86400} / 86400 ))
[ "$TEMP_EXPIRES_DAYS" -lt 1 ] && TEMP_EXPIRES_DAYS=1

export AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}"
export AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}"
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

  if aws --endpoint-url "$ENDPOINT" s3api put-bucket-lifecycle-configuration \
    --bucket "${bucket}" \
    --lifecycle-configuration file:///tmp/lifecycle-${bucket}.json; then
    echo "✓ Lifecycle set for '${bucket}'"
  else
    echo "  (failed to apply lifecycle on ${bucket})"
  fi
done

