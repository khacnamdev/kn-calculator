# Capability Contract: API Design (api-design.md)

This capability contract defines the requirements and engineering standards the AI agent must apply when designing, modifying, or auditing RESTful or GraphQL APIs in this workspace.

---

## 1. Purpose

To ensure all external and internal API contracts are secure, consistent, backward-compatible, well-documented, and aligned with standard idempotency patterns.

---

## 2. When to Use

You must trigger this capability contract whenever you are asked to:
*   Create new HTTP routes, endpoints, queries, or mutations.
*   Modify request parameters, payloads, response schemas, or header requirements.
*   Update openapi specifications under `docs/openapi/`.
*   Establish communication protocols between different services or microservices.

---

## 3. Strict Semantics & Best Practices

All API designs must enforce the following rules:

### A. HTTP Status Code Semantics (REST):
*   `200 OK`: Successful resource retrieval or synchronous update.
*   `201 Created`: Successful creation of a resource. Must include a `Location` header pointing to the new resource.
*   `202 Accepted`: Request received and accepted for processing (async background task).
*   `204 No Content`: Successful request where no payload is returned (e.g., DELETE).
*   `400 Bad Request`: Input validation failed (must return detailed field validation error payloads).
*   `401 Unauthorized`: Authentication failed or credentials missing.
*   `403 Forbidden`: Authenticated, but user lacks permissions to access the resource.
*   `404 Not Found`: Resource or route does not exist.
*   `409 Conflict`: Business rule state conflict (e.g., unique email already exists).
*   `429 Too Many Requests`: Rate limit exceeded.
*   `500 Internal Server Error`: Generic unhandled system failure. Avoid returning descriptive stack traces to clients.

### B. Idempotency Guarantees:
*   `GET`, `PUT`, `DELETE`, `HEAD`, and `OPTIONS` must be strictly idempotent. Repeated execution must yield the same side effects and resources.
*   `POST` requests designed to mutate state (e.g., payments, order submissions) must support idempotency keys (e.g., via an `Idempotency-Key` header) to prevent duplicate transactions on network retries.

### C. Backward Compatibility:
*   Never remove or rename properties in a response payload on an active version.
*   Never make optional request parameters mandatory.
*   If breaking changes are unavoidable, you must increment the API version route (e.g., `/api/v1/...` to `/api/v2/...`).

---

## 4. Expected Output Structure

Every API contract proposal must output a markdown block including:

1.  **Endpoint Summary**: HTTP Method, URL path, and authentication scope.
2.  **Request Payload**: Fully formed JSON or GraphQL query/mutation, showing all fields, their types, and validation constraints (e.g., `maxLength`, `pattern`).
3.  **Response Payloads**: Mock responses for success cases (`200`/`201`) and common error cases (`400`/`401`/`403`/`409`).
4.  **OpenAPI 3.0 Diff**: A YAML patch showing how to update `docs/openapi/contract-template.yaml` (or active contract file) to reflect the changes.

---

## 5. API Design Quality Checklist

- [ ] **Validation Schema**: Have you mapped a matching Zod/JSON Schema for input parameter validation?
- [ ] **Rate Limiting**: Is rate limiting defined for this route?
- [ ] **Audit Trail**: Does this API request write an audit trail for sensitive administrative mutations?
- [ ] **Mock Verification**: Have the endpoints been simulated with mock data to check for performance or nested payload depth issues?
