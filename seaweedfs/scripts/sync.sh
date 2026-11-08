#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; . ../.env; set +a

APPS_FILE="${APPS_FILE:-../apps.conf}"
S3_URL="${S3_ENDPOINT_PUBLIC:-http://localhost:8333}"
[ -f "$APPS_FILE" ] || { echo "missing $APPS_FILE"; exit 1; }

wshell() {
  docker compose exec -T seaweedfs-master \
    weed shell -master=seaweedfs-master:9333 -filer=seaweedfs-filer:8888 <<<"$1"
}

# usage: awscli ACCESS SECRET args...
awscli() {
  local ak="$1" sk="$2"; shift 2
  docker compose run --rm -T \
    -e AWS_ACCESS_KEY_ID="$ak" -e AWS_SECRET_ACCESS_KEY="$sk" \
    awscli --endpoint-url http://seaweedfs-s3:8333 "$@"
}

# ---------- parse ----------
NAMES=(); BUCKETS=(); AKS=(); SKS=(); ORIGINS=()
while IFS='|' read -r name bucket ak sk origin || [ -n "${name:-}" ]; do
  [[ -z "${name// }" || "$name" =~ ^[[:space:]]*# ]] && continue
  [[ "$bucket" =~ ^[a-z0-9][a-z0-9-]{2,62}$ ]] || { echo "bad bucket: $bucket"; exit 1; }
  [ "${#sk}" -ge 16 ] || { echo "secret too short: $name"; exit 1; }
  NAMES+=("$name"); BUCKETS+=("$bucket"); AKS+=("$ak"); SKS+=("$sk"); ORIGINS+=("$origin")
done < "$APPS_FILE"

[ "${#NAMES[@]}" -gt 0 ] || { echo "no apps in $APPS_FILE"; exit 1; }
echo ">> ${#NAMES[@]} app(s): ${NAMES[*]}"

# ---------- start ----------
echo ">> start stack"
docker compose up awscli -d

echo ">> wait for cluster"
for i in $(seq 1 60); do
  wshell "s3.bucket.list" >/dev/null 2>&1 && break
  [ "$i" -eq 60 ] && { echo "cluster timeout"; exit 1; }
  sleep 2
done

# ---------- per app: bucket + account ----------
ANON_ACTIONS=()
for i in "${!NAMES[@]}"; do
  n="${NAMES[$i]}"; b="${BUCKETS[$i]}"; ak="${AKS[$i]}"; sk="${SKS[$i]}"

  echo ">> [$n] bucket $b"
  wshell "s3.bucket.create -name ${b}" >/dev/null 2>&1 || true

  echo ">> [$n] service account"
  wshell "s3.configure -user=app-${n} -delete -apply" >/dev/null 2>&1 || true
  wshell "s3.configure -user=app-${n} \
    -access_key=${ak} -secret_key=${sk} \
    -buckets=${b} -actions=Read,Write,List,Tagging -apply" >/dev/null

  ANON_ACTIONS+=("Read:${b}/public/*")
done

# ---------- anonymous public rules (one apply, all buckets) ----------
echo ">> public prefix rules"
actions=$(IFS=,; echo "${ANON_ACTIONS[*]}")
wshell "s3.configure -user=anonymous -delete -apply" >/dev/null 2>&1 || true
wshell "s3.configure -user=anonymous -actions=${actions} -apply" >/dev/null

# ---------- cors + verify per app ----------
FAIL=0
for i in "${!NAMES[@]}"; do
  n="${NAMES[$i]}"; b="${BUCKETS[$i]}"; ak="${AKS[$i]}"; sk="${SKS[$i]}"; o="${ORIGINS[$i]}"

  echo ">> [$n] cors"
  origins_json=$(printf '%s' "$o" | awk -v RS=, '
    { gsub(/^[ \t\r\n]+|[ \t\r\n]+$/, "");
      if ($0 != "") { printf "%s\"%s\"", (n++ ? "," : ""), $0 } }')

  awscli "$ak" "$sk" s3api put-bucket-cors --bucket "$b" --cors-configuration "{
    \"CORSRules\": [{
      \"AllowedOrigins\": [${origins_json}],
      \"AllowedMethods\": [\"GET\",\"POST\",\"PUT\",\"HEAD\"],
      \"AllowedHeaders\": [\"*\"],
      \"ExposeHeaders\": [\"ETag\"],
      \"MaxAgeSeconds\": 3000
    }]
  }" >/dev/null 2>&1 || echo "   cors unsupported. Set at reverse proxy."

  echo ">> [$n] verify"
  echo pub  | awscli "$ak" "$sk" s3 cp - "s3://${b}/public/_probe.txt"  >/dev/null
  echo priv | awscli "$ak" "$sk" s3 cp - "s3://${b}/private/_probe.txt" >/dev/null

  pub=$(curl -s -o /dev/null -w '%{http_code}' "${S3_URL}/${b}/public/_probe.txt")
  priv=$(curl -s -o /dev/null -w '%{http_code}' "${S3_URL}/${b}/private/_probe.txt")

  awscli "$ak" "$sk" s3 rm "s3://${b}/public/_probe.txt"  >/dev/null
  awscli "$ak" "$sk" s3 rm "s3://${b}/private/_probe.txt" >/dev/null

  # isolation: this app's creds must fail on next app's bucket
  iso="skip"
  if [ "${#NAMES[@]}" -gt 1 ]; then
    other="${BUCKETS[$(( (i + 1) % ${#NAMES[@]} ))]}"
    if echo x | awscli "$ak" "$sk" s3 cp - "s3://${other}/_iso.txt" >/dev/null 2>&1; then
      iso="LEAK"
    else
      iso="denied"
    fi
  fi

  echo "   public  anon GET -> ${pub}  (want 200)"
  echo "   private anon GET -> ${priv} (want 403)"
  echo "   cross-bucket     -> ${iso} (want denied)"

  if [ "$pub" != "200" ] || [ "$priv" != "403" ] || [ "$iso" = "LEAK" ]; then
    echo "   FAILED: $n"; FAIL=1
  fi
done

[ "$FAIL" -eq 0 ] || { echo "VERIFY FAILED"; exit 1; }

# ---------- summary ----------
echo
echo ">> done"
echo "S3     ${S3_URL}"
echo "Admin  http://localhost:23646"
echo
for i in "${!NAMES[@]}"; do
  echo "# ${NAMES[$i]}"
  echo "S3_ENDPOINT=${S3_URL}"
  echo "S3_BUCKET=${BUCKETS[$i]}"
  echo "S3_ACCESS_KEY=${AKS[$i]}"
  echo "S3_SECRET_KEY=${SKS[$i]}"
  echo "PUBLIC_BASE_URL=${S3_URL}"
  echo
done