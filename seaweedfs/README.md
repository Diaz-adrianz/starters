# SeaweedFS (S3 + Admin)

Self-hosted S3-compatible storage. One app = one bucket = one access key + secret.
Each bucket exposes `public/*` anonymously. Everything else stays private.

## Layout

```
seaweedfs/
├─ scripts/
│  └─ sync.sh        # idempotent init: buckets, accounts, public rule, CORS, verify
├─ .env              # global settings (git-ignored)
├─ apps.conf         # one line per app (git-ignored)
├─ .gitignore
└─ README.md
docker-compose.yml   # repo root, defines seaweedfs-* services
```

## Services

| Service            | Purpose                                            | Port (host)       |
| ------------------ | -------------------------------------------------- | ----------------- |
| `seaweedfs-master` | Cluster coordination                               | internal          |
| `seaweedfs-volume` | Stores data                                        | internal          |
| `seaweedfs-filer`  | File metadata                                      | internal          |
| `seaweedfs-s3`     | S3 API                                             | `127.0.0.1:8333`  |
| `seaweedfs-admin`  | Web UI                                             | `127.0.0.1:23646` |
| `awscli`           | One-shot tool (profile `tools`), used by `sync.sh` |                   |

## Prerequisites

## 1. Configure `.env`

`.env`:

```bash
SEAWEEDFS_ADMIN_USER=admin
SEAWEEDFS_ADMIN_PASSWORD=change-me
```

`seaweedfs/.env`:

```bash
S3_ENDPOINT_PUBLIC=http://localhost:8333
```

## 2. Configure `apps.conf`

Format, one app per line:

```
name|bucket|access_key|secret_key|cors_origin
```

Example:

```
# name|bucket|access_key|secret_key|cors_origin
shop|shop-bucket|shopAK|generate-another-long-secret-here|https://shop.example.com,https://admin.shop.example.com
```

Rules:

- `name` is the identity key. Keep it stable. It maps to user `app-<name>`.
- `bucket`: lowercase, digits, hyphens. 3 to 63 chars.
- `secret_key`: at least 16 chars. Generate one: `openssl rand -base64 32 | tr -d '=+/'`
- `cors_origin`: comma-separated for multiple origins. No path, no trailing slash.
- Never use `|` inside values.
- Names and buckets must be unique.

## 3. Run

From repo root:

```bash
chmod +x seaweedfs/scripts/sync.sh
./seaweedfs/scripts/sync.sh
```

If `apps.conf` is not found, point to it:

The script:

1. Starts the stack.
2. Waits for the cluster.
3. Creates each bucket.
4. Creates or recreates user `app-<name>` scoped to its bucket.
5. Sets anonymous read on `<bucket>/public/*`.
6. Applies CORS.
7. Verifies behavior, prints env block per app.

Expected verification output:

```
public  anon GET -> 200  (want 200)
private anon GET -> 403  (want 403)
cross-bucket     -> denied (want denied)   # "skip" when only one app
```

Non-zero exit means a check failed.

## 4. Use in your app

Copy the printed block into the app's `.env`:

```bash
S3_ENDPOINT=http://localhost:8333
S3_REGION=us-east-1
S3_BUCKET=bucket-dev
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
PUBLIC_BASE_URL=http://localhost:8333
```

Notes:

- Path-style addressing is required: `forcePathStyle: true`.
- Public URL format: `${PUBLIC_BASE_URL}/${bucket}/public/...`
- `S3_ENDPOINT` must be reachable from the browser. Presigned POST URLs embed it.

## Day-to-day

**Add an app.** Add a line to `apps.conf`. Re-run `sync.sh`.

**Rotate credentials.** Change keys in `apps.conf`. Re-run. Old credentials stop working. Update the app's `.env`.

**Change CORS.** Edit `cors_origin`. Re-run. Config is replaced, not merged.

**Remove an app.** Deleting the line only drops its public rule. Bucket and user remain. Delete manually:

```bash
docker compose --env-file ./seaweedfs/.env exec -T seaweedfs-master weed shell \
  -master=seaweedfs-master:9333 -filer=seaweedfs-filer:8888 <<<"s3.configure -user=app-shop -delete -apply"
```

**Rename.** Changing `name` creates a new user. The old one keeps working. Delete it manually. Changing `bucket` creates a new bucket. Old data is not moved.

**Admin UI.** http://localhost:23646 with `SEAWEEDFS_ADMIN_USER` / `SEAWEEDFS_ADMIN_PASSWORD`.

