# Chapter 5: Representation Design

## 📖 Summary

This chapter covers the design rules for resource representations in REST APIs, focusing on message body formats, hypermedia representation, media type representation, and error representation. It introduces the WRML framework for consistent, self-descriptive representations and provides detailed rules for structuring resource state, links, schemas, and errors.

---

## A. Message Body Format

REST APIs use response message entity bodies to convey resource state. The most common text formats are XML and JSON.

### A.1 XML vs JSON Overview
- **XML**: Uses angle-bracketed tag pairs (`<tag>content</tag>`), requires perfect tag matching
- **JSON**: Uses curly brackets (`{}`) for hierarchical structure, feels natural to object-oriented programmers
- **Note**: Book examples favor JSON, though some are malformed due to formatting constraints

### A.2 Rule: JSON should be supported for resource representation
- **Purpose**: Lightweight, simple data exchange format
- **Benefits**:
  - Popular and widely supported
  - Seamless browser integration
  - Borrows from JavaScript's good parts
- **Usage**: Use JSON when no standard format exists for a resource type
- **Note**: This rule refers to JSON format, not necessarily `application/json` media type

### A.3 Rule: JSON must be well-formed
- **Structure**: Unordered set of name-value pairs
- **Names**: Must be strings surrounded by double quotes (stricter than JavaScript)
- **Values**: Numbers directly supported, date-times as strings
- **Naming Convention**: Use mixed lower case (e.g., `fooBar`) to enable dot notation
- **Example**:
  ```json
  {
    "firstName": "Osvaldo",
    "lastName": "Alonso",
    "firstNamePronunciation": "ahs-VAHL-doe",
    "number": 6,
    "birthDate": "1985-11-11"
  }
  ```

### A.4 Rule: XML and other formats may optionally be used for resource representation
- **Purpose**: Support alternative formats for different use cases
- **Implementation**: Use media type negotiation (see Chapter 4)
- **Benefits**: Format-neutral schemas enable consistent structure across multiple formats
- **Example**: Same schema can be rendered as JSON, XML, or HTML

### A.5 Rule: Additional envelopes must not be created
- **Principle**: Leverage HTTP's message envelope, don't add transport-oriented wrappers
- **Anti-pattern**:
  ```json
  {
    "data": {"user": {...}},
    "status": "success"
  }
  ```
- **Correct**:
  ```json
  {
    "id": 123,
    "name": "John Doe"
  }
  ```

---

## B. Hypermedia Representation

REST APIs use hypermedia (links) within representations to indicate available associations and actions, similar to HTML hyperlinks and forms.

### B.1 Rule: A consistent form should be used to represent links

#### WRML Link Structure
**Media Type:**
```
application/wrml;
format="http://api.formats.wrml.org/application/json";
schema="http://api.schemas.wrml.org/common/Link"
```

**JSON Structure:**
```json
{
  "href": "Text <constrained by URI or URI Template syntax>",
  "rel": "Text <constrained by URI syntax>",
  "requestTypes": "Array <constrained to contain media type text elements>",
  "responseTypes": "Array <constrained to contain media type text elements>",
  "title": "Text"
}
```

**Fields:**
- `href` (required): Target resource URI or URI template
- `rel` (required): Link relation document URI
- `requestTypes` (optional): Allowed request body media types
- `responseTypes` (optional): Available response body media types
- `title` (optional): Plain text title

#### Example: Minimal Link
```json
{
  "href": "http://api.soccer.restapi.org/players/2113",
  "rel": "http://api.relations.wrml.org/common/self"
}
```

#### Example: Link with Optional Fields
```json
{
  "href": "http://api.soccer.restapi.org/players/2113",
  "rel": "http://api.relations.wrml.org/common/self",
  "responseTypes": [
    "application/wrml; format=\"http://api.formats.wrml.org/application/json\"; schema=\"http://api.schemas.wrml.org/soccer/Player\"",
    "application/json",
    "application/xml",
    "text/html"
  ],
  "title": "Osvaldo Alonso"
}
```

### B.2 Rule: A consistent form should be used to represent link relations

#### WRML LinkRelation Structure
**Media Type:**
```
application/wrml;
format="http://api.formats.wrml.org/application/json";
schema="http://api.schemas.wrml.org/common/LinkRelation"
```

**JSON Structure:**
```json
{
  "name": "Text",
  "method": "Text <constrained to be choice of HTTP method>",
  "requestTypes": "Array <constrained to contain media type text elements>",
  "responseTypes": "Array <constrained to contain media type text elements>",
  "description": "Text",
  "title": "Text"
}
```

**Fields:**
- `name` (required): Link relation name (mixed lower case)
- `method` (optional): Associated HTTP method (defaults to GET)
- `requestTypes` (optional): Allowed request body media types
- `responseTypes` (optional): Available response body media types
- `description` (required): Plain text description
- `title` (optional): Plain text title

#### Example: Self Link Relation
```http
GET /common/self HTTP/1.1
Host: api.relations.wrml.org

HTTP/1.1 200 OK
Content-Type: application/wrml;
  format="http://api.formats.wrml.org/application/json";
  schema="http://api.schemas.wrml.org/common/LinkRelation"

{
  "name": "self",
  "method": "GET",
  "description": "Signifies that the URI in the value of the href property identifies a resource equivalent to the containing resource."
}
```

### B.3 Rule: A consistent form should be used to advertise links

#### Links Structure
Representations should include a `links` structure containing all available links:

```json
{
  "firstName": "Osvaldo",
  "lastName": "Alonso",
  "links": {
    "self": {
      "href": "http://api.soccer.restapi.org/players/2113",
      "rel": "http://api.relations.wrml.org/common/self"
    },
    "parent": {
      "href": "http://api.soccer.restapi.org/players",
      "rel": "http://api.relations.wrml.org/common/parent"
    },
    "team": {
      "href": "http://api.soccer.restapi.org/teams/seattle",
      "rel": "http://api.relations.wrml.org/soccer/team"
    },
    "addToFavorites": {
      "href": "http://api.soccer.restapi.org/users/42/favorites/{name}",
      "rel": "http://api.relations.wrml.org/common/addToFavorites"
    }
  }
}
```

**Key Points:**
- `links` is a top-level field in JSON objects
- Link relation names (like `team`) can be hardcoded in clients
- URI templates with path variables used for store operations
- Link relation document URIs should not be hardcoded

### B.4 Rule: A self link should be included in response message body representations
- **Purpose**: Provide canonical URI for the resource
- **Benefits**: Helps with caching, bookmarking, and debugging
- **Implementation**: Include `self` link in all identifiable resource representations

### B.5 Rule: Minimize the number of advertised "entry point" API URIs
- **Principle**: Follow Web's home page concept
- **Strategy**: Provide single docroot URI with links to all other resources
- **Benefit**: Avoids tightly coupled clients that hardcode URIs

### B.6 Rule: Links should be used to advertise a resource's available actions in a state-sensitive manner

#### HATEOAS Principle
REST's HATEOAS constraint requires state-sensitive links. This addresses three problems with out-of-band documentation:
1. Insensitive to resource state
2. Available to developers, not client programs
3. Leads to tightly coupled clients

#### Example: State-Sensitive Actions
**Document with content selected:**
```json
{
  "links": {
    "self": {
      "href": "http://api.editor.restapi.org/docs/48679",
      "rel": "http://api.relations.wrml.org/common/self"
    },
    "cut": {
      "href": "http://api.editor.restapi.org/docs/48679/edit/cut",
      "rel": "http://api.relations.wrml.org/editor/edit/cut"
    },
    "copy": {
      "href": "http://api.editor.restapi.org/docs/48679/edit/copy",
      "rel": "http://api.relations.wrml.org/editor/edit/copy"
    }
  }
}
```

**Document with clipboard data available:**
```json
{
  "links": {
    "self": {
      "href": "http://api.editor.restapi.org/docs/48679",
      "rel": "http://api.relations.wrml.org/common/self"
    },
    "paste": {
      "href": "http://api.editor.restapi.org/docs/48679/edit/paste",
      "rel": "http://api.relations.wrml.org/editor/edit/paste"
    }
  }
}
```

---

## C. Media Type Representation

The `application/wrml` media type uses format and schema parameters with URI values that reference separate documents.

### C.1 Rule: A consistent form should be used to represent media type formats

#### WRML Format Structure
**Media Type:**
```
application/wrml;
format="http://api.formats.wrml.org/application/json";
schema="http://api.schemas.wrml.org/common/Format"
```

**JSON Structure:**
```json
{
  "mediaType": "Text <constrained by media type syntax>",
  "links": {
    "home": "Link <form constrained by the Link schema>",
    "rfc": "Link <form constrained by the Link schema>"
  },
  "serialize": {
    "links": {
      "<Set of Link schema-constrained forms>"
    }
  },
  "deserialize": {
    "links": {
      "<Set of Link schema-constrained forms>"
    }
  }
}
```

#### Example: JSON Format Document
```http
GET /application/json HTTP/1.1
Host: api.formats.wrml.org

HTTP/1.1 200 OK
Content-Type: application/wrml;
  format="http://api.formats.wrml.org/application/json";
  schema="http://api.schemas.wrml.org/common/Format"

{
  "mediaType": "application/json",
  "links": {
    "self": {
      "href": "http://api.formats.wrml.org/application/json",
      "rel": "http://api.relations.wrml.org/common/self"
    },
    "home": {
      "href": "http://www.json.org",
      "rel": "http://api.relations.wrml.org/common/home"
    },
    "rfc": {
      "href": "http://www.rfc-editor.org/rfc/rfc4627.txt",
      "rel": "http://api.relations.wrml.org/format/rfc"
    }
  },
  "serialize": {
    "links": {
      "java": {
        "href": "http://api.formats.wrml.org/application/json/serializers/java",
        "rel": "http://api.relations.wrml.org/format/serialize/java"
      },
      "php": {
        "href": "http://api.formats.wrml.org/application/json/serializers/php",
        "rel": "http://api.relations.wrml.org/format/serialize/php"
      }
    }
  },
  "deserialize": {
    "links": {
      "java": {
        "href": "http://api.formats.wrml.org/application/json/deserializers/java",
        "rel": "http://api.relations.wrml.org/format/deserialize/java"
      },
      "perl": {
        "href": "http://api.formats.wrml.org/application/json/deserializers/perl",
        "rel": "http://api.relations.wrml.org/format/deserialize/perl"
      }
    }
  }
}
```

### C.2 Rule: A consistent form should be used to represent media type schemas

#### Schema Overview
Schemas describe representation structure independent of format, providing contractual resource type definitions.

#### WRML Schema Structure
**Media Type:**
```
application/wrml;
format="http://api.formats.wrml.org/application/json";
schema="http://api.schemas.wrml.org/common/Schema"
```

**JSON Structure:**
```json
{
  "name": "Text <constrained to be mixed uppercase>",
  "version": "Integer",
  "extends": "Array <constrained to contain (schema) URI text elements>",
  "fields": {
    "<Set of Field schema-constrained forms>"
  },
  "stateFacts": "Array <constrained to contain mixed uppercase text elements>",
  "linkFormulas": {
    "<Set of LinkFormula schema-constrained forms>"
  },
  "description": "Text"
}
```

#### Field Types
1. **Boolean**: `true` or `false` (or `"true"`/`"false"` strings)
2. **Choice**: Text value from predefined menu (like enum)
3. **DateTime**: Date/time data (ISO 8601 format as string)
4. **Double**: 64-bit IEEE 754 floating point number
5. **Integer**: 32-bit signed integer
6. **List**: Linearly ordered homogeneous elements
7. **Schema**: Schema URI (indicates nested structure)
8. **Text**: Unicode character sequence
9. **null**: Blank value for any field type

#### Field Structure
```json
{
  "type": "Text <constrained to be one of the primitive field types>",
  "defaultValue": "<a type-specific value>",
  "readOnly": "Boolean",
  "required": "Boolean",
  "hidden": "Boolean",
  "constraints": "Array <constrained to contain (constraint) URI text elements>",
  "description": "Text"
}
```

#### Constraint Structure
```json
{
  "name": "Text",
  "validate": {
    "links": {
      "<Set of Link schema-constrained forms>"
    }
  }
}
```

#### Link Formula Structure
```json
{
  "rel": "Text <constrained by URI syntax>",
  "condition": "Text <constrained to be a state fact-based Boolean expression>"
}
```

#### Example: Document Schema
```http
GET /common/Document HTTP/1.1
Host: api.schemas.wrml.org

HTTP/1.1 200 OK
Content-Type: application/wrml;
  format="http://api.formats.wrml.org/application/json";
  schema="http://api.schemas.wrml.org/common/Document"

{
  "name": "Document",
  "version": 1,
  "stateFacts": ["Docroot", "Identifiable", "ReadOnly"],
  "linkFormulas": {
    "self": {
      "rel": "http://api.relations.wrml.org/common/self",
      "condition": "Identifiable"
    },
    "metadata": {
      "rel": "http://api.relations.wrml.org/common/metadata",
      "condition": "Identifiable"
    },
    "parent": {
      "rel": "http://api.relations.wrml.org/common/parent",
      "condition": "Identifiable and not Docroot"
    },
    "update": {
      "rel": "http://api.relations.wrml.org/common/update",
      "condition": "Identifiable and not ReadOnly"
    },
    "delete": {
      "rel": "http://api.relations.wrml.org/common/delete",
      "condition": "Identifiable and not Docroot"
    }
  },
  "description": "A resource archetype used to model a singular concept."
}
```

#### Example: Container Schema
```json
{
  "name": "Container",
  "version": 1,
  "extends": ["http://api.schemas.wrml.org/common/Document"],
  "fields": {
    "elements": {
      "type": "List",
      "description": "The paginated list of contained elements."
    },
    "size": {
      "type": "Integer",
      "description": "The total number of elements currently contained."
    },
    "pageSize": {
      "type": "Integer",
      "description": "The maximum number of elements returned per page."
    },
    "pageStartIndex": {
      "type": "Integer",
      "description": "The zero-based index of the page's first element."
    }
  },
  "stateFacts": ["Empty", "FirstPage", "LastPage", "Paginated"],
  "linkFormulas": {
    "delete": {
      "rel": "http://api.relations.wrml.org/common/delete",
      "condition": "Identifiable and not Docroot and Empty"
    },
    "next": {
      "rel": "http://api.relations.wrml.org/common/next",
      "condition": "(Identifiable and not Empty) and (Paginated and not LastPage)"
    },
    "previous": {
      "rel": "http://api.relations.wrml.org/common/previous",
      "condition": "(Identifiable and not Empty) and (Paginated and not FirstPage)"
    }
  },
  "description": "A base container of elements."
}
```

#### Example: Collection Schema
```json
{
  "name": "Collection",
  "version": 1,
  "extends": ["http://api.schemas.wrml.org/common/Container"],
  "linkFormulas": {
    "create": {
      "rel": "http://api.relations.wrml.org/common/create",
      "condition": "Identifiable and not ReadOnly"
    }
  },
  "description": "A resource archetype used to model a server-managed directory of resources."
}
```

#### Example: Store Schema
```json
{
  "name": "Store",
  "version": 1,
  "extends": ["http://api.schemas.wrml.org/common/Container"],
  "linkFormulas": {
    "insert": {
      "rel": "http://api.relations.wrml.org/common/insert",
      "condition": "Identifiable and not ReadOnly"
    }
  },
  "description": "A resource archetype used to model a client-managed resource repository."
}
```

---

## D. Error Representation

HTTP 4xx and 5xx error status codes should be augmented with client-readable information in the response body.

### D.1 Rule: A consistent form should be used to represent errors

#### WRML Error Structure
**Media Type:**
```
application/wrml;
format="http://api.formats.wrml.org/application/json";
schema="http://api.schemas.wrml.org/common/Error"
```

**JSON Structure:**
```json
{
  "id": "Text",
  "description": "Text"
}
```

**Fields:**
- `id` (required): Unique error type ID/code
- `description` (optional): Plain text description

### D.2 Rule: A consistent form should be used to represent error responses

#### WRML ErrorContainer Structure
**Media Type:**
```
application/wrml;
format="http://api.formats.wrml.org/application/json";
schema="http://api.schemas.wrml.org/common/ErrorContainer"
```

**JSON Structure:**
```json
{
  "elements": [
    {
      "id": "Update Failed",
      "description": "Failed to update /users/1234"
    }
  ]
}
```

**Features:**
- Extends Container schema
- Contains homogeneous list of Error forms
- Used with 4xx/5xx status codes

### D.3 Rule: Consistent error types should be used for common error conditions
- **Purpose**: Define generic error types once and share across APIs
- **Implementation**: Use schema extension for API-specific error types
- **Benefits**: Consistency and reusability

---

## E. Key Principles
1. **Use Standard Formats**: Support JSON and optionally other formats
2. **Include Hypermedia**: Use links to make APIs discoverable and state-sensitive
3. **Standardize Representations**: Use consistent formats across the API
4. **Handle Errors Gracefully**: Provide clear, consistent error messages
5. **Support Content Negotiation**: Allow clients to choose preferred formats
6. **Leverage WRML**: Use self-descriptive, versioned, and discoverable representations

---

## F. Canonical Examples

### F.1 Hypermedia Representation
```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "links": {
    "self": {
      "href": "/users/123",
      "rel": "http://api.relations.wrml.org/common/self"
    },
    "orders": {
      "href": "/users/123/orders",
      "rel": "http://api.relations.wrml.org/common/collection"
    },
    "edit": {
      "href": "/users/123",
      "rel": "http://api.relations.wrml.org/common/update",
      "method": "PUT"
    },
    "delete": {
      "href": "/users/123",
      "rel": "http://api.relations.wrml.org/common/delete",
      "method": "DELETE"
    }
  }
}
```

### F.2 Collection with Pagination
```json
{
  "elements": [
    {
      "id": 1,
      "name": "John Doe",
      "links": {
        "self": {
          "href": "/users/1",
          "rel": "http://api.relations.wrml.org/common/self"
        }
      }
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "links": {
        "self": {
          "href": "/users/2",
          "rel": "http://api.relations.wrml.org/common/self"
        }
      }
    }
  ],
  "links": {
    "self": {
      "href": "/users?page=1",
      "rel": "http://api.relations.wrml.org/common/self"
    },
    "next": {
      "href": "/users?page=2",
      "rel": "http://api.relations.wrml.org/common/next"
    },
    "create": {
      "href": "/users",
      "rel": "http://api.relations.wrml.org/common/create",
      "method": "POST"
    }
  },
  "size": 100,
  "pageSize": 20,
  "pageStartIndex": 0
}
```

### F.3 Error Response
```json
{
  "elements": [
    {
      "id": "VALIDATION_ERROR",
      "description": "Invalid input data"
    },
    {
      "id": "FIELD_ERROR",
      "description": "Email format is invalid"
    }
  ]
}
```

---

## G. Vocabulary Table

| Term | Description |
|------|-------------|
| Field | A named slot with some associated information that is stored in its value |
| Form | A structured representation that consists of the fields and links, which are defined by an associated schema |
| Format | Describes a form's presentation apart from its schematic |
| Link | An actionable reference to a resource |
| Link formula | A boolean expression that may serve as HATEOAS calculator's input in order to determine the availability of state-sensitive hypermedia within a form |
| Link relation | Describes a connection between two resources |
| Schema | Describes a representational form's structure independent of its format |
| State fact | A Boolean variable that communicates a condition that is relevant to some state-sensitive hypermedia |

---

## H. Review Questions
1. What are the main message body formats for REST APIs?
2. How do you represent links in hypermedia?
3. What are link relations and why are they important?
4. How do you handle error representation?
5. What's the purpose of self links?
6. How do you advertise available actions?
7. What are the benefits of hypermedia?
8. How do you represent media type schemas?
9. What are common error types?
10. How do you ensure consistent representation?
11. What is HATEOAS and why is it important?
12. How do link formulas work?
13. What are the different field types in WRML?
14. How does schema extension work?

---

## I. Key Concepts, Pros & Cons, Real-World Applications

### Key Concepts
- Use consistent formats for all representations
- Include hypermedia links for discoverability and state-sensitivity
- Provide clear, consistent error messages
- Support multiple formats through content negotiation
- Leverage WRML for self-descriptive, versioned representations

### Pros
- Consistent representation
- Discoverable APIs through hypermedia
- Clear error handling
- Flexible format support
- State-sensitive actions
- Self-descriptive messages

### Cons
- Increased response size
- More complex implementation
- Potential performance overhead
- Learning curve for WRML concepts

### Real-World Applications
- **GitHub API:** Comprehensive hypermedia links
- **HAL+JSON:** Standard hypermedia format
- **JSON:API:** Standardized API specification
- **Siren:** Rich hypermedia format
- **WRML:** Self-descriptive media type framework

---

## J. Practice Exercises

### Exercise 1: Design Hypermedia Representation
**Task:** Design hypermedia representation for a blog post resource with comments.

### Exercise 2: Error Handling Design
**Task:** Design consistent error representation for various error scenarios.

### Exercise 3: Schema Design
**Task:** Create a WRML schema for a user resource with appropriate fields and link formulas.

---

## K. Questions & Doubts

### Questions for Clarification
1. How do you handle complex nested resources in hypermedia?
2. What's the best approach for versioning representations?
3. How do you implement link formula evaluation?

### Areas Needing More Research
- Advanced hypermedia formats
- Schema validation strategies
- WRML implementation patterns

---

## L. Recap & Next Steps

### Key Takeaways
1. Use consistent formats for all representations
2. Include hypermedia links for discoverability and state-sensitivity
3. Provide clear, consistent error messages
4. Support multiple formats through content negotiation
5. Leverage WRML for self-descriptive, versioned representations
6. Implement HATEOAS for state-sensitive actions

### Next Steps
- [ ] Study client concerns and versioning
- [ ] Learn about security considerations
- [ ] Practice implementing hypermedia
- [ ] Explore WRML implementation patterns

---

*Notes taken on: [Date]*
*Pages covered: 47-70*
*Index System: A → L (Main sections), A.1 → L.2 (Subsections)*
