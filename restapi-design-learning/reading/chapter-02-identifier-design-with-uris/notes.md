# Chapter 2: Identifier Design with URIs

## 📖 Summary

This chapter covers URI design principles, resource modeling, and the rules for creating clear, consistent, and usable URIs in REST APIs.

### URI Opacity
- **Principle:** Clients must treat URIs as opaque identifiers and not infer meaning from their structure. However, API designers should create URIs that are meaningful and communicate the resource model to human developers.
- **Reference:** Tim Berners-Lee's "Axioms of Web Architecture" emphasizes that the only thing you can use an identifier for is to refer to an object.

### URIs

#### URI Format
- **Components:** Scheme, authority, path, query, fragment
- **Example:** `https://api.example.com/users/123?status=active#profile`
- **Purpose:** Uniquely identify resources on the web
- **RFC 3986:** Defines the generic URI syntax: `URI = scheme "://" authority "/" path [ "?" query ] [ "#" fragment ]`

### URI Authority Design

#### Authority
- **Definition:** The authority component identifies the party with jurisdiction over the namespace defined by the remainder of the URI.
- **Rule:** Consistent subdomain names should be used for your APIs
  - **Examples:**
    - `api.soccer.restapi.org` - Main API
    - `v1.api.example.com` - Versioned API
    - `dev-api.example.com` - Development API
- **Rule:** Consistent subdomain names should be used for your client developer portal
  - **Examples:**
    - `developer.soccer.restapi.org` - Developer portal
    - `docs.api.example.com` - API documentation

### Resource Modeling

#### Docroot
- **Definition:** The root resource (docroot) is the hierarchical ancestor of all other resources within a REST API's model and should be the API's advertised entry point.
- **Example:** `http://api.soccer.restapi.org`

#### Parent Resource
- **Definition:** The document, collection, or store that governs a given subordinate concept by preceding it within a URI's hierarchical path.

#### Resource Archetypes
- **Principle:** Each resource should align with only one archetype for clarity and uniformity.

##### Document
- **Definition:** A single concept or object, akin to an object instance or database record.
- **Examples:**
  - `/leagues/seattle` (soccer)
  - `/leagues/seattle/teams/trebuchet` (soccer)
  - `/leagues/seattle/teams/trebuchet/players/mike` (soccer)
  - `/users/123` (generic)
- **Docroot Example:** `/` or `/api` as the entry point.

##### Collection
- **Definition:** A server-managed directory of resources. Clients may propose new resources, but the collection decides what to contain and their URIs.
- **Examples:**
  - `/leagues` (soccer)
  - `/leagues/seattle/teams` (soccer)
  - `/leagues/seattle/teams/trebuchet/players` (soccer)
  - `/users` (generic)

##### Store
- **Definition:** A client-managed resource repository. Clients put, get, and delete resources, but stores do not generate new URIs.
- **Examples:**
  - `/users/1234/favorites` (soccer)
  - `/artists/mikemassedotcom/playlists` (music)
- **Interaction Example:** `PUT /users/1234/favorites/alonso`

##### Controller
- **Definition:** Models a procedural concept or action, like an executable function.
- **Examples:**
  - `/alerts/245743/resend` (POST)
  - `/students/morgan/register` (college)
  - `/lists/4324/dedupe` (generic)
  - `/dbs/reindex` (generic)
  - `/qa/nightly/runTestSuite` (generic)

### URI Path Design
- **Principle:** Each path segment, separated by forward slashes (/), represents a design opportunity to communicate the resource model's hierarchy.
- **WRML Notation:** Used to diagram the correlation of a URI path with the resource model.

#### Rule: A singular noun should be used for document names
- **Example:** `/leagues/seattle/teams/trebuchet/players/claudio` (player document)

#### Rule: A plural noun should be used for collection names
- **Example:** `/leagues/seattle/teams/trebuchet/players` (collection of player documents)

#### Rule: A plural noun should be used for store names
- **Example:** `/artists/mikemassedotcom/playlists` (music playlists)

#### Rule: A verb or verb phrase should be used for controller names
- **Example:** `/students/morgan/register` (register action)

#### Rule: Variable path segments may be substituted with identity-based values
- **URI Template Example:** `/leagues/{leagueId}/teams/{teamId}/players/{playerId}`
- **Substitution Example:** `/leagues/seattle/teams/trebuchet/players/21`
- **Note:** Clients must treat URIs as the only meaningful resource identifiers, even if backend IDs are used in the path.

#### Rule: CRUD function names should not be used in URIs
- **Anti-patterns:**
  - `GET /deleteUser?id=1234`
  - `GET /deleteUser/1234`
  - `DELETE /deleteUser/1234`
  - `POST /users/1234/delete`
- **Preferred:** Use HTTP methods: `DELETE /users/1234`

### URI Query Design
- **Principle:** The query component comes after the path and before the optional fragment, and can be used for filtering, searching, and pagination.
- **Opacity:** The query part may be transparent to clients, but caches must not vary behavior based on its presence.

#### Rule: The query component of a URI may be used to filter collections or stores
- **Example:**
  - `GET /users` (all users)
  - `GET /users?role=admin` (filtered by role)

#### Rule: The query component of a URI should be used to paginate collection or store results
- **Canonical Parameters:** `pageSize` and `pageStartIndex`
- **Example:** `GET /users?pageSize=25&pageStartIndex=50`
- **Note:** For complex requirements, consider a controller resource (e.g., `POST /users/search`).

### Key Principles
1. **Hierarchical Structure:** Use forward slashes to show relationships
2. **Consistent Naming:** Follow established conventions
3. **Readability:** Use hyphens and lowercase for clarity
4. **Resource-Oriented:** Focus on resources, not actions
5. **Query Parameters:** Use for filtering and pagination
6. **Opacity:** Clients treat URIs as opaque, but designers should make them meaningful

## Review Questions
1. What are the four resource archetypes in REST API design?
2. What's the difference between a collection and a store?
3. When should you use singular vs plural nouns in URIs?
4. What are the rules for URI path design?
5. How should you handle filtering and pagination in URIs?
6. Why should you avoid file extensions in URIs?
7. What's the purpose of using hyphens in URIs?
8. How do you show hierarchical relationships in URIs?
9. What are the benefits of consistent subdomain naming?
10. How do you identify specific resources in URIs?

## Key Concepts

### Example: Resource Archetypes
```
Document:    /leagues/seattle/teams/trebuchet/players/mike
Collection:  /leagues/seattle/teams/trebuchet/players
Store:       /users/1234/favorites
Controller:  /alerts/245743/resend
```

### Example: URI Hierarchy
```
/api/v1/users/123/orders/456/items/789
├── api (API base)
├── v1 (version)
├── users (collection)
├── 123 (user document)
├── orders (user's orders collection)
├── 456 (order document)
├── items (order items collection)
└── 789 (item document)
```

### Example: Query Parameters
```
# Filtering
GET /users?status=active&role=admin

# Pagination (canonical)
GET /users?pageSize=25&pageStartIndex=50

# Sorting
GET /users?sort=name&order=asc
```

## Pros & Cons

### Pros
- Clear and intuitive resource identification
- Consistent patterns across APIs
- Easy to understand and use
- Scalable and maintainable

### Cons
- Can lead to deep nesting
- Design decisions can be subjective
- May require careful planning for complex relationships

## Real-World Applications
- **GitHub API:** `/repos/{owner}/{repo}/issues`
- **Twitter API:** `/users/{id}/tweets`
- **Stripe API:** `/customers/{id}/payment_methods`
- **Shopify API:** `/orders/{id}/line_items`

## Practice Exercises

### Exercise 1: Design Resource URIs
**Task:** Design URIs for a library management system with books, authors, members, and loans.

### Exercise 2: Resource Archetype Identification
**Task:** Identify the resource archetype for each URI in a given API.

## Questions & Doubts

### Questions for Clarification
1. How deep should URI nesting go?
2. When should you create separate resources vs nested resources?

### Areas Needing More Research
- URI design patterns for complex domains
- Handling versioning in URIs

## Recap
This chapter offered a set of design rules for REST API URIs, including format, authority, path, query, and resource modeling. It emphasized the importance of meaningful, consistent, and hierarchical URIs, and introduced the four resource archetypes. The chapter also provided canonical examples and a vocabulary review.

## Vocabulary Table
| Term            | Description |
|-----------------|-------------|
| Authority       | A URI component that identifies the party with jurisdiction over the namespace defined by the remainder of the URI. |
| Collection      | A resource archetype used to model a server-managed directory of resources. |
| Controller      | A resource archetype used to model a procedural concept. |
| CRUD            | An acronym that stands for the four classic storage-oriented functions: create, retrieve, update, and delete. |
| Developer portal| A Web-based graphical user interface that helps a REST API acquire new clients. |
| Docroot         | A resource that is the hierarchical ancestor of all other resources within a REST API's model. This resource's URI should be the REST API's advertised entry point. |
| Document        | A resource archetype used to model a singular concept. |
| Forward slash separator (/) | Used within the URI path component to separate hierarchically related resources. |
| Opacity of URIs | An axiom, originally described by Tim Berners-Lee, that governs the visibility of a resource identifier's composition. |
| Parent resource | The document, collection, or store that governs a given subordinate concept by preceding it within a URI's hierarchical path. |
| Query           | A URI component that comes after the path and before the optional fragment. |
| Resource archetypes | A set of four intrinsic concepts (document, collection, store, and controller) that may be used to help describe a REST API's model. |
| Store           | A resource archetype used to model a client-managed resource repository. |
| URI path segment| Part of a resource identifier that represents a single node within a larger, hierarchical resource model. |
| URI template    | A resource identifier syntax that includes variables that must be substituted before resolution. |

---

*Notes taken on: [Date]*
*Pages covered: 11-20*
*Index System: A → G (Main sections), A.1 → G.2 (Subsections), A.1.1 → G.2.2 (Details)*
