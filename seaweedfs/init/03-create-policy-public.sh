#!/bin/sh
set -e

GREEN='\033[0;32m'
NC='\033[0m'
echo -e "\n${GREEN}Create Policy for 'public/' Prefix${NC}" 

if [[ -z "${S3_ENDPOINT}" || \
      -z "${S3_BUCKETS}" || \
      -z "${AWS_ACCESS_KEY_ID}" || \
      -z "${AWS_SECRET_ACCESS_KEY}" ]]; then
    echo "Skipping create lifecycle setup."
    echo "Error: some environment variables are not set."
    exit 1
fi

ENDPOINT="${S3_ENDPOINT}"
BUCKETS="${S3_BUCKETS}"

export AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}"
export AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}"
export AWS_DEFAULT_REGION="us-east-1"

IFS=','
for bucket in $BUCKETS; do
  echo "→ Applying public-read policy on public/* for: ${bucket}"
  POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadPublicPrefix",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${bucket}/public/*"
    }
  ]
}
EOF
)
  if aws --endpoint-url "$ENDPOINT" s3api put-bucket-policy \
    --bucket "${bucket}" \
    --policy "${POLICY}"; then
    echo "✓ Policy set for '${bucket}'"
  else
    echo "  (failed to apply policy on ${bucket})"
  fi
done


