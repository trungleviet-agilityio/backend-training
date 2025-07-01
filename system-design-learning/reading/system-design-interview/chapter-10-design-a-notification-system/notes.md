# Chapter 10: Design a Notification System

## Key Concepts

### What is a Notification System?
- **Definition**: System that alerts users with important information
- **Types**: Breaking news, product updates, events, offerings
- **Importance**: Indispensable part of daily life
- **Popularity**: Very popular feature for many applications

### Notification Formats
- **Mobile Push Notification**: Real-time alerts on mobile devices
- **SMS Message**: Text messages to phone numbers
- **Email**: Electronic mail messages
- **Scope**: More than just mobile push notifications

## Step 1: Understand the Problem and Establish Design Scope

### Interview Questions and Requirements
```
Candidate: What types of notifications does the system support?
Interviewer: Push notification, SMS message, and email.

Candidate: Is it a real-time system?
Interviewer: Let us say it is a soft real-time system. We want a user to receive notifications as soon as possible. However, if the system is under a high workload, a slight delay is acceptable.

Candidate: What are the supported devices?
Interviewer: iOS devices, android devices, and laptop/desktop.

Candidate: What triggers notifications?
Interviewer: Notifications can be triggered by client applications. They can also be scheduled on the server-side.

Candidate: Will users be able to opt-out?
Interviewer: Yes, users who choose to opt-out will no longer receive notifications.

Candidate: How many notifications are sent out each day?
Interviewer: 10 million mobile push notifications, 1 million SMS messages, and 5 million emails.
```

### System Requirements
- **Scale**: Millions of notifications per day
- **Real-time**: Soft real-time (as soon as possible, slight delay acceptable under high workload)
- **Devices**: iOS, Android, laptop/desktop
- **Triggers**: Client applications and server-side scheduling
- **User Control**: Opt-out capability
- **Volume**: 16 million total notifications per day

## Step 2: Propose High-Level Design and Get Buy-in

### Different Types of Notifications

#### iOS Push Notification
**Components**:
- **Provider**: Builds and sends notification requests to APNS
  - Device token: Unique identifier for sending push notifications
  - Payload: JSON dictionary containing notification payload
- **APNS**: Apple Push Notification Service (remote service)
- **iOS Device**: End client receiving push notifications

#### Android Push Notification
- **Similar Flow**: Adopts similar notification flow to iOS
- **Service**: Firebase Cloud Messaging (FCM) instead of APNS
- **Usage**: Commonly used for Android push notifications

#### SMS Message
- **Third-party Services**: Twilio, Nexmo, and other commercial services
- **Implementation**: Most are commercial services
- **Popularity**: Widely used for SMS delivery

#### Email
- **Options**: Companies can set up own email servers or use commercial services
- **Popular Services**: Sendgrid, Mailchimp
- **Benefits**: Better delivery rate and data analytics

### Contact Info Gathering Flow

#### Process
1. **User Installation/Signup**: When user installs app or signs up for first time
2. **API Collection**: API servers collect user contact info
3. **Database Storage**: Store contact info in database

#### Database Design
- **User Table**: Store email addresses and phone numbers
- **Device Table**: Store device tokens
- **Relationship**: User can have multiple devices
- **Benefit**: Push notification can be sent to all user devices

### Notification Sending/Receiving Flow

#### Initial Design
**Components**:
- **Service 1 to N**: Micro-services, cron jobs, or distributed systems that trigger notification events
  - Examples: Billing service sending payment reminders, shopping website sending delivery notifications
- **Notification System**: Centerpiece for sending/receiving notifications
  - Single notification server
  - Provides APIs for services
  - Builds notification payloads for third-party services
- **Third-party Services**: Responsible for delivering notifications to users
- **End Devices**: iOS, Android, SMS, Email recipients

#### Problems with Initial Design
1. **Single Point of Failure (SPOF)**: Single notification server creates SPOF
2. **Hard to Scale**: Everything handled in one server, difficult to scale independently
3. **Performance Bottleneck**: Resource intensive processing can cause system overload

#### Improved High-Level Design
**Optimizations**:
- Move database and cache out of notification server
- Add more notification servers with automatic horizontal scaling
- Introduce message queues to decouple system components

**Components**:
- **Service 1 to N**: Different services sending notifications via APIs
- **Notification Servers**:
  - Provide APIs for services (internal/verified clients only)
  - Basic validations (emails, phone numbers)
  - Query database/cache for notification data
  - Put notification data to message queues
- **Cache**: User info, device info, notification templates
- **DB**: User, notification, settings data
- **Message Queues**: Remove dependencies, serve as buffers, separate queues per notification type
- **Workers**: Servers pulling notification events from queues and sending to third-party services
- **Third-party Services**: Deliver notifications to users
- **End Devices**: iOS, Android, SMS, Email

#### Notification Flow
1. Service calls APIs provided by notification servers
2. Notification servers fetch metadata from cache or database
3. Notification event sent to corresponding queue
4. Workers pull notification events from message queues
5. Workers send notifications to third-party services
6. Third-party services send notifications to user devices

## Step 3: Design Deep Dive

### Reliability

#### Data Loss Prevention
- **Requirement**: Cannot lose data (notifications can be delayed/reordered but never lost)
- **Solution**: Persist notification data in database and implement retry mechanism
- **Implementation**: Notification log database for data persistence

#### Exactly-Once Delivery
- **Reality**: No, cannot guarantee exactly-once delivery
- **Behavior**: Delivered exactly once most of the time, but distributed nature can cause duplicates
- **Solution**: Dedupe mechanism and careful failure case handling
- **Dedupe Logic**: Check event ID when notification arrives, discard if seen before

### Additional Components and Considerations

#### Notification Template
- **Purpose**: Avoid building every notification from scratch
- **Benefit**: Consistent format, reduce margin error, save time
- **Example Template**:
  ```
  BODY: You dreamed of it. We dared it. [ITEM NAME] is back — only until [DATE].
  CTA: Order Now. Or, Save My [ITEM NAME]
  ```

#### Notification Settings
- **Problem**: Users receive too many notifications daily
- **Solution**: Fine-grained control over notification settings
- **Database Fields**:
  - user_id (bigInt)
  - channel (varchar) - push notification, email, or SMS
  - opt_in (boolean) - opt-in to receive notification
- **Process**: Check user opt-in status before sending notifications

#### Rate Limiting
- **Purpose**: Avoid overwhelming users with too many notifications
- **Benefit**: Prevent users from turning off notifications completely
- **Implementation**: Limit number of notifications per user

#### Retry Mechanism
- **Trigger**: When third-party service fails to send notification
- **Process**: Add notification to message queue for retrying
- **Escalation**: Send alert to developers if problem persists

#### Security in Push Notifications
- **Method**: AppKey and appSecret for iOS/Android apps
- **Purpose**: Ensure only authenticated/verified clients can send push notifications
- **Implementation**: Secure push notification APIs

#### Monitor Queued Notifications
- **Key Metric**: Total number of queued notifications
- **Indicator**: Large number means events not processed fast enough
- **Action**: Add more workers to avoid delivery delays
- **Monitoring**: Track queued messages for processing

#### Events Tracking
- **Metrics**: Open rate, click rate, engagement
- **Purpose**: Understand customer behaviors
- **Implementation**: Analytics service with notification system integration
- **Tracking**: Various events throughout notification flow

### Updated Design
**New Components Added**:
- **Authentication**: Notification servers equipped with authentication
- **Rate Limiting**: Built into notification servers
- **Retry Mechanism**: Handle notification failures with predefined retry attempts
- **Notification Templates**: Consistent and efficient notification creation
- **Monitoring and Tracking**: System health checks and future improvements

## Step 4: Wrap Up

### System Benefits
- **Scalability**: Supports multiple notification formats
- **Decoupling**: Message queues decouple system components
- **Reliability**: Robust retry mechanism minimizes failure rate
- **Security**: AppKey/appSecret ensures only verified clients
- **Monitoring**: Tracking and monitoring at every stage
- **User Control**: Respects user opt-out settings
- **Rate Limiting**: Frequency capping prevents notification overload

### Key Features
- **Multiple Formats**: Push notification, SMS, email
- **High Volume**: 16 million notifications per day
- **Fault Tolerance**: Handles third-party service failures
- **User Experience**: Respects user preferences and limits
- **Analytics**: Comprehensive tracking and monitoring

## Technical Specifications

### Performance Requirements
- **Daily Volume**: 16 million notifications
  - 10 million mobile push notifications
  - 1 million SMS messages
  - 5 million emails
- **Real-time**: Soft real-time with acceptable delays under high workload

### Architecture Components
- **Notification Servers**: API endpoints, validation, queue management
- **Message Queues**: Separate queues per notification type
- **Workers**: Process notification events from queues
- **Third-party Services**: APNS, FCM, Twilio, Sendgrid, etc.
- **Database**: User data, notification settings, templates
- **Cache**: Frequently accessed data
- **Monitoring**: Queue monitoring, event tracking, analytics

### Scalability Considerations
- **Horizontal Scaling**: Multiple notification servers
- **Queue-based Architecture**: Decoupled components
- **Third-party Integration**: Extensible service integration
- **Geographic Distribution**: Support for different regions

---

*Next: Chapter 11 - Design a News Feed System*
