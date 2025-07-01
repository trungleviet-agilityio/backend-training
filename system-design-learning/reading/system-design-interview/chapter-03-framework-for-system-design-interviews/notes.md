# Chapter 03: A Framework for System Design Interviews

## Key Concepts

### What is a System Design Interview?
- **Simulation**: Real-life problem solving where two co-workers collaborate
- **Goal**: Demonstrate design skills, defend choices, respond to feedback constructively
- **Nature**: Open-ended problem with no perfect answer
- **Focus**: Design process more important than final design

### What Interviewers Look For
- **Technical Design Skills**: System architecture knowledge
- **Collaboration**: Ability to work with others
- **Pressure Handling**: Work under time constraints
- **Ambiguity Resolution**: Handle unclear requirements constructively
- **Question Asking**: Essential skill many interviewers specifically look for

### Red Flags to Avoid
- **Over-engineering**: Delighting in design purity while ignoring trade-offs
- **Narrow-mindedness**: Not considering alternatives
- **Stubbornness**: Unwilling to adapt or change approach

## 4-Step Framework for System Design Interviews

### Step 1: Understand the Problem and Establish Design Scope

#### The "Jimmy" Story
- **Don't be like Jimmy**: Student who answers quickly without thinking
- **Problem**: Jumping to solutions without understanding requirements
- **Solution**: Slow down, think deeply, ask clarifying questions

#### Key Questions to Ask
- **What specific features are we going to build?**
- **How many users does the product have?**
- **How fast does the company anticipate to scale up? What are the anticipated scales in 3 months, 6 months, and a year?**
- **What is the company's technology stack? What existing services might you leverage to simplify the design?**

#### Example: News Feed System Interview
```
Candidate: Is this a mobile app? Or a web app? Or both?
Interviewer: Both.

Candidate: What are the most important features for the product?
Interviewer: Ability to make a post and see friends' news feed.

Candidate: Is the news feed sorted in reverse chronological order or a particular order?
Interviewer: To keep things simple, let us assume the feed is sorted by reverse chronological order.

Candidate: How many friends can a user have?
Interviewer: 5000

Candidate: What is the traffic volume?
Interviewer: 10 million daily active users (DAU)

Candidate: Can feed contain images, videos, or just text?
Interviewer: It can contain media files, including both images and videos.
```

### Step 2: Propose High-Level Design and Get Buy-in

#### Collaboration Approach
- **Treat interviewer as teammate**: Work together, ask for feedback
- **Draw box diagrams**: Key components on whiteboard/paper
- **Back-of-the-envelope calculations**: Evaluate if blueprint fits scale constraints
- **Concrete use cases**: Help frame design and discover edge cases

#### Components to Consider
- **Clients**: Mobile/web applications
- **APIs**: Application programming interfaces
- **Web servers**: Handle HTTP requests
- **Data stores**: Databases and storage systems
- **Cache**: Performance optimization
- **CDN**: Content delivery network
- **Message queue**: Asynchronous processing

#### Example: News Feed System High-Level Design
- **Two main flows**:
  1. **Feed publishing**: User publishes post → data written to cache/database → post populated into friends' news feed
  2. **News feed building**: News feed built by aggregating friends' posts in reverse chronological order
- **Figures 3-1 and 3-2**: High-level designs for feed publishing and news feed building flows

### Step 3: Design Deep Dive

#### Prerequisites for Deep Dive
- **Agreed on overall goals and feature scope**
- **Sketched out high-level blueprint**
- **Obtained feedback on high-level design**
- **Identified areas to focus on based on feedback**

#### Focus Areas (Interviewer-Dependent)
- **High-level design focus**: Some interviewers prefer this approach
- **Performance characteristics**: Senior candidate interviews, bottlenecks, resource estimations
- **Component details**: Hash function design (URL shortener), latency reduction (chat system)

#### Time Management
- **Essential**: Don't get carried away with minute details
- **Avoid unnecessary details**: Don't discuss EdgeRank algorithm in detail
- **Focus on scalability**: Demonstrate ability to design scalable systems

#### Example: News Feed System Deep Dive
- **Two important use cases**:
  1. **Feed publishing**
  2. **News feed retrieval**
- **Figures 3-3 and 3-4**: Detailed design for the two use cases (explained in Chapter 11)

### Step 4: Wrap Up

#### Follow-up Discussion Points
- **System bottlenecks**: Identify and discuss potential improvements
- **Design recap**: Refresh interviewer's memory after long session
- **Error cases**: Server failure, network loss, etc.
- **Operation issues**: Monitoring metrics, error logs, system rollout
- **Next scale curve**: Changes needed to support 10x more users
- **Additional refinements**: What you'd do with more time

#### Never Say
- "My design is perfect and nothing can be improved"
- There is always something to improve upon

## Dos and Don'ts

### Dos
- **Always ask for clarification**: Don't assume your assumption is correct
- **Understand the requirements**: There is neither the right answer nor the best answer
- **Communicate**: Let the interviewer know what you are thinking
- **Suggest multiple approaches**: If possible
- **Design critical components first**: Once you agree on blueprint
- **Bounce ideas off interviewer**: Good interviewer works with you as teammate
- **Never give up**

### Don'ts
- **Don't be unprepared**: For typical interview questions
- **Don't jump into solution**: Without clarifying requirements and assumptions
- **Don't go into too much detail**: On single component in beginning
- **Don't hesitate to ask for hints**: If you get stuck
- **Don't think in silence**: Communicate
- **Don't think you're done**: Until interviewer says you're done

## Time Allocation Guide

### 45-Minute Interview Session (Rough Estimate)
- **Step 1**: Understand the problem and establish design scope - **3-10 minutes**
- **Step 2**: Propose high-level design and get buy-in - **10-15 minutes**
- **Step 3**: Design deep dive - **10-25 minutes**
- **Step 4**: Wrap up - **3-5 minutes**

### Important Notes
- **Rough estimate**: Actual time distribution depends on problem scope and interviewer requirements
- **Flexibility**: Be prepared to adjust based on interviewer preferences
- **Time management**: Essential for covering entire design effectively

## Key Success Factors

### Communication Skills
- **Think aloud**: Explain your thought process
- **Ask questions**: Clarify requirements
- **Draw diagrams**: Visualize the system
- **Discuss trade-offs**: Show understanding of alternatives

### Problem-Solving Approach
- **Start simple**: Begin with basic design
- **Iterate**: Improve based on feedback
- **Consider scale**: Plan for growth
- **Think end-to-end**: Consider all components

### Technical Knowledge
- **Know your tools**: Understand technology choices
- **Understand trade-offs**: Pros and cons of different approaches
- **Stay updated**: Keep up with new technologies
- **Practice**: Work on different types of problems

## Framework Summary

### Remember the 4 Steps:
1. **Understand**: Clarify requirements and scope
2. **Propose**: High-level design and get buy-in
3. **Deep Dive**: Detailed component design
4. **Wrap Up**: Summarize and discuss improvements

### Key Success Factors:
- **Communication**: Clear explanation of your approach
- **Problem Solving**: Systematic approach to design
- **Technical Knowledge**: Understanding of system components
- **Adaptability**: Willingness to iterate and improve

---

*Next: Chapter 04 - Design a Rate Limiter*
