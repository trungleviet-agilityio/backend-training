# Chapter 14: Design YouTube

## Key Concepts

### What is YouTube?
- **Definition**: Video streaming and sharing platform
- **Scale**: 2 billion monthly active users, 5 billion videos watched per day
- **Revenue**: $15.1 billion in 2019 (36% growth from 2018)
- **Traffic**: 37% of all mobile internet traffic
- **Global Reach**: Available in 80 languages, 73% of US adults use YouTube
- **Creators**: 50 million content creators

### System Complexity
- **Simple Interface**: Upload videos, click play
- **Complex Backend**: Massive scale, global distribution, real-time processing
- **Multi-Platform**: Mobile apps, web browsers, smart TVs

## Step 1: Understand the Problem and Establish Design Scope

### Interview Questions and Requirements
```
Candidate: What features are important?
Interviewer: Ability to upload a video and watch a video.

Candidate: What clients do we need to support?
Interviewer: Mobile apps, web browsers, and smart TV.

Candidate: How many daily active users do we have?
Interviewer: 5 million

Candidate: What is the average daily time spent on the product?
Interviewer: 30 minutes.

Candidate: Do we need to support international users?
Interviewer: Yes, a large percentage of users are international users.

Candidate: What are the supported video resolutions?
Interviewer: The system accepts most of the video resolutions and formats.

Candidate: Is encryption required?
Interviewer: Yes

Candidate: Any file size requirement for videos?
Interviewer: Our platform focuses on small and medium-sized videos. The maximum allowed video size is 1GB.

Candidate: Can we leverage some of the existing cloud infrastructures provided by Amazon, Google, or Microsoft?
Interviewer: That is a great question. Building everything from scratch is unrealistic for most companies, it is recommended to leverage some of the existing cloud services.
```

### System Requirements
- **Core Features**: Video upload and streaming
- **Platforms**: Mobile apps, web browsers, smart TVs
- **Scale**: 5 million DAU
- **Usage**: 30 minutes average daily time
- **Global**: International user support
- **Video**: Multiple resolutions and formats
- **Security**: Encryption required
- **Size Limit**: 1GB maximum video size
- **Infrastructure**: Leverage cloud services

### Focus Features
- Fast video uploading
- Smooth video streaming
- Video quality adaptation
- Low infrastructure cost
- High availability, scalability, reliability
- Multi-platform client support

## Back of the Envelope Estimation

### Storage Calculation
- **Users**: 5 million DAU
- **Videos per User**: 5 videos watched per day
- **Uploaders**: 10% of users upload 1 video per day
- **Average Video Size**: 300 MB
- **Daily Storage**: 5M × 10% × 300 MB = 150 TB

### CDN Cost Estimation
- **CDN Provider**: Amazon CloudFront
- **Cost per GB**: $0.02 (US region)
- **Daily Video Streaming**: 5M × 5 videos × 0.3GB × $0.02 = $150,000/day
- **Annual Cost**: ~$54.75 million

### Key Insights
- **CDN Cost**: Major expense (~$150K/day)
- **Storage Growth**: 150 TB daily uploads
- **Scale Challenge**: Massive data transfer requirements

## Step 2: Propose High-Level Design and Get Buy-in

### Why Leverage Cloud Services?
- **Time Constraint**: System design interviews focus on architecture, not implementation details
- **Complexity**: Building scalable blob storage or CDN is extremely complex
- **Cost**: Even large companies (Netflix, Facebook) use cloud services
- **Examples**: Netflix uses Amazon cloud, Facebook uses Akamai CDN

### Three Main Components

#### 1. Client
- **Platforms**: Computer, mobile phone, smart TV
- **Function**: Video playback and user interface

#### 2. CDN
- **Purpose**: Video storage and delivery
- **Function**: Stream videos directly to clients
- **Benefit**: Low latency, global distribution

#### 3. API Servers
- **Purpose**: Handle everything except video streaming
- **Functions**: Feed recommendations, upload URLs, metadata updates, user management

### Video Uploading Flow

#### Components
- **User**: Multi-device access (computer, mobile, smart TV)
- **Load Balancer**: Distribute requests among API servers
- **API Servers**: Handle all non-streaming requests
- **Metadata DB**: Store video metadata (sharded and replicated)
- **Metadata Cache**: Cache video metadata and user objects
- **Original Storage**: Blob storage for original videos
- **Transcoding Servers**: Convert video formats and resolutions
- **Transcoded Storage**: Blob storage for processed videos
- **CDN**: Cache and distribute videos globally
- **Completion Queue**: Message queue for transcoding events
- **Completion Handler**: Workers that update metadata after transcoding

#### Two Parallel Processes

##### Process A: Upload Actual Video
1. **Upload**: Videos uploaded to original storage
2. **Transcode**: Transcoding servers fetch and process videos
3. **Parallel Steps** (after transcoding):
   - **3a**: Transcoded videos sent to transcoded storage
   - **3b**: Completion events queued
   - **3a.1**: Videos distributed to CDN
   - **3b.1**: Completion handler updates metadata
4. **Notification**: API servers inform client of successful upload

##### Process B: Update Metadata
- **Parallel Request**: Client sends metadata while video uploads
- **Content**: File name, size, format, user info
- **Update**: API servers update cache and database

### Video Streaming Flow

#### Streaming Protocols
- **MPEG-DASH**: Dynamic Adaptive Streaming over HTTP
- **Apple HLS**: HTTP Live Streaming
- **Microsoft Smooth Streaming**
- **Adobe HDS**: HTTP Dynamic Streaming

#### Streaming Process
- **Direct CDN**: Videos streamed directly from CDN
- **Edge Servers**: Closest server delivers video
- **Low Latency**: Minimal network delay
- **Adaptive Quality**: Automatic quality adjustment based on bandwidth

## Step 3: Design Deep Dive

### Video Transcoding

#### Why Transcoding is Important
- **Storage Efficiency**: Raw videos consume massive space (hundreds of GB for 1-hour HD)
- **Device Compatibility**: Different devices support different formats
- **Bandwidth Adaptation**: Deliver appropriate quality based on network conditions
- **Network Resilience**: Switch quality automatically for smooth playback

#### Video Components
- **Container**: File wrapper (e.g., .avi, .mov, .mp4)
- **Codecs**: Compression algorithms (H.264, VP9, HEVC)

### Directed Acyclic Graph (DAG) Model

#### Purpose
- **Flexibility**: Support different video processing pipelines
- **Parallelism**: Execute tasks sequentially or in parallel
- **Abstraction**: Let programmers define processing tasks
- **Example**: Facebook's streaming video engine

#### DAG Tasks
- **Inspection**: Quality check and format validation
- **Video Encoding**: Convert to different resolutions, codecs, bitrates
- **Thumbnail Generation**: User-uploaded or auto-generated
- **Watermarking**: Image overlay with identifying information

### Video Transcoding Architecture

#### Six Main Components

##### 1. Preprocessor
**Responsibilities**:
- **Video Splitting**: Split into Group of Pictures (GOP) alignment
- **Legacy Support**: Handle old devices that don't support splitting
- **DAG Generation**: Create DAG from configuration files
- **Data Caching**: Store GOPs and metadata in temporary storage

##### 2. DAG Scheduler
- **Function**: Split DAG into stages and queue tasks
- **Process**: Organize tasks into sequential stages
- **Example**: Stage 1 (split video/audio/metadata) → Stage 2 (encoding/thumbnail)

##### 3. Resource Manager
**Components**:
- **Task Queue**: Priority queue of tasks to execute
- **Worker Queue**: Priority queue of worker utilization info
- **Running Queue**: Currently running tasks and workers
- **Task Scheduler**: Optimal task/worker assignment

**Workflow**:
1. Get highest priority task
2. Select optimal worker
3. Execute task
4. Update running queue
5. Remove completed job

##### 4. Task Workers
- **Function**: Execute DAG-defined tasks
- **Specialization**: Different workers for different tasks
- **Parallelism**: Multiple workers can run simultaneously

##### 5. Temporary Storage
- **Purpose**: Store intermediate processing data
- **Strategy**: Choose storage based on data type, size, access frequency
- **Examples**: Memory cache for metadata, blob storage for video/audio
- **Cleanup**: Free data after processing completion

##### 6. Encoded Video Output
- **Format**: Final processed video files
- **Example**: `funny_720p.mp4`

### System Optimizations

#### Speed Optimizations

##### 1. Parallel Video Uploading
- **Strategy**: Split video into GOP-aligned chunks
- **Benefit**: Fast resumable uploads
- **Implementation**: Client-side splitting for speed improvement

##### 2. Global Upload Centers
- **Strategy**: Multiple upload centers worldwide
- **Examples**: North America center, Asian center
- **Implementation**: Use CDN as upload centers

##### 3. High Parallelism
- **Challenge**: Sequential dependencies limit parallelism
- **Solution**: Message queues for loose coupling
- **Benefit**: Independent task execution

#### Safety Optimizations

##### 1. Pre-signed Upload URLs
**Process**:
1. Client requests pre-signed URL from API servers
2. API servers respond with authorized URL
3. Client uploads video using pre-signed URL

**Benefits**:
- **Security**: Only authorized users can upload
- **Cloud Compatibility**: Works with Amazon S3, Azure Blob Storage

##### 2. Video Protection
**Options**:
- **DRM Systems**: Apple FairPlay, Google Widevine, Microsoft PlayReady
- **AES Encryption**: Encrypt videos with authorization policies
- **Visual Watermarking**: Image overlay with identifying information

#### Cost-Saving Optimizations

##### Long-Tail Distribution Strategy
**Observation**: YouTube follows long-tail distribution (few popular videos, many unpopular)

**Optimizations**:
1. **Popular Content**: Serve from CDN
2. **Less Popular**: Serve from high-capacity storage servers
3. **On-Demand Encoding**: Short videos encoded when requested
4. **Regional Distribution**: Popular videos only distributed to relevant regions
5. **Custom CDN**: Build own CDN like Netflix, partner with ISPs

### Error Handling

#### Error Types
- **Recoverable Errors**: Retry operations (e.g., transcoding failures)
- **Non-Recoverable Errors**: Stop and return error codes (e.g., malformed video)

#### Component-Specific Error Handling

##### Upload Errors
- **Strategy**: Retry a few times
- **Fallback**: Server-side splitting for old clients

##### Transcoding Errors
- **Strategy**: Retry operation
- **Monitoring**: Track failure patterns

##### System Component Errors
- **Preprocessor**: Regenerate DAG diagram
- **DAG Scheduler**: Reschedule tasks
- **Resource Manager**: Use replica queues
- **Task Workers**: Retry on new worker
- **API Servers**: Stateless, redirect to different server
- **Metadata Cache**: Use replicated nodes
- **Metadata DB**: Master/slave failover

## Step 4: Wrap Up

### System Summary
- **Architecture**: Three-tier (Client, CDN, API Servers)
- **Core Flows**: Video uploading and streaming
- **Key Technology**: DAG-based video transcoding
- **Scale**: 5M DAU, 150TB daily storage, $150K daily CDN cost

### Additional Talking Points

#### API Tier Scaling
- **Strategy**: Horizontal scaling (stateless servers)
- **Benefit**: Easy to add/remove servers

#### Database Scaling
- **Techniques**: Replication and sharding
- **Considerations**: Read/write patterns, data distribution

#### Live Streaming
**Similarities with VOD**:
- Upload, encoding, streaming processes

**Key Differences**:
- **Latency**: Higher requirements for live streaming
- **Parallelism**: Lower requirements (real-time processing)
- **Error Handling**: Time-sensitive error recovery

#### Video Takedowns
- **Content Moderation**: Copyright, pornography, illegal content
- **Detection Methods**: Upload-time scanning, user flagging
- **Compliance**: Legal and policy requirements

### Key Metrics
- **Upload Speed**: Time to complete video upload
- **Streaming Quality**: Adaptive bitrate performance
- **CDN Cost**: Data transfer expenses
- **Transcoding Time**: Video processing duration
- **Error Rates**: System reliability metrics

### Technical Specifications
- **Video Formats**: Multiple resolutions and codecs
- **Storage**: Blob storage for videos, relational DB for metadata
- **CDN**: Global distribution network
- **Processing**: DAG-based transcoding pipeline
- **Security**: Pre-signed URLs, encryption, DRM

---

*Next: Chapter 15 - Design Google Drive*
