# SeaweedFS

SeaweedFS provides distributed file storage with an S3-compatible API.

## Directory Structure

```text
seaweedfs/
 ┣ scripts/
 ┃ ┣ create-bucket.sh
 ┃ ┣ put-lifecycle-tmp.sh
 ┃ ┗ put-policy-public.sh
 ┣ README.md
 ┗ s3-config.json
.env
docker-compose.yml
```

## Default Ports

| Service | Default Port | Description                 |
| ------- | ------------ | --------------------------- |
| Master  | `9333`       | Cluster management          |
| Volume  | `8080`       | File storage                |
| Filer   | `8888`       | File system interface       |
| S3      | `8333`       | S3-compatible API           |
| Admin   | `23646`      | SeaweedFS administration UI |

The S3 and Admin services are exposed on `127.0.0.1` by default.

## Configuration

### 1. Root `.env`

Add the following variables to the project's root `.env` file:

```
SEAWEEDFS_ADMIN_USER=admin
SEAWEEDFS_ADMIN_PASSWORD=change-this-password
SEAWEEDFS_S3_ADMIN_ACCESS_KEY=admin-ak
SEAWEEDFS_S3_ADMIN_SECRET_KEY=replace-with-a-strong-secret
```

These credentials are used by the SeaweedFS Admin service.

### 2. S3 Configuration

Create `seaweedfs/s3-config.json`.

This file defines S3 identities, their access keys, and their permissions.

Example:

```
{
  "identities": [
    {
      "name": "admin",
      "credentials": [
        {
          "accessKey": "admin-ak",
          "secretKey": "replace-with-a-strong-secret"
        }
      ],
      "actions": ["Admin"]
    },
    {
      "name": "app",
      "credentials": [
        {
          "accessKey": "app-ak",
          "secretKey": "replace-with-a-strong-secret"
        }
      ],
      "actions": [
        "Read:app-dev",
        "Write:app-dev",
        "List:app-dev",
        "Tagging:app-dev"
      ]
    }
  ]
}
```

Keep `s3-config.json` out of version control because it contains credentials.

**Important:** The admin identity's accessKey and secretKey are required and must exactly match SEAWEEDFS_S3_ADMIN_ACCESS_KEY and SEAWEEDFS_S3_ADMIN_SECRET_KEY in the root `.env` file. These credentials are used by the setup scripts to perform administrative S3 operations.

## Scripts

All scripts use a temporary AWS CLI Docker container. Run scripts from the project root or use their relative paths.

### 1. Create Bucket

Creates a bucket if it does not already exist.

```
./seaweedfs/scripts/create-bucket.sh \
  <bucket> \
  <access-key> \
  <secret-key>
```

### 2. Configure Temporary Object Lifecycle

Configures automatic expiration for objects under the `temp/` prefix.

```
./seaweedfs/scripts/put-lifecycle-temp.sh \
  <bucket> \
  <access-key> \
  <secret-key> \
  [days]
```

The `days` argument is optional and defaults to `1`.

### 3. Configure Public Read Policy

Allows unauthenticated users to read objects under the `public/` prefix.

```
./seaweedfs/scripts/put-policy-public.sh \
  <bucket> \
  <access-key> \
  <secret-key>
```

Objects under `public/` can then be accessed through the S3 endpoint:

```
http://localhost:8333/<bucket>/public/<object-key>
```

## Setup

1. Add the Admin credentials to the root `.env`.
2. Create `seaweedfs/s3-config.json` with your S3 identities.
3. Start SeaweedFS:
   ```
   docker compose up -d
   ```
4. Create your application bucket:
   ```
   ./seaweedfs/scripts/create-bucket.sh \
     nestjs-dev admin-ak your-admin-secret
   ```
5. Configure temporary object expiration:
   ```
   ./seaweedfs/scripts/put-lifecycle-tmp.sh \
     nestjs-dev admin-ak your-admin-secret
   ```
6. Configure public read access:
   ```
   ./seaweedfs/scripts/put-policy-public.sh \
     nestjs-dev admin-ak your-admin-secret
   ```

