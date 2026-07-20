# Interview Preparation Web Page

An AI-powered interview preparation tool that generates targeted questions based on your CV and role, then evaluates your answers — so you practice smarter, not harder.

- Generates 10 targeted interview questions based on your profile

## Low-Fieldity UI Design

```
┌─────────────────────────┬────────────────────────────────────────────┐
│        LEFT PANEL       │              RIGHT PANEL                   │
│─────────────────────────│────────────────────────────────────────────│
│ 📄 Upload CV (file)     │ 📋 10 generated questions                  │
│ 🎯 Target Position      │    ↳ Click to expand → write your answer   │
│ 📝 Job Description      │    ↳ Submit → AI scores & gives feedback   │
│                         │                                            │
│ [✨ Generate]           │ (Could) 📤 Export as PDF / Markdown        │
│                         │ (Future) 🕸️ Visual knowledge graph         │
└─────────────────────────┴────────────────────────────────────────────┘
```

## Flow

### Create a new Interview Session

- Access Route: `/`
- Fill in cv, post and job description -> Click Generate
- Send Post request by `createInterviewSession`
- If response successfully
    - Obtain `sessionId` and add it to url
    - Open SSE connection, get the return data.
    - Detect any new question is ready, display it out; detect if the SSE is done. 


### Access an existed Interview Session

- Access Route: `/:sessionId`
- Using `interviewSessionLoader` and Query by `getInterviewSession`
- If response successfully
    - Render `InterviewPreparationPage`
    - Pass the query data into InterviewPreparation
    - Display questions
- If response successfully
    - pop up error alert

## Frontend Data Model

### Get Session

### Create Session Input

The following fileds are **required**
- cv file
- post
- job description

### Streaming Genenrate Questions
