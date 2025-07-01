# Chapter 3: Interaction Design with HTTP

## 📖 Summary

This chapter covers HTTP/1.1 request methods, response status codes, and the rules for using them correctly in REST API design. It emphasizes the importance of using HTTP as intended, with proper method semantics and status codes, and provides canonical examples and vocabulary.

### HTTP/1.1
- REST APIs embrace all aspects of HTTP/1.1, including request methods, response codes, and message headers.
- This chapter focuses on request methods and response status codes; headers and metadata are covered in Chapter 4.
- Tools like `curl` are useful for testing and scripting HTTP requests, as they provide access to the full HTTP feature set.

### Request Methods
- Clients specify the desired interaction method in the Request-Line: `Method SP Request-URI SP HTTP-Version CRLF` (RFC 2616).
- Each HTTP method has specific, well-defined semantics within a REST API's resource model.

#### Rule: GET and POST must not be used to tunnel other request methods
- **Tunneling:** Any abuse of HTTP that masks or misrepresents a message's intent and undermines protocol transparency.
- **Example:**
  - ❌ `POST /users/123?_method=DELETE` (tunneling)
  - ✅ `DELETE /users/123` (correct)

#### Rule: GET must be used to retrieve a representation of a resource
- **Purpose:** Retrieve resource state without side effects.
- **Safe, idempotent, cacheable.**
- **Example (curl):**
  ```bash
  curl -v http://api.example.restapi.org/greeting
  ```
- **Response:** 200 OK with resource representation in the body.

#### Rule: HEAD should be used to retrieve response headers
- **Purpose:** Retrieve headers without a body (metadata only).
- **Example (curl):**
  ```bash
  curl --head http://api.example.restapi.org/greeting
  ```
- **Response:** 200 OK with headers only.

#### Rule: PUT must be used to both insert and update a stored resource
- **Purpose:** Add a new resource to a store (client-specified URI) or update/replace an existing resource.
- **Example:**
  - `PUT /accounts/4ef2d5d0-cb7e-11e0-9572-0800200c9a66/buckets/objects/4321`
- **Request body:** Representation of the resource to store or update.

#### Rule: PUT must be used to update mutable resources
- **Purpose:** Make changes to resources by sending the complete new state.

#### Rule: POST must be used to create a new resource in a collection
- **Purpose:** Add a new resource to a server-owned collection.
- **Example:**
  - `POST /leagues/seattle/teams/trebuchet/players`
- **Request body:** Suggested state representation of the new resource.

#### Rule: POST must be used to execute controllers
- **Purpose:** Invoke function-oriented controller resources for actions not mappable to CRUD.
- **Example:**
  - `POST /alerts/245743/resend`
- **Request body:** Inputs to the controller resource's function.
- **Note:** POST is unsafe and non-idempotent; use for actions with side effects.

#### Rule: DELETE must be used to remove a resource from its parent
- **Purpose:** Remove a resource from its parent (collection or store).
- **Example:**
  - `DELETE /accounts/4ef2d5d0-cb7e-11e0-9572-0800200c9a66/buckets/objects/4321`
- **Result:** Resource is no longer available; future GET/HEAD returns 404.
- **Note:** Do not use DELETE for "soft" deletes; use a controller and POST for state changes that do not remove the resource.

#### Rule: OPTIONS should be used to retrieve metadata that describes a resource's available interactions
- **Purpose:** Discover available HTTP methods and metadata for a resource.
- **Example:**
  - `OPTIONS /users/123`
- **Response:** `Allow: GET, PUT, DELETE` (header)
- **Body:** May include further details about each interaction option.

### Response Status Codes
- REST APIs use the Status-Line to inform clients of the result: `HTTP-Version SP Status-Code SP Reason-Phrase CRLF` (RFC 2616).
- Status codes are divided into five categories:
  - 1xx: Informational
  - 2xx: Success
  - 3xx: Redirection
  - 4xx: Client Error
  - 5xx: Server Error

#### Rule: 200 (“OK”) should be used to indicate nonspecific success
- **Use:** Most successful requests (GET, PUT, PATCH).
- **Response body:** Should include a representation.

#### Rule: 200 (“OK”) must not be used to communicate errors in the response body
- **Use appropriate error status codes instead.**

#### Rule: 201 (“Created”) must be used to indicate successful resource creation
- **Use:** When a collection or store creates a new resource, or a controller creates a resource.
- **Response:** 201 Created, often with a Location header for the new resource.

#### Rule: 202 (“Accepted”) must be used to indicate successful start of an asynchronous action
- **Use:** For long-running or asynchronous actions (typically controllers).
- **Response:** 202 Accepted; request will be processed later.

#### Rule: 204 (“No Content”) should be used when the response body is intentionally empty
- **Use:** PUT, POST, or DELETE when no response body is needed; also for GET when resource exists but has no state representation.

#### Rule: 301 (“Moved Permanently”) should be used to relocate resources
- **Use:** When a resource has a new permanent URI; include Location header.

#### Rule: 302 (“Found”) should not be used
- **Reason:** Semantics are ambiguous; use 303 or 307 instead.

#### Rule: 303 (“See Other”) should be used to refer the client to a different URI
- **Use:** Controller has finished work and returns a URI for a response resource (e.g., status message or permanent resource).

#### Rule: 304 (“Not Modified”) should be used to preserve bandwidth
- **Use:** With conditional GET requests; response body must be empty.

#### Rule: 307 (“Temporary Redirect”) should be used to tell clients to resubmit the request to another URI
- **Use:** Assign a temporary URI to the client's requested resource; client should resubmit the request to the new URI.

#### Rule: 400 (“Bad Request”) may be used to indicate nonspecific failure
- **Use:** Generic client-side error; response body may describe the error (unless HEAD).

#### Rule: 401 (“Unauthorized”) must be used when there is a problem with the client's credentials
- **Use:** Client tried to operate on a protected resource without proper authorization.

#### Rule: 403 (“Forbidden”) should be used to forbid access regardless of authorization state
- **Use:** Client's request is formed correctly, but the API refuses to honor it (application-level permissions).

#### Rule: 404 (“Not Found”) must be used when a client's URI cannot be mapped to a resource
- **Use:** API can't map the client's URI to a resource.

#### Rule: 405 (“Method Not Allowed”) must be used when the HTTP method is not supported
- **Use:** Client tried to use an unsupported HTTP method; must include Allow header listing supported methods.

#### Rule: 406 (“Not Acceptable”) must be used when the requested media type cannot be served
- **Use:** API cannot generate any of the client's preferred media types (Accept header).

#### Rule: 409 (“Conflict”) should be used to indicate a violation of resource state
- **Use:** Client tried to put resources into an impossible or inconsistent state (e.g., deleting a non-empty store).

#### Rule: 412 (“Precondition Failed”) should be used to support conditional operations
- **Use:** Client specified preconditions in request headers that were not met.

#### Rule: 415 (“Unsupported Media Type”) must be used when the media type of a request's payload cannot be processed
- **Use:** API cannot process the client's supplied media type (Content-Type header).

#### Rule: 500 (“Internal Server Error”) should be used to indicate API malfunction
- **Use:** Generic server error; client may retry the request.

### Key Principles
1. **Use HTTP Methods Correctly:** Each method has specific semantics
2. **Return Appropriate Status Codes:** Help clients understand the result
3. **Be Consistent:** Use the same patterns throughout your API
4. **Handle Errors Properly:** Use specific error codes for different scenarios

## Review Questions
1. What are the main HTTP methods and when should each be used?
2. What's the difference between PUT and POST?
3. When should you use 201 vs 200 status codes?
4. What's the difference between 401 and 403?
5. When should you use 202 Accepted?
6. What's the purpose of the OPTIONS method?
7. How do you handle conditional requests?
8. What status code should you use for validation errors?
9. When should you use 409 Conflict?
10. What are the key principles for using HTTP methods and status codes?

## Key Concepts

### Example: Complete CRUD Operations
```http
# Create
POST /users
201 Created

# Read
GET /users/123
200 OK

# Update (complete)
PUT /users/123
200 OK

# Update (partial)
PATCH /users/123
200 OK

# Delete
DELETE /users/123
204 No Content
```

### Example: Error Responses
```http
# Not found
GET /users/999
404 Not Found

# Validation error
POST /users
400 Bad Request

# Unauthorized
GET /admin/users
401 Unauthorized

# Forbidden
GET /users/123/private-data
403 Forbidden
```

## Pros & Cons

### Pros
- Standard HTTP semantics
- Clear and predictable behavior
- Good tooling support
- Caching-friendly

### Cons
- Limited to HTTP methods
- Can be complex for non-CRUD operations
- Requires careful status code selection

## Real-World Applications
- **GitHub API:** Uses all HTTP methods appropriately
- **Twitter API:** RESTful endpoints with proper status codes
- **Stripe API:** Comprehensive error handling with specific status codes
- **Shopify API:** Consistent use of HTTP methods and status codes

## Practice Exercises

### Exercise 1: Design CRUD Endpoints
**Task:** Design complete CRUD operations for a blog post resource with proper HTTP methods and status codes.

### Exercise 2: Error Handling
**Task:** Define appropriate status codes and error messages for various scenarios.

## Questions & Doubts

### Questions for Clarification
1. How do you handle complex operations that don't fit standard HTTP methods?
2. What's the best way to handle bulk operations?

### Areas Needing More Research
- HTTP method semantics for complex operations
- Status code usage patterns in different domains

## Recap
This chapter presented the design principles for HTTP's request methods and response status codes. It summarized the standard usage of each method and status code, and provided vocabulary for key HTTP concepts.

### Vocabulary Table
| Term              | Description |
|-------------------|-------------|
| DELETE            | HTTP request method used to remove its parent. |
| GET               | HTTP request method used to retrieve a representation of a resource's state. |
| HEAD              | HTTP request method used to retrieve the metadata associated with the resource's state. |
| OPTIONS           | HTTP request method used to retrieve metadata that describes a resource's available interactions. |
| POST              | HTTP request method used to create a new resource within a collection or execute a controller. |
| PUT               | HTTP request method used to insert a new resource into a store or update a mutable resource. |
| Request-Line      | RFC 2616 defines its syntax as Method SP Request-URI SP HTTP-Version CRLF |
| Request method    | Indicates the desired action to be performed on the request message's identified resource. |
| Response status code | A three-digit numeric value that is communicated by a server to indicate the result of a client's request. |
| Status-Line       | RFC 2616 defines its syntax as: HTTP-Version SP Status-Code SP Reason-Phrase CRLF |
| Tunneling         | An abuse of HTTP that masks or misrepresents a message's intent and undermines the protocol's transparency. |

### POST Request Method Summary
| Resource Archetype | POST Usage |
|--------------------|------------|
| Document           | error      |
| Collection         | Create a new, contained resource |
| Store              | error      |
| Controller         | Execute the function |

### HTTP Request Method Summary
| Method   | Semantics |
|----------|-----------|
| GET      | Retrieve the complete state of a resource, in some representational form |
| HEAD     | Retrieve the metadata state of a resource |
| PUT      | Insert a new resource into a store or update an existing, mutable resource |
| DELETE   | Remove the resource from its parent |
| OPTIONS  | Retrieve metadata that describes a resource's available interactions |

### HTTP Response Success Code Summary
| Code | Name               | Meaning |
|------|--------------------|---------|
| 200  | OK                 | Indicates a nonspecific success |
| 201  | Created            | Sent primarily by collections and stores but sometimes also by controllers, to indicate that a new resource has been created |
| 202  | Accepted           | Sent by controllers to indicate the start of an asynchronous action |
| 204  | No Content         | Indicates that the body has been intentionally left blank |
| 301  | Moved Permanently  | Indicates that a new permanent URI has been assigned to the client's requested resource |
| 303  | See Other          | Sent by controllers to return results that it considers optional |
| 304  | Not Modified       | Sent to preserve bandwidth (with conditional GET) |
| 307  | Temporary Redirect | Indicates that a temporary URI has been assigned to the client's requested resource |

### HTTP Response Error Code Summary
| Code | Name                  | Meaning |
|------|-----------------------|---------|
| 400  | Bad Request           | Indicates a nonspecific client error |
| 401  | Unauthorized          | Sent when the client either provided invalid credentials or forgot to send them |
| 403  | Forbidden             | Sent to deny access to a protected resource |
| 404  | Not Found             | Sent when the client tried to interact with a URI that the REST API could not map to a resource |
| 405  | Method Not Allowed    | Sent when the client tried to interact using an unsupported HTTP method |
| 406  | Not Acceptable        | Sent when the client tried to request data in an unsupported media type format |
| 409  | Conflict              | Indicates that the client attempted to violate resource state |
| 412  | Precondition Failed   | Tells the client that one of its preconditions was not met |
| 415  | Unsupported Media Type| Sent when the client submitted data in an unsupported media type format |
| 500  | Internal Server Error | Tells the client that the API is having problems of its own |

---

*Notes taken on: [Date]*
*Pages covered: 23-33*
*Index System: A → G (Main sections), A.1 → G.2 (Subsections), A.1.1 → G.2.2 (Details)*
