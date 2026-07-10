# Coding Standards & Guidelines (coding.md)

This document establishes the strict coding standards, naming conventions, error-handling policies, type-safety parameters, and modular design guidelines for all software development in this workspace.

---

## 1. Naming Conventions

Consistency in naming reduces cognitive load. Adhere to the following conventions:

*   **Variables / Constants**: Use camelCase for variables (`activeUserCount`) and SCREAMING_SNAKE_CASE for constants (`MAX_RETRY_LIMIT`).
*   **Classes / Types / Interfaces**: Use PascalCase for classes (`UserRepository`) and interfaces (`IPaymentProvider`). Prefix interfaces with `I` only if the language pattern dictates it (e.g., standard TypeScript interfaces are often not prefixed, but C# interfaces must be).
*   **Functions / Methods**: Use camelCase for functions (`calculateSubtotal`). Choose verbs that clearly describe the side-effect or return value.
*   **Files / Folders**: Use kebab-case for files (`user-controller.ts`) and folders (`payment-gateway`). Match the filename to the exported symbol where applicable.

---

## 2. Comprehensive Error Handling (Anti-Silent-Catch)

We do not allow silent failure. Every exception must be captured, enriched with context, and either safely handled or propagated up the call stack.

### Guidelines:
1.  **Never Use Silent Catch Blocks**:
    *   *Bad*: `try { ... } catch (e) {}`
    *   *Good*: `try { ... } catch (error) { logger.error("Failed to fetch user profiles", { error, userId }); throw new ProfileFetchException("Database connection timeout", error); }`
2.  **Use Custom Typed Exceptions**:
    *   Create domain-specific error classes containing error codes, HTTP status mappings, and timestamp payloads.
3.  **Clean up Resources**:
    *   Always release connections, close file descriptors, and clear intervals in `finally` blocks or using modern context managers (e.g., `using` statements, `with` statements).
4.  **Avoid Raw Error Throwing**:
    *   Wrap generic library/runtime errors in custom domain exceptions before crossing architectural boundaries (e.g., wrap database driver errors before returning from repositories to services).

---

## 3. Rigorous Type Safety

We enforce strict type-safety boundaries to eliminate runtime exceptions and facilitate safe automated refactoring.

### Guidelines:
*   **No Implicit `any`**: In TypeScript, compiling with `noImplicitAny: true` and `strict: true` is mandatory. Avoid casting with `as any`. If runtime boundaries are dynamic, use `unknown` and perform explicit runtime checks or validation schemas (e.g., Zod, Runtypes).
*   **Strict Null / Undefined Checks**: Explicitly declare when a type can be null or undefined (`user: User | null`). Do not bypass compiler assertions using the non-null assertion operator (`!`) unless fully guarded by standard assertion functions.
*   **Avoid Primitive Obsession**: Use strong types or value objects for complex domain structures instead of raw strings or numbers (e.g., use an `Email` type or value object rather than a raw `string` for passing emails).

---

## 4. Modularity & Single Responsibility Principle (SRP)

Maintain loose coupling and high cohesion throughout the codebase.

### Guidelines:
*   **File Containment**: Each file must export exactly one logical module, class, or set of highly related functions. If a file grows beyond 300 lines, evaluate it for refactoring into sub-components.
*   **Dependency Injection**: Hardcoded dependencies make components untestable. Inject dependencies via constructors or factory methods.
*   **Boundary Separation**: Keep business logic completely separated from external infrastructure, web controllers, frameworks, or database entities. Ensure data models are mapped at the boundary layer.
