# Chapter 4: Metadata Design

## 📖 Summary

This chapter covers the design rules for HTTP metadata in REST APIs, focusing on standard HTTP headers, media types, and best practices for caching, content negotiation, and resource management. It emphasizes using HTTP's built-in mechanisms for conveying resource and representation information, and provides rules, examples, and vocabulary for effective metadata design.

---

## A. HTTP Headers

HTTP request and response messages can carry metadata in their headers. Standard headers provide information about resources, representations, and caching.

### A.1 Rule: Content-Type must be used
- **Purpose:** Specifies the media type of the request/response body (see Media Types section).
- **Importance:** Essential for content negotiation and correct processing of message bodies.
- **Example:**
  - `Content-Type: application/json`
  - `Content-Type: text/html; charset=UTF-8`

### A.2 Rule: Content-Length should be used
- **Purpose:** Indicates the size (in bytes) of the entity-body.
- **Benefits:**
  - Allows clients to verify they have read the correct number of bytes.
  - Enables HEAD requests to determine entity size without downloading the body.
- **Example:**
  - `Content-Length: 1024`

### A.3 Rule: Last-Modified should be used in responses
- **Purpose:** Timestamp of the last change to the resource's representational state.
- **Usage:** Should always be supplied in response to GET requests.
- **Benefits:** Enables clients and caches to determine freshness.
- **Example:**
  - `Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT`

### A.4 Rule: ETag should be used in responses
- **Purpose:** Provides an opaque string (entity tag) identifying a specific version of the resource representation.
- **Usage:** Should always be sent in response to GET requests.
- **Benefits:** Enables conditional requests and optimistic locking.
- **Warning:** Do **not** generate ETags from machine-specific or inconsistent sources (e.g., host-specific file modification times).
- **Example:**
  - `ETag: "33a64df551"`

#### Example: Conditional GET with ETag
```http
GET /users/123
If-None-Match: "33a64df551"
304 Not Modified
```

### A.5 Rule: Stores must support conditional PUT requests
- **Purpose:** Prevent lost updates and clarify intent for insert vs. update.
- **Implementation:**
  - Use `If-Unmodified-Since` (timestamp) and/or `If-Match` (ETag) headers.
  - If the condition fails, return 409 (Conflict) or 412 (Precondition Failed).
- **Example Flow:**
  1. **Insert:**
     - `PUT /objects/2113` (new URI)
     - API creates resource, returns `201 Created`.
  2. **Update Attempt (ambiguous):**
     - `PUT /objects/2113` (existing URI, no condition)
     - API returns `409 Conflict` (intent unclear).
  3. **Update with Condition:**
     - `PUT /objects/2113` with `If-Match: "etag-value"`
     - If ETag matches, update and return `200 OK` or `204 No Content` (with updated `Last-Modified` and `ETag`).
     - If ETag does not match, return `412 Precondition Failed`.

#### Example: Conditional PUT
```http
PUT /objects/2113
If-Match: "33a64df551"
200 OK
```

### A.6 Rule: Location must be used to specify the URI of a newly created resource
- **Purpose:** Tells clients where the new resource is located.
- **Usage:**
  - In `201 Created` responses after POST/PUT to a collection or store.
  - In `202 Accepted` responses, may point to an operational status resource.
- **Example:**
  - `Location: /users/123`

### A.7 Rule: Cache-Control, Expires, and Date response headers should be used to encourage caching
- **Purpose:** Enable effective caching of responses.
- **Implementation:**
  - `Cache-Control: max-age=60, must-revalidate`
  - `Expires: <date-time>` (for HTTP/1.0 support)
  - `Date: <date-time>` (time response was generated; helps compute freshness)
- **Example:**
  - `Cache-Control: public, max-age=3600`
  - `Expires: Wed, 21 Oct 2024 08:28:00 GMT`
  - `Date: Wed, 21 Oct 2024 07:28:00 GMT`

### A.8 Rule: Cache-Control, Expires, and Pragma response headers may be used to discourage caching
- **Purpose:** Prevent caching of sensitive or dynamic content.
- **Implementation:**
  - `Cache-Control: no-cache, no-store, must-revalidate`
  - `Pragma: no-cache` (for HTTP/1.0)
  - `Expires: 0` (for HTTP/1.0)
- **Example:**
  - `Cache-Control: no-cache, no-store, must-revalidate`
  - `Pragma: no-cache`
  - `Expires: 0`

### A.9 Rule: Caching should be encouraged
- **Principle:** Avoid `no-cache` unless absolutely necessary. Prefer a small `max-age` to allow short-term caching.
- **Benefits:** Reduces latency, improves reliability, lowers server load.

### A.10 Rule: Expiration caching headers should be used with 200 ("OK") responses
- **Purpose:** Enable caching of successful GET/HEAD responses.
- **Note:** POST is technically cacheable, but rarely cached in practice.

### A.11 Rule: Expiration caching headers may optionally be used with 3xx and 4xx responses
- **Purpose:** Negative caching reduces redirect and error-triggering load.
- **Example:**
  - `GET /users/999` → `404 Not Found` with short cache time

### A.12 Rule: Custom HTTP headers must not be used to change the behavior of HTTP methods
- **Principle:** Custom headers are for informational purposes only.
- **If information is critical:** Place it in the body or URI, not a custom header.
- **Example:**
  - ❌ `X-HTTP-Method-Override: DELETE`
  - ✅ Use standard HTTP methods and headers

---

## B. Media Types

### B.1 Media Type Syntax
- **Format:** `type "/" subtype *( ";" parameter )`
- **Types:** `application`, `audio`, `image`, `message`, `model`, `multipart`, `text`, `video`
- **Parameters:** Attribute-value pairs, separated by `;`, e.g. `charset=UTF-8`.
- **Example:**
  - `Content-Type: text/html; charset=ISO-8859-4`
  - `Content-Type: text/plain; charset="us-ascii"`

### B.2 Registered Media Types (IANA)
- **Governing body:** [IANA](http://www.iana.org/assignments/media-types)
- **Examples:**
  - `text/plain` — Plain text
  - `text/html` — HTML
  - `image/jpeg` — JPEG image
  - `application/xml` — XML
  - `application/atom+xml` — Atom feed
  - `application/javascript` — JavaScript
  - `application/json` — JSON

### B.3 Vendor-Specific Media Types
- **Prefix:** `vnd` (vendor)
- **Purpose:** Application-specific metadata, more meaningful to clients that understand them.
- **Examples:**
  - `application/vnd.ms-excel`
  - `application/vnd.github.v3+json`
  - `application/vnd.stripe.v1+json`
  - `text/vnd.sun.j2me.app-descriptor`

### B.4 Application-Specific Media Types and WRML Example
- **Purpose:** Communicate both format and semantics of the representation.
- **WRML Example:**
  ```http
  Content-Type: application/wrml;
    format="http://api.formats.wrml.org/application/json";
    schema="http://api.schemas.wrml.org/soccer/Player"
  ```
  - `format` parameter: URI describing the format (e.g., JSON)
  - `schema` parameter: URI describing the resource type's schema

#### Media Type Format Design
- Use a URI for the format parameter to allow clients to discover related resources and code for parsing/formatting.

#### Media Type Schema Design
- Use a URI for the schema parameter; version schemas by suffixing the URI (e.g., `/Player-2`). The current version is always available at the base URI (e.g., `/Player`).

### B.5 Rule: Media type negotiation should be supported when multiple representations are available
- **Implementation:** Use the `Accept` header to let clients select format and schema.
- **Example:**
  ```http
  Accept: application/wrml;
    format="http://api.formats.wrml.org/text/html";
    schema="http://api.schemas.wrml.org/soccer/Team"
  ```
- **Browser support:** Also support raw media types (e.g., `application/json`) for browser add-ons like JSONView.

### B.6 Rule: Media type selection using a query parameter may be supported
- **Implementation:** Use a query parameter (e.g., `accept`) to specify the desired media type.
- **Example:**
  - `GET /bookmarks/mikemassedotcom?accept=application/xml`
- **Note:** This is a form of tunneling; use with care. Prefer the `Accept` header when possible.

---

## C. Key Principles
1. Use standard HTTP headers for metadata.
2. Enable caching to improve performance.
3. Support content negotiation for flexibility.
4. Provide resource state and location information through headers.
5. Maintain HTTP semantics; avoid custom headers for critical information.

---

## D. Canonical Examples

### D.1 Caching Headers
```http
# Encourage caching
GET /users/123
200 OK
Cache-Control: public, max-age=3600
ETag: "33a64df551"
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# Discourage caching
GET /users/123/private-data
200 OK
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

### D.2 Conditional Requests
```http
# Conditional GET
GET /users/123
If-None-Match: "33a64df551"
304 Not Modified

# Conditional PUT
PUT /users/123
If-Match: "33a64df551"
200 OK

# Conditional PUT with failed precondition
PUT /users/123
If-Match: "old-etag"
412 Precondition Failed
```

### D.3 Media Type Negotiation
```http
# Request with Accept header
GET /users/123
Accept: application/json, application/xml

# Response with Content-Type
200 OK
Content-Type: application/json

# Request with Accept header for WRML
GET /players/2113
Accept: application/wrml; format="http://api.formats.wrml.org/application/json"; schema="http://api.schemas.wrml.org/soccer/Player"

# Request with query parameter
GET /bookmarks/mikemassedotcom?accept=application/xml
```

---

## E. Vocabulary Table

| Term                        | Description                                                                                 |
|-----------------------------|---------------------------------------------------------------------------------------------|
| Atom Syndication Format     | XML-based format structuring data into lists known as "feeds."                              |
| Conditional request         | Client-initiated interaction with a precondition for the server to honor.                   |
| Entity                      | HTTP request/response payload: headers (metadata) + body (content).                         |
| Entity tag (ETag)           | Opaque string designating the version of a response's headers and body.                     |
| Extensible Markup Language  | Standardized application profile of SGML for data exchange (XML).                           |
| Internet Assigned Numbers Authority (IANA) | Governs global IP allocation and media type registration.                |
| Media type negotiation      | Client-initiated process to select the form of a response's representation.                 |
| Media type schema           | Web-oriented description of a form (fields and links).                                      |
| Negative caching            | Serving cached responses for non-2xx status codes (e.g., 3xx, 4xx).                        |
| Vendor-specific media type  | Form descriptor owned/controlled by a specific organization.                                |

---

## F. HTTP Response Header Summary

| Header         | Purpose                                              |
|----------------|------------------------------------------------------|
| Content-Type   | Identifies the entity body's media type              |
| Content-Length | The size (in bytes) of the entity body               |
| Last-Modified  | Date-time of last resource representation's change   |
| ETag           | Indicates the version of the response message entity |
| Location       | URI of a newly created resource                      |
| Cache-Control  | Caching directives                                   |
| Expires        | Expiration date-time for caching                     |
| Date           | Date-time the response was generated                 |
| Pragma         | Legacy cache control (HTTP/1.0)                      |

---

## G. Review Questions
1. What are the key HTTP headers for caching?
2. How do you use ETags for conditional requests?
3. What's the purpose of the Location header?
4. How do you specify media types in HTTP?
5. What are vendor-specific media types?
6. How do you support content negotiation?
7. When should you encourage vs discourage caching?
8. What's the difference between If-Match and If-None-Match?
9. How do you handle conditional PUT requests?
10. What are the benefits of using standard HTTP headers?

---

## H. Key Concepts, Pros & Cons, Real-World Applications

### Key Concepts
- Use HTTP's standard headers and media types for metadata.
- Support conditional requests and caching for performance and reliability.
- Use content negotiation for flexible representations.
- Prefer self-descriptive, versioned, and discoverable media types.

### Pros
- Standard HTTP mechanisms
- Built-in caching support
- Content negotiation capabilities
- Resource state management

### Cons
- Header complexity
- Cache invalidation challenges
- Media type proliferation

### Real-World Applications
- **GitHub API:** Uses vendor-specific media types
- **Twitter API:** Comprehensive caching headers
- **Stripe API:** Conditional requests for data consistency
- **Shopify API:** Content negotiation support

---

## I. Practice Exercises

### Exercise 1: Design Caching Strategy
**Task:** Design appropriate cache headers for different types of resources.

### Exercise 2: Content Negotiation
**Task:** Implement content negotiation for multiple response formats.

---

## J. Questions & Doubts

### Questions for Clarification
1. How do you handle cache invalidation?
2. What's the best strategy for media type versioning?

### Areas Needing More Research
- Advanced caching strategies
- Media type design patterns

---

## K. Recap & Next Steps

### Key Takeaways
1. Use standard HTTP headers for metadata.
2. Enable caching to improve performance.
3. Support content negotiation for flexibility.
4. Provide resource state information through headers.
5. Prefer self-descriptive, versioned, and discoverable media types.

### Next Steps
- [ ] Study representation design principles.
- [ ] Learn about error handling patterns.
- [ ] Practice implementing caching strategies.

---

*Notes taken on: [Date]*
*Pages covered: 35-44*
*Index System: A → K (Main sections), A.1 → K.2 (Subsections)*
