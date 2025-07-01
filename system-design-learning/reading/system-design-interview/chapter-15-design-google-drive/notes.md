# Chapter 15: Design Google Drive

## Key Concepts

### What is Google Drive?
- **Definition**: File storage and synchronization service
- **Purpose**: Store documents, photos, videos, and other files in the cloud
- **Access**: Any computer, smartphone, and tablet
- **Features**: File sharing with friends, family, and coworkers
- **Examples**: Google Drive, Dropbox, Microsoft OneDrive, Apple iCloud

### Core Functionality
- **Cloud Storage**: Files stored in the cloud with local access
- **Cross-Device Sync**: Automatic synchronization across multiple devices
- **File Sharing**: Collaborative access to files
- **Version Control**: File revision history

## Step 1: Understand the Problem and Establish Design Scope

### Interview Questions and Requirements
```
Candidate: What are the most important features?
Interviewer: Upload and download files, file sync, and notifications.

Candidate: Is this a mobile app, a web app, or both?
Interviewer: Both.

Candidate: What are the supported file formats?
Interviewer: Any file type.

Candidate: Do files need to be encrypted?
Interviewer: Yes, files in the storage must be encrypted.

Candidate: Is there a file size limit?
Interviewer: Yes, files must be 10 GB or smaller.

Candidate: How many users does the product have?
Interviewer: 10M DAU.
```

### System Requirements
- **Core Features**: Upload/download files, file sync, notifications
- **Platforms**: Mobile app and web app
- **File Types**: Any file format supported
- **Security**: File encryption required
- **Size Limit**: 10 GB maximum file size
- **Scale**: 10 million DAU

### Focus Features
- Add files (drag and drop)
- Download files
- Sync files across multiple devices
- See file revisions
- Share files with others
- Send notifications for file changes

### Non-Functional Requirements
- **Reliability**: Data loss is unacceptable
- **Fast Sync Speed**: Quick file synchronization
- **Bandwidth Efficiency**: Minimize unnecessary network usage
- **Scalability**: Handle high traffic volumes
- **High Availability**: System remains accessible during failures

## Back of the Envelope Estimation

### Storage and Traffic Calculation
- **Users**: 50 million signed up, 10 million DAU
- **Free Space**: 10 GB per user
- **Uploads**: 2 files per day per user
- **Average File Size**: 500 KB
- **Read/Write Ratio**: 1:1

### Storage Requirements
- **Total Allocated Space**: 50M × 10 GB = 500 Petabyte
- **Daily Uploads**: 10M × 2 files × 500 KB = 10 GB/day

### Traffic Requirements
- **Upload QPS**: 10M × 2 uploads / 24h / 3600s = ~240 QPS
- **Peak QPS**: 240 × 2 = 480 QPS

## Step 2: Propose High-Level Design and Get Buy-in

### Evolution from Single Server

#### Initial Single Server Setup
- **Web Server**: Apache for upload/download
- **Database**: MySQL for metadata
- **Storage**: 1TB directory structure
- **File Organization**: Namespace-based directory structure

#### File Organization Example
```
/drive/
├── user1/
│   ├── documents/
│   │   └── report.pdf
│   └── photos/
│       └── vacation.jpg
└── user2/
    └── work/
        └── presentation.pptx
```

### API Design

#### 1. Upload File API
**Two Upload Types**:
- **Simple Upload**: For small files
- **Resumable Upload**: For large files with network interruption risk

**Resumable Upload Process**:
1. Send initial request to get resumable URL
2. Upload data and monitor state
3. Resume upload if interrupted

**API Example**:
```
POST https://api.example.com/files/upload?uploadType=resumable
Params: uploadType=resumable, data: local file
```

#### 2. Download File API
**API Example**:
```
GET https://api.example.com/files/download
Params: {"path": "/recipes/soup/best_soup.txt"}
```

#### 3. Get File Revisions API
**API Example**:
```
GET https://api.example.com/files/list_revisions
Params: {"path": "/recipes/soup/best_soup.txt", "limit": 20}
```

### Scaling from Single Server

#### Problem: Storage Space Full
- **Issue**: Only 10 MB left, users can't upload
- **Solution**: Database sharding based on user_id

#### Problem: Data Loss Risk
- **Solution**: Migrate to Amazon S3
- **Benefits**: Industry-leading scalability, availability, security
- **Replication**: Same-region and cross-region replication

#### Additional Improvements
- **Load Balancer**: Distribute traffic, handle server failures
- **Web Servers**: Horizontal scaling based on traffic
- **Metadata Database**: Separate from server, add replication and sharding
- **File Storage**: S3 with geographic replication

### Sync Conflicts Resolution

#### Conflict Strategy
- **First-Wins Policy**: First processed version wins
- **Conflict Detection**: Later versions receive conflict status
- **User Resolution**: Present both versions for manual merge/override

#### Example Conflict Scenario
1. **User 1** and **User 2** modify same file simultaneously
2. **User 1's** update processed first → succeeds
3. **User 2's** update processed second → gets conflict
4. **System** presents both versions to User 2
5. **User 2** chooses to merge or override

### High-Level System Architecture

#### Components

##### 1. User
- **Access**: Browser or mobile app
- **Function**: File management interface

##### 2. Block Servers
- **Purpose**: Upload blocks to cloud storage
- **Function**: File splitting, compression, encryption
- **Block Size**: 4MB maximum (Dropbox reference)

##### 3. Cloud Storage
- **Purpose**: Store file blocks
- **Technology**: Amazon S3 or similar
- **Benefits**: Scalability, durability, availability

##### 4. Cold Storage
- **Purpose**: Store inactive data
- **Use Case**: Long-term archival storage

##### 5. Load Balancer
- **Purpose**: Distribute requests among API servers
- **Function**: Traffic management, failover

##### 6. API Servers
- **Purpose**: Handle everything except upload flow
- **Functions**: Authentication, user profiles, metadata management

##### 7. Metadata Database
- **Purpose**: Store file metadata, user data, blocks, versions
- **Note**: Files stored in cloud, only metadata in database

##### 8. Metadata Cache
- **Purpose**: Fast metadata retrieval
- **Technology**: Distributed cache

##### 9. Notification Service
- **Purpose**: Publisher/subscriber system for file changes
- **Function**: Notify clients of file modifications

##### 10. Offline Backup Queue
- **Purpose**: Store changes for offline clients
- **Function**: Sync when client comes online

## Step 3: Design Deep Dive

### Block Servers

#### Optimizations for Large Files

##### 1. Delta Sync
- **Problem**: Large files updated regularly consume bandwidth
- **Solution**: Only sync modified blocks
- **Algorithm**: Sync algorithm to identify changed blocks
- **Benefit**: Significant bandwidth reduction

##### 2. Compression
- **Strategy**: Compress blocks based on file type
- **Text Files**: gzip, bzip2
- **Images/Videos**: Specialized compression algorithms
- **Benefit**: Reduced data size

#### Block Server Workflow

##### New File Upload
1. **Split**: File split into smaller blocks
2. **Compress**: Each block compressed
3. **Encrypt**: Blocks encrypted for security
4. **Upload**: Blocks uploaded to cloud storage

##### Delta Sync Process
- **Identify Changes**: Only modified blocks (e.g., "block 2" and "block 5")
- **Upload Changes**: Only changed blocks transferred
- **Reconstruct**: File reconstructed from blocks

### High Consistency Requirements

#### Strong Consistency Model
- **Requirement**: Files must appear identical across all clients
- **Challenge**: Memory caches use eventual consistency by default

#### Consistency Strategy
- **Cache-Database Sync**: Ensure cache replicas and master are consistent
- **Cache Invalidation**: Invalidate caches on database writes
- **Database Choice**: Relational databases for ACID properties

#### ACID Properties
- **Atomicity**: All operations succeed or fail together
- **Consistency**: Database remains in valid state
- **Isolation**: Concurrent transactions don't interfere
- **Durability**: Committed transactions persist

### Metadata Database Schema

#### Core Tables

##### 1. User Table
- **Fields**: username, email, profile_photo
- **Purpose**: Basic user information

##### 2. Device Table
- **Fields**: device_info, push_id
- **Purpose**: Device management for notifications
- **Note**: One user can have multiple devices

##### 3. Namespace Table
- **Purpose**: Root directory for each user
- **Function**: User file organization

##### 4. File Table
- **Purpose**: Latest file information
- **Fields**: file metadata, status, path

##### 5. File_Version Table
- **Purpose**: File revision history
- **Constraint**: Existing rows are read-only
- **Function**: Maintain version integrity

##### 6. Block Table
- **Purpose**: File block information
- **Function**: Reconstruct any file version
- **Process**: Join blocks in correct order

### Upload Flow

#### Parallel Requests
Two requests sent simultaneously from client:

##### Request 1: Add File Metadata
1. **Client** sends metadata request
2. **API Server** stores metadata in database
3. **Status** set to "pending"
4. **Notification** sent to notification service
5. **Clients** notified of new file upload

##### Request 2: Upload File Content
1. **Client** uploads file to block servers
2. **Block Servers** process file (split, compress, encrypt)
3. **Cloud Storage** receives blocks
4. **Callback** triggered to API servers
5. **Status** changed to "uploaded"
6. **Notification** sent to relevant clients

### Download Flow

#### Change Detection
**Two Methods**:
1. **Online Detection**: Notification service informs client
2. **Offline Detection**: Changes cached, synced when online

#### Download Process
1. **Notification**: Client informed of file changes
2. **Metadata Request**: Client requests updated metadata
3. **API Call**: API servers fetch metadata from database
4. **Metadata Response**: Updated metadata returned
5. **Block Download**: Client requests blocks from block servers
6. **Cloud Storage**: Block servers fetch from cloud storage
7. **File Reconstruction**: Client reconstructs file from blocks

### Notification Service

#### Communication Options

##### 1. Long Polling (Chosen)
- **Implementation**: Dropbox uses this approach
- **Process**: Client establishes long connection, server responds on changes
- **Benefits**: Simple, suitable for infrequent notifications

##### 2. WebSocket (Alternative)
- **Features**: Persistent bi-directional connection
- **Use Case**: Real-time communication
- **Drawback**: Overkill for file notifications

#### Long Polling Workflow
1. **Client** establishes long poll connection
2. **Server** holds connection until changes detected
3. **Connection Close**: Client notified of changes
4. **Metadata Download**: Client fetches latest changes
5. **New Connection**: Client immediately establishes new connection

### Save Storage Space

#### Three Optimization Techniques

##### 1. Data Deduplication
- **Strategy**: Eliminate redundant blocks at account level
- **Method**: Compare hash values of blocks
- **Benefit**: Significant space savings

##### 2. Intelligent Backup Strategy
**Two Approaches**:
- **Version Limits**: Set maximum number of versions per file
- **Valuable Versions**: Keep only important versions, weight recent ones higher

##### 3. Cold Storage Migration
- **Target**: Infrequently accessed data (months/years old)
- **Storage**: Amazon S3 Glacier (much cheaper)
- **Benefit**: Cost reduction for archival data

### Failure Handling

#### Component-Specific Error Handling

##### Load Balancer Failure
- **Strategy**: Secondary load balancer becomes active
- **Monitoring**: Heartbeat between load balancers
- **Failover**: Automatic traffic redirection

##### Block Server Failure
- **Strategy**: Other servers pick up pending jobs
- **Recovery**: Automatic job redistribution

##### Cloud Storage Failure
- **Strategy**: S3 buckets replicated across regions
- **Fallback**: Fetch files from different regions
- **Redundancy**: Geographic distribution

##### API Server Failure
- **Strategy**: Stateless service, traffic redirected
- **Load Balancer**: Routes to healthy servers
- **Scaling**: Easy horizontal scaling

##### Metadata Cache Failure
- **Strategy**: Multiple replicated cache nodes
- **Fallback**: Access other cache nodes
- **Recovery**: Bring up new cache server

##### Metadata Database Failure
**Master Down**:
- **Strategy**: Promote slave to master
- **Recovery**: Bring up new slave node

**Slave Down**:
- **Strategy**: Use other slaves for reads
- **Recovery**: Replace failed slave

##### Notification Service Failure
- **Challenge**: 1+ million connections per machine (Dropbox 2012)
- **Impact**: All long poll connections lost
- **Recovery**: Slow reconnection process
- **Strategy**: Gradual client reconnection

##### Offline Backup Queue Failure
- **Strategy**: Multiple replicated queues
- **Recovery**: Re-subscribe to backup queue
- **Redundancy**: Queue replication

## Step 4: Wrap Up

### System Summary
- **Architecture**: Block-based file storage with cloud integration
- **Key Features**: Strong consistency, delta sync, compression
- **Scale**: 10M DAU, 500 PB storage, 480 peak QPS
- **Core Flows**: Metadata management and file synchronization

### Design Trade-offs

#### Alternative: Direct Cloud Upload
**Advantages**:
- **Speed**: File transferred once to cloud storage
- **Efficiency**: Eliminates block server hop

**Disadvantages**:
- **Platform Complexity**: Implement chunking/compression/encryption on multiple platforms
- **Security Risk**: Encryption logic on client side (vulnerable to hacking)
- **Maintenance**: Error-prone, requires significant engineering effort

#### Alternative: Separate Presence Service
**Evolution**: Move online/offline logic to dedicated service
**Benefits**:
- **Modularity**: Easier integration with other services
- **Separation of Concerns**: Cleaner architecture
- **Scalability**: Independent scaling of presence functionality

### Key Metrics
- **Sync Speed**: Time to synchronize file changes
- **Bandwidth Usage**: Network efficiency metrics
- **Storage Efficiency**: Deduplication and compression ratios
- **Availability**: System uptime and reliability
- **Conflict Resolution**: Sync conflict frequency and resolution time

### Technical Specifications
- **Block Size**: 4MB maximum (Dropbox reference)
- **File Size Limit**: 10 GB per file
- **Encryption**: Required for all stored files
- **Consistency**: Strong consistency model
- **Storage**: Cloud storage with geographic replication
- **Notifications**: Long polling for change detection

---

*Next: Chapter 16 - The Learning Path*
