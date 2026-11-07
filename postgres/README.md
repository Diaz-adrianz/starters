# Postgres

Official `postgres:18` via Docker Compose.

## Structure

```
postgres/
 ┣ scripts/
 ┃ ┣ backup.sh
 ┃ ┗ sync.sh
 ┣ .env
 ┣ .gitignore
 ┣ databases.json
 ┗ README.md
```

| File                | Purpose                                                      |
| ------------------- | ------------------------------------------------------------ |
| `.env`              | Superuser creds. Loaded by compose `env_file`. Gitignored.   |
| `databases.json`    | App DBs, users, schemas. Gitignored.                         |
| `scripts/sync.sh`   | Applies `databases.json` to the running Postgres. On demand. |
| `scripts/backup.sh` | `pg_dumpall` to gzip, with rotation.                         |

## First deploy

```sh
chmod +x postgres/scripts/*.sh
docker compose up -d postgres
./postgres/scripts/sync.sh
```

## .env

```env
POSTGRES_USER=root
POSTGRES_PASSWORD=<strong password>
POSTGRES_DB=postgres
```

## databases.json

```json
[
	{
		"db_name": "appdb",
		"db_user": "appuser",
		"db_password": "<password>",
		"schemas": [{ "name": "auth" }, { "name": "audit" }]
	}
]
```

- One entry creates one role, one database owned by that role, and its schemas.
- `schemas` optional.

## Sync

Run after creating or editing `databases.json`:

```sh
./postgres/scripts/sync.sh
```

- Postgres must be running.
- Idempotent. Safe to re-run.
- Creates missing roles, DBs, schemas.

## Backup

`scripts/backup.sh` dumps all DBs and roles to `<BACKUP_DIR>/pg_<date>_<HHMM>.sql.gz`, keeps the newest `KEEP`, deletes older ones.

- Postgres must be running.
- Files are owner-readable only (`umask 077`).
- Partial files are removed on failure.
- No positional args. Env vars only:

| Var          | Default                 | Meaning              |
| ------------ | ----------------------- | -------------------- |
| `BACKUP_DIR` | `/opt/backups/postgres` | Output dir           |
| `KEEP`       | `4`                     | Dumps retained       |
| `SERVICE`    | `postgres`              | Compose service name |

Cron, weekly Sunday 03:00. Replace `/opt/app` with the real path:

```sh
(crontab -l 2>/dev/null; echo '0 3 * * 0 /opt/app/postgres/scripts/backup.sh >> /var/log/pg-backup.log 2>&1') | crontab -
```

## Restore

Use a fresh or empty volume. Existing roles cause errors.

```sh
gunzip -c /opt/backups/postgres/<file>.sql.gz | \
  docker compose exec -T postgres psql -U root -d postgres
```

