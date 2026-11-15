# PostgreSQL

PostgreSQL provides relational database storage for backend applications.

Each backend application should have its own database and login role:

- One application = one database.
- One application = one database user.
- The application user owns its database and schemas.
- Application users can run migrations without superuser privileges.

## Directory Structure

```text
postgres/
 ┣ backups/
 ┣ scripts/
 ┃ ┣ create-database.sh
 ┃ ┣ create-user.sh
 ┃ ┣ create-schemas.sh
 ┃ ┗ backup-database.sh
 ┣ .env
 ┗ README.md
```

## Configuration

### 1. PostgreSQL .env

Create `postgres/.env`:

```
POSTGRES_USER=root
POSTGRES_PASSWORD=root
POSTGRES_DB=postgres
```

### 2. Start PostgreSQL

From the project root:

```bash
docker compose up -d postgres
```

Check the service:

```bash
docker compose ps postgres
```

View logs:

```bash
docker compose logs -f postgres
```

## Scripts

All scripts use the existing PostgreSQL Docker container. Run scripts from the project root or use their relative paths.

### 1. Create Database

Creates a database if it does not already exist.

```bash
./postgres/scripts/create-database.sh <database>
```

Example:

```bash
./postgres/scripts/create-database.sh nestjs
```

### 2. Create Application User

Creates a PostgreSQL login role and assigns ownership of the specified database.

```bash
./postgres/scripts/create-user.sh <username> <database>
```

Example:

```bash
./postgres/scripts/create-user.sh nestjs_user nestjs
```

Permissions:

- Login to PostgreSQL.
- Connect to the assigned database.
- Own the assigned database.
- Create and manage database objects.
- Run application migrations without superuser privileges.
  Each application should have its own database user.

### 3. Create Schemas

Creates one or more schemas inside a database.

```bash
./postgres/scripts/create-schemas.sh <database> <schema...>
```

Example:

```bash
./postgres/scripts/create-schemas.sh nestjs identity notification
```

Schemas are owned by the database owner (the application user). The script supports multiple schema names in one execution.

### 4. Backup Database

Creates PostgreSQL custom-format backups (pg_dump -Fc).

```bash
./postgres/scripts/backup-database.sh <database> [database...]
```

Single database:

```bash
./postgres/scripts/backup-database.sh nestjs
```

Multiple databases:

```bash
./postgres/scripts/backup-database.sh nestjs admin notification
```

Backups are stored in: `postgres/backups/`

Filename format: `YYYYMMDD*HHMMSS*<database>.dump`

Example:

```text
postgres/
┣ backups/
┃ ┣ 20261115_020000_nestjs.dump
┃ ┣ 20261115_020000_admin.dump
┃ ┗ 20261115_020000_notification.dump
```

The script:

- Creates the backup directory automatically.
- Processes multiple databases independently.
- Removes incomplete backup files when a backup fails.
- Returns a non-zero exit code if any database backup fails.
- Does not automatically delete old backups.

#### Schedule with OS Cron

Example: back up multiple databases every day at 2 AM.
Open the crontab:

```bash
crontab -e
```

Add:

```bash
0 2 \* \* \* /bin/bash /absolute/path/to/project/postgres/scripts/backup-database.sh nestjs admin notification >> /absolute/path/to/project/postgres/backups/cron.log 2>&1
```

Replace `/absolute/path/to/project` with your actual project directory.

Ensure the cron environment can find Docker. If necessary, define the PATH at the top of your crontab:

```bash
PATH=/usr/local/bin:/usr/bin:/bin
```

#### Restore Backup

Use pg_restore to restore a custom-format backup.

Example:

```bash
docker compose exec -T postgres \
 pg_restore -U root -d nestjs --clean --if-exists \
 < postgres/backups/20261115_020000_nestjs.dump
```

The target database must already exist.

Warning: --clean drops existing objects before restoring them. Use it carefully.

## Setup Example

For a backend application named nestjs:

# 1. Start PostgreSQL

```
docker compose up -d postgres
```

# 2. Create application database

```
./postgres/scripts/create-database.sh nestjs
```

# 3. Create application user

```
./postgres/scripts/create-user.sh nestjs_user nestjs
```

# 4. Create application schemas

```
./postgres/scripts/create-schemas.sh nestjs identity notification
```

# 5. Back up the database

```
./postgres/scripts/backup-database.sh nestjs
```

Important Notes

- Never use the PostgreSQL administrative role for backend application connections.
- Use a separate database and login role for each application.
- Application users should not have superuser privileges.
- Database and schema ownership allows applications to manage their own migrations.
- Keep .env and backup files out of version control.
- Database backups may contain sensitive information. Restrict access to postgres/backups/ and consider storing copies off-site.
- Backups are not a substitute for a tested recovery process.

One detail to keep in mind: the backup script uses the PostgreSQL container's `POSTGRES_USER` for `pg_dump`, so the administrative role must have permission to read the databases being backed up.

