# Chapter 6: Client Concerns

## 📖 Summary

This chapter addresses client-side concerns in REST API design, including versioning strategies, security considerations, response composition, and JavaScript client support. It provides design principles to address common client needs and concludes with rules for browser-based JavaScript clients.

---

## A. Introduction

Any computer program can be a REST API's client, including:
- Scripts loaded in web pages
- Handheld games
- Business-critical applications running on server farms

REST APIs are designed to suit the needs of their client programs, whatever those needs may be. This chapter provides design principles to address common client concerns and concludes with rules for browser-based JavaScript clients.

---

## B. Versioning

A REST API is composed of an assembly of interlinked resources (its resource model). The version of each resource is conveyed through its representational form and state.

### B.1 Rule: New URIs should be used to introduce new concepts

#### URI Versioning Philosophy
- **Resource Identity**: A resource is a semantic model (like a thought about a thing)
- **URI Consistency**: The identifier must consistently address the same thought
- **Character Importance**: Every character in a URI contributes to its identity
- **Version Avoidance**: Version indicators (like `v2`) in URIs suggest the concept itself has multiple versions, which is usually not the intent

#### Principle
- A URI identifies a resource, independent of the version of its representational form and state
- REST APIs should maintain consistent mapping of URIs to conceptually constant resources
- Introduce new URIs only when exposing new concepts

#### Examples
- **Avoid**: `/api/v2/users` (suggests multiple versions of the "user" concept)
- **Prefer**: `/api/users` (consistent concept) with schema versioning for form changes

### B.2 Rule: Schemas should be used to manage representational form versions

#### Implementation
- Use versioned schema documents to manage representation form versions
- Clients use media type negotiation to bind to suitable representational forms
- Add fields and links to new schema versions to introduce features without breaking backward compatibility

#### Example
```
application/vnd.example.users+json;version=1.0
application/vnd.example.users+json;version=2.0
```

### B.3 Rule: Entity tags should be used to manage representational state versions

#### Implementation
- Use ETag HTTP headers to convey resource representational state versions
- Entity tag values provide the most fine-grained versioning system
- Each individual resource has its own versioning through ETags

#### Example
```
ETag: "abc123" (version 1)
ETag: "def456" (version 2)
```

---

## C. Security

Many REST APIs expose resources associated with specific clients and/or users. Documents may contain private information, and controllers may expose operations for restricted audiences.

### C.1 Rule: OAuth may be used to protect resources

#### OAuth Overview
- **Standard**: Open standard for secure authorization
- **Management**: OAuth Working Group within IETF (Google, Microsoft, Facebook, Twitter, Yahoo, etc.)
- **Purpose**: Allow users to share private resources without disclosing credentials
- **Architecture**: Complementary to REST's resource-centric, stateless nature

#### OAuth Flow
1. **Client obtains artifacts** needed to interact with protected resources
2. **Client requests interaction** with protected resource using artifacts
3. **REST API validates** OAuth-based authorization information
4. **If validation succeeds**, allow client interaction with protected resource

#### Versions
- **OAuth 1.0**: [RFC 5849](http://tools.ietf.org/html/rfc5849)
- **OAuth 2.0**: [Draft IETF OAuth v2](http://tools.ietf.org/html/draft-ietf-oauth-v2)

### C.2 Rule: API management solutions may be used to protect resources

#### API Reverse Proxy
- **Type**: Network-based intermediary for REST API cross-cutting concerns
- **Vendors**: Apigee, Mashery, Kong, AWS API Gateway
- **Features**: OAuth support, rate limiting, monitoring, analytics
- **Benefits**: Out-of-the-box security protocol support

---

## D. Response Representation Composition

Client needs evolve over time. As new features are added, clients may require new resources or existing resources modeled differently. REST APIs can show respect for clients by offering control over response composition.

### D.1 Rule: The query component of a URI should be used to support partial responses

#### Purpose
- Allow clients to request only needed fields
- Save bandwidth and accelerate interactions
- Use `fields` parameter to trim response data

#### Inclusion List Example
```http
GET /students/morgan?fields=(firstName, birthDate) HTTP/1.1
Host: api.college.restapi.org

HTTP/1.1 200 OK
Content-Type: application/wrml;
  format="http://api.formats.wrml.org/application/json";
  schema="http://api.schemas.wrml.org/college/Student";
  fields="(birthDate, firstName)"

{
  "firstName": "Morgan",
  "birthDate": "1992-07-31"
}
```

**Key Points:**
- `fields` parameter specifies inclusion list
- Media type must include `fields` parameter with canonicalized field list
- Response contains only specified fields

#### Exclusion List Example
```http
GET /students/morgan?fields=!(address,schedule!(wednesday, friday))
Host: api.college.restapi.org

HTTP/1.1 200 OK
Content-Type: application/wrml;
  format="http://api.formats.wrml.org/application/json";
  schema="http://api.schemas.wrml.org/college/Student";
  fields="!(address, schedule!(friday, wednesday))"

{
  "firstName": "Morgan",
  "birthDate": "1992-07-31",
  "schedule": {
    "monday": {
      "links": {
        "firstClass": {
          "href": "http://api.college.restapi.org/classes/math-202",
          "rel": "http://api.relations.wrml.org/college/firstClass"
        }
      }
    }
  }
}
```

**Key Points:**
- Exclamation point (`!`) declares exclusion list
- Nested exclusions supported (e.g., `schedule!(wednesday, friday)`)
- Media type must specify excluded fields in alphabetical order
- Response includes all fields except those in exclusion list

### D.2 Rule: The query component of a URI should be used to embed linked resources

#### Link Types (Tim Berners-Lee)
- **Normal links**: Visible to user as traversal between documents (HTML A and LINK elements)
- **Embedding links**: Between document and embedded image/object/subdocument (IMG and OBJECT elements)

#### Purpose
- Allow clients to control which links remain "normal" vs become "embedded"
- Create facades that better match individual use cases
- Maintain consistent, fine-grained resource model

#### Example: Original Representation
```json
{
  "firstName": "Morgan",
  "birthDate": "1992-07-31",
  "links": {
    "self": {
      "href": "http://api.college.restapi.org/students/morgan",
      "rel": "http://api.relations.wrml.org/common/self"
    },
    "favoriteClass": {
      "href": "http://api.college.restapi.org/classes/japn-301",
      "rel": "http://api.relations.wrml.org/college/favoriteClass"
    }
  }
}
```

#### Example: With Embedded Resource
```http
GET /students/morgan?embed=(favoriteClass) HTTP/1.1
Host: api.college.restapi.org

HTTP/1.1 200 OK
Content-Type: application/wrml;
  format="http://api.formats.wrml.org/application/json";
  schema="http://api.schemas.wrml.org/college/Student";
  embed="(favoriteClass)"

{
  "firstName": "Morgan",
  "birthDate": "1992-07-31",
  "favoriteClass": {
    "id": "japn-301",
    "name": "Third-Year Japanese",
    "links": {
      "self": {
        "href": "http://api.college.restapi.org/classes/japn-301",
        "rel": "http://api.relations.wrml.org/common/self"
      }
    }
  },
  "links": {
    "self": {
      "href": "http://api.college.restapi.org/students/morgan",
      "rel": "http://api.relations.wrml.org/common/self"
    }
  }
}
```

**Key Points:**
- `embed` parameter specifies link relations to include as fields
- Media type must include `embed` parameter with embedded links in alphabetical order
- Embedded resource replaces the original link
- Only works for GET method links with same media type format

---

## E. Processing Hypermedia

Chapter 5 introduced hypermedia structures (link and link relation) designed for consistent client processing. The book includes a flowchart (Figure 6-1) illustrating client interaction with REST API response representation links.

### E.1 Hypermedia Processing Algorithm
1. **Look up link** using its relation's name
2. **Inspect method field** of link's relation document resource
3. **Check requestTypes field** if interaction requires request body content
4. **Execute appropriate HTTP request** based on relation document information

---

## F. JavaScript Clients

Modern web browsers provide a natural platform for client applications. JavaScript facilitates development of instantly available applications that make web experiences dynamic, games playable, and advertisements noticeable.

### F.1 Same Origin Policy
- **Restriction**: Browser-based JavaScript clients cannot access resources from different origins
- **Purpose**: Prevent leaking of confidential user data
- **Origin Definition**: URI's scheme, host, and port components

#### Same Origin Examples
```
http://restapi.org
http://restapi.org:80
http://restapi.org/js/my-mashup.js
```

#### Different Origin Examples
```
http://restapi.org
https://restapi.org          (different scheme)
http://www.restapi.org       (different host)
http://restapi.org:8080      (different port)
http://restapi.com           (different host)
```

### F.2 Mashups
JavaScript web applications that dynamically integrate content and services from several APIs with different origins. REST APIs can provide multi-origin access through JSONP and CORS.

### F.3 Rule: JSONP should be supported to provide multi-origin read access from JavaScript

#### JSONP Overview
- **Technique**: JSON with Padding - a useful hack for cross-origin read-only access
- **Browser Quirk**: HTML script elements not restricted like XMLHttpRequest
- **Limitation**: Limited to GET requests
- **Compatibility**: Works on modern and legacy browsers

#### Implementation
1. Client adds `<script src="...">` element to DOM
2. Client adds `callback` query parameter to URI
3. REST API wraps JSON response in callback function
4. Browser executes response, invoking callback function

#### Example: JavaScript Client Code
```javascript
var getPlayer = function(uri, successCallback) {
  $.ajax({
    url: uri,
    success: successCallback,
    dataType: 'jsonp'
  });
};

var showPlayerFullName = function(player) {
  alert(player.firstName + " " + player.lastName);
};

getPlayer("http://api.soccer.restapi.org/players/1421", showPlayerFullName);
```

#### Example: HTTP Request/Response
```http
GET /players/1421?callback=showPlayerFullName HTTP/1.1
Host: api.soccer.restapi.org

HTTP/1.1 200 OK
Content-Type: application/javascript

showPlayerFullName({
  "firstName": "Kasey",
  "lastName": "Keller",
  "number": 18,
  "birthDate": "1969-11-29",
  "links": {
    "self": {
      "href": "http://api.soccer.restapi.org/players/1421",
      "rel": "http://api.relations.wrml.org/common/self"
    }
  }
});
```

**Key Points:**
- Content-Type set to `application/javascript`
- Response wrapped in callback function call
- jQuery handles script injection and callback parameter addition

### F.4 Rule: CORS should be supported to provide multi-origin read/write access from JavaScript

#### CORS Overview
- **Standard**: W3C's proposed approach for cross-origin requests
- **Alternative**: To JSONP, supports all request methods
- **Enhancement**: Extends XMLHttpRequest for native cross-origin support

#### Preflight Requests
- **Trigger**: For methods other than GET, HEAD, and POST
- **Process**: Browser-server interaction before actual request
- **Headers**: `Origin`, `Access-Control-Request-Method`

#### CORS Headers
- `Access-Control-Allow-Origin`: Permitted origins
- `Access-Control-Allow-Methods`: Allowed HTTP methods
- `Access-Control-Allow-Headers`: Allowed request headers

#### Example: CORS Implementation
```javascript
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    xhr.open(method, url, true);
  }
  else if (typeof XDomainRequest != "undefined") {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  }
  else {
    xhr = null;
  }
  return xhr;
}
```

**Key Points:**
- Tests browser CORS support
- Handles Internet Explorer 8's XDomainRequest
- Returns null for unsupported browsers

---

## G. Key Principles
1. **Backward Compatibility**: Maintain existing functionality when possible
2. **Client Flexibility**: Provide options for different client needs
3. **Performance Optimization**: Support partial responses and embedding
4. **Security First**: Implement proper authentication and authorization
5. **Cross-Origin Support**: Enable JavaScript client access
6. **URI Consistency**: Avoid versioning in URIs, use schemas instead

---

## H. Canonical Examples

### H.1 Versioning Strategies
```http
# URI Versioning (Avoid)
GET /api/v2/users

# Schema Versioning (Prefer)
GET /api/users
Accept: application/vnd.example.users+json;version=2.0

# Content Versioning
GET /api/users/123
ETag: "abc123"
```

### H.2 Partial Responses
```http
# Inclusion List
GET /users/123?fields=(id,name,email)

# Exclusion List
GET /users?fields=!(password,ssn,internal_notes)

# Nested Exclusion
GET /users/123?fields=!(profile!(private_info,debug_data))
```

### H.3 Embedded Resources
```http
# Single Embed
GET /users/123?embed=(profile)

# Multiple Embeds
GET /orders/456?embed=(customer,items,shipping_address)
```

### H.4 CORS Headers
```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

---

## I. Vocabulary Table

| Term | Description |
|------|-------------|
| API reverse proxy | A network-based intermediary that addresses many of the cross-cutting concerns associated with REST APIs |
| Cross-Origin Resource Sharing (CORS) | The W3C's proposed approach to standardize cross-origin requests from the browser |
| Document Object Model (DOM) | A browser-based, client-side API that allows JavaScript code to interact with the elemental structure loaded in the browser's memory |
| Embedded link | A related resource that is retrieved and integrated into a referencing resource as a field |
| Exclusion list | A set of fields to be omitted from a message body that contains a representation |
| Inclusion list | The complete set of fields that a client expects to find within a message body that contains a representation |
| JSONP | Uses DOM scripting to support cross-origin GET requests from JavaScript |
| Mashup | A client that intertwines information and features that originate from a variety of unrelated resources |
| OAuth | An open standard authorization protocol that may be used to protect a REST API's resources |
| Partial response | The result of a client-controlled winnowing of a message body that contains a representation |
| Same origin policy | Restricts a browser-based JavaScript client from accessing resources from any web servers other than its code's own source |

---

## J. Review Questions
1. What are the different versioning strategies for REST APIs?
2. How do you handle backward compatibility?
3. What security mechanisms can be used to protect APIs?
4. How do you support partial responses?
5. What's the purpose of embedding linked resources?
6. How do you support JavaScript clients?
7. What's the difference between JSONP and CORS?
8. How do you manage API versions?
9. What are the benefits of response composition?
10. How do you handle cross-origin requests?
11. What is the same origin policy?
12. How do you implement OAuth flow?
13. What are the limitations of JSONP?
14. How do you handle CORS preflight requests?

---

## K. Key Concepts, Pros & Cons, Real-World Applications

### Key Concepts
- Use schema versioning instead of URI versioning
- Implement OAuth for secure authorization
- Support partial responses and embedded resources for client flexibility
- Enable cross-origin access through JSONP and CORS
- Respect client needs through response composition

### Pros
- Client flexibility and performance optimization
- Cross-origin support for JavaScript clients
- Backward compatibility through schema versioning
- Security through OAuth and API management
- Reduced bandwidth through partial responses

### Cons
- Increased complexity in implementation
- Potential security risks with cross-origin access
- More implementation effort for multiple client types
- Browser compatibility challenges

### Real-World Applications
- **GitHub API**: Comprehensive versioning and CORS support
- **Twitter API**: OAuth authentication and partial responses
- **Stripe API**: Schema versioning and embedded resources
- **Shopify API**: Multiple versioning strategies
- **Google APIs**: OAuth 2.0 and CORS support

---

## L. Practice Exercises

### Exercise 1: Design Versioning Strategy
**Task**: Design a versioning strategy for an API that needs to evolve while maintaining backward compatibility.

### Exercise 2: Implement CORS Support
**Task**: Implement CORS headers for a REST API to support cross-origin requests.

### Exercise 3: Response Composition
**Task**: Implement partial responses and embedded resources for a user management API.

---

## M. Questions & Doubts

### Questions for Clarification
1. How do you handle breaking changes in APIs?
2. What's the best approach for API versioning?
3. How do you implement OAuth 2.0 flow?

### Areas Needing More Research
- Advanced versioning strategies
- Security best practices
- CORS implementation patterns

---

## N. Recap & Next Steps

### Key Takeaways
1. Consider client needs when designing APIs
2. Implement proper versioning strategies using schemas
3. Support performance optimization techniques
4. Enable cross-origin access for JavaScript clients
5. Use OAuth for secure authorization
6. Provide response composition for client flexibility

### Next Steps
- [ ] Study final thoughts and best practices
- [ ] Learn about API design tools
- [ ] Practice implementing client-friendly features
- [ ] Explore advanced security patterns

---

*Notes taken on: [Date]*
*Pages covered: 71-83*
*Index System: A → N (Main sections), A.1 → N.2 (Subsections)*
