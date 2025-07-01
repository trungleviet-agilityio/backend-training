# Backend Training

This repository contains comprehensive training materials and practice projects for backend development, covering Docker, Django/Flask applications, REST API design, database design, and system architecture.

## 📚 Learning Paths

### 1. 🐳 Docker Learning
A comprehensive collection of Docker learning materials and hands-on practice projects.

**Practice Projects:**
- **[Docker Flask Practice](docker-learning/practice/docker-flask-practice/)** - Learn Docker fundamentals with a simple Flask app
  - Basic container operations
  - Docker networking
  - Volume management
  - Container lifecycle

- **[Docker Compose Practice](docker-learning/practice/docker-compose-practice/)** - Production-ready multi-container application
  - Flask + Redis + Nginx setup
  - Service orchestration
  - Environment management
  - Development vs production configurations

**Shared Resources:**
- [Docker Basics](docker-learning/shared/docker/) - Docker fundamentals
- [Docker Compose](docker-learning/shared/docker-compose/) - Docker Compose guides

### 2. 🚀 Docker Practice (Django)
A Django-based project demonstrating production-ready Docker containerization and development workflow.

**Key Features:**
- Django REST framework with comprehensive API
- Docker containerization with best practices
- Code quality tools (Ruff, Black, isort)
- Pre-commit hooks and GPG commit signing
- Automated CI/CD with PythonAnywhere deployment
- Book management system with authors, categories, and relationships

[View Project →](docker-practice/README.md)

### 3. 🔌 REST API Design Learning
Master REST API design principles, best practices, and implementation patterns.

**Core Resources:**
- **"REST API Design Rulebook"** by Mark Masse - Complete chapter-by-chapter notes
- **"Web API Design: Crafting Interfaces that Developers Love"** by Brian Mulloy
- **"RESTful Web Services"** by Leonard Richardson & Sam Ruby

**Key Concepts Covered:**
- REST architectural principles and constraints
- HTTP methods, status codes, and semantics
- Resource-oriented design and URI patterns
- Hypermedia and HATEOAS implementation
- API versioning strategies
- Authentication, authorization, and security
- Error handling and validation
- Client concerns and JavaScript support

**Practice Project:** Design and implement a complete RESTful API with advanced features

[View Learning Path →](restapi-design-learning/README.md)

### 4. 🗄️ Database Learning
Comprehensive database design and SQL learning path with hands-on practice.

**Theory (Reading):**
- **"Database Design for Mere Mortals"** - Complete chapter notes
- DBMS fundamentals and architecture
- Relational database design and normalization
- SQL operations and advanced queries
- Database administration and optimization

**Practice Project: TV Company Database**
- Complete ERD and schema design
- SQL scripts for tables, constraints, and business rules
- Dockerized PostgreSQL setup
- Mock data generation (1000+ records)
- Real-world business queries and solutions
- Comprehensive documentation

[View Learning Path →](database-learning/README.md)

### 5. 🏗️ System Design Learning
Master system architecture, scalability, and design patterns for building large-scale applications.

**Core Resources:**
- **"Become an Awesome Software Architect"** by Anatoly Volkhover - Complete chapter notes
- **"System Design Interview"** by Alex Xu - Interview preparation and real-world patterns
- **System Design Guide** by Karan Pratap Singh

**Key Concepts Covered:**
- System architecture patterns and principles
- Scalability and performance optimization
- RESTful API design rules
- Load balancing and distributed systems
- Caching strategies and data storage
- Real-time communication and messaging

**Practice Projects:**
- **[URL Shortener](system-design-learning/demo/url-shortener/)** - Hash functions, caching, analytics
- **[Chat System](system-design-learning/demo/chat-system/)** - WebSockets, real-time communication
- **[File Upload Service](system-design-learning/demo/file-upload-service/)** - Cloud storage, synchronization
- **[Notification System](system-design-learning/demo/notification-system/)** - Message queues, third-party integrations

[View Learning Path →](system-design-learning/README.md)

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd backend-training
   ```

2. **Choose your learning path:**
   - **Docker fundamentals**: Start with `docker-learning/practice/docker-flask-practice/`
   - **Docker production**: Try `docker-learning/practice/docker-compose-practice/`
   - **Django with Docker**: Explore `docker-practice/`
   - **REST API design**: Study `restapi-design-learning/reading/`
   - **Database design**: Begin with `database-learning/reading/`
   - **System design**: Start with `system-design-learning/demo/url-shortener/`

3. **Follow the specific project's README for detailed setup instructions.**

## 📋 Learning Recommendations

### For Beginners
1. Start with **Docker Flask Practice** to learn container basics
2. Move to **Database Learning** for data modeling fundamentals
3. Study **REST API Design** for API principles
4. Practice with **Docker Compose** for multi-service applications
5. Build the **Django Docker Practice** project
6. Begin **System Design** with URL Shortener project

### For Intermediate Developers
1. Focus on **REST API Design** advanced concepts
2. Master **Docker Compose Practice** production patterns
3. Implement complex **Database Learning** scenarios
4. Contribute to **Django Docker Practice** with new features
5. Build **System Design** projects (Notification System, File Upload)

### For Advanced Developers
1. Design custom REST APIs using learned principles
2. Create production-ready Docker architectures
3. Optimize database designs for performance
4. Master **System Design** with Chat System and complex architectures
5. Mentor others through the learning paths

## 🛠️ Technology Stack

- **Containerization**: Docker, Docker Compose
- **Backend Frameworks**: Django, Flask
- **Databases**: PostgreSQL, Redis, MongoDB
- **API Design**: REST principles, OpenAPI/Swagger, GraphQL
- **System Design**: Microservices, load balancing, caching
- **Real-time**: WebSockets, message queues (Redis, RabbitMQ, Kafka)
- **Code Quality**: Ruff, Black, isort, pre-commit hooks
- **Testing**: pytest, Django test framework
- **Documentation**: Comprehensive READMEs, API docs, ERDs, architecture diagrams

## 📝 License

This project is created from Trung with love.
