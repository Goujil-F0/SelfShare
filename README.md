# SelfShare

SelfShare is a secure ephemeral vault for sharing sensitive text or files through one-time links. Data is encrypted in the browser before it reaches the server, and each secret can be destroyed after the first read or after its expiration time.

## Highlights

- Client-side AES-GCM encryption with the Web Crypto API.
- One-time reveal endpoint: a secret is deleted immediately after access.
- Expiration cleanup task for unread secrets.
- Optional file sharing up to 10 MB.
- QR code generation for mobile access.
- Admin dashboard with active secret count, audit logs, and emergency purge.
- OpenAPI/Swagger UI available during development.

## Tech Stack

- Java 17
- Spring Boot 3.4
- Spring Web, Spring Security, Spring Data JPA
- MySQL for local/prod persistence
- H2 for automated tests
- Vanilla HTML, CSS, and JavaScript
- Web Crypto API for browser encryption

## Security Model

SelfShare follows a zero-knowledge style flow:

1. The browser generates a random AES-GCM key.
2. The secret is encrypted locally.
3. The backend stores only encrypted bytes and the IV.
4. The encryption key is placed in the URL fragment after `#`.
5. URL fragments are not sent to the server by browsers.
6. When the recipient reveals the secret, the backend returns the encrypted payload and deletes it.

Important: the share link contains the decryption key. It must be sent through a trusted channel.

## Configuration

The application reads sensitive values from environment variables. Defaults are safe for local development but should be changed before sharing or deployment.

| Variable | Description | Default |
| --- | --- | --- |
| `SELFSHARE_DB_URL` | JDBC URL for MySQL | `jdbc:mysql://localhost:3306/selfshare_db?...` |
| `SELFSHARE_DB_USERNAME` | Database username | `root` |
| `SELFSHARE_DB_PASSWORD` | Database password | empty |
| `SELFSHARE_MAIL_HOST` | SMTP host | `localhost` |
| `SELFSHARE_MAIL_PORT` | SMTP port | `1025` |
| `SELFSHARE_MAIL_USERNAME` | SMTP username | empty |
| `SELFSHARE_MAIL_PASSWORD` | SMTP password | empty |
| `SELFSHARE_ADMIN_USERNAME` | Admin username | `admin` |
| `SELFSHARE_ADMIN_PASSWORD` | Admin password | `change-me` |

An example Spring configuration is available in [application-example.properties](application-example.properties).

## Run Locally

Prerequisites:

- JDK 17 or newer
- Maven 3.9 or the included Maven wrapper
- MySQL running locally

Create the database:

```sql
CREATE DATABASE IF NOT EXISTS selfshare_db;
```

Start the application:

```bash
mvn spring-boot:run
```

Then open:

- App: `http://localhost:8081`
- Admin: `http://localhost:8081/admin/admin.html`
- Swagger UI: `http://localhost:8081/swagger-ui.html`

## Test

```bash
mvn test
```

Tests use an in-memory H2 database through `src/test/resources/application.properties`, so MySQL is not required for the test suite.

## API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/secrets` | Store an encrypted secret |
| `POST` | `/api/secrets/{id}/reveal` | Reveal and delete a secret |
| `GET` | `/api/secrets/qr?link=...` | Generate a QR code |
| `GET` | `/api/admin/stats/count` | Count active secrets |
| `GET` | `/api/admin/logs` | Read audit logs |
| `DELETE` | `/api/admin/purge-all` | Delete all stored secrets |

## Project Structure

```text
src/main/java/com/selfshare
  config/        Spring Security configuration
  controller/    REST controllers
  entity/        JPA entities
  repository/    Spring Data repositories
  service/       Secret, cleanup, file, and mail services

src/main/resources/static
  index.html     Entry screen
  vault.html     Secret creation UI
  view.html      Secret reveal UI
  admin/         Admin dashboard
  js/            Frontend API and crypto logic
  css/           UI styles
```

## Notes

- Do not commit real database, SMTP, or admin credentials.
- Change the default admin password before any public demo.
- For production, enable HTTPS and review CSRF/CORS settings.
- The current UI is static and intentionally dependency-light.
