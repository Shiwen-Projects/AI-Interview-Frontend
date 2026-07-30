# 🎯 Interview Preparation

An AI-powered practice tool that creates interview questions tailored to a
candidate's CV and target role.

## 💡 Product goal

Help candidates prepare efficiently by turning their CV and a job description
into a focused set of interview questions.

The current MVP supports:

- 📄 Uploading a CV in PDF format.
- 🎯 Providing a target position or job posting.
- 📝 Providing a job description.
- ✨ Generating and streaming tailored questions.
- 🔗 Reopening a generated interview session from its URL.

The target is 10 questions per session. The backend controls the final number;
the frontend displays each question it receives.

## 🧭 Scope and status

### ✅ Available in the current MVP

- Create an interview session.
- Stream generated questions using Server-Sent Events (SSE).
- Display questions as they arrive.
- Load an existing session using its session ID.
- Show loading, success, and error feedback.

### 🔜 Planned

- Expand a question and write an answer.
- Submit an answer for AI scoring and feedback.
- Export a session as PDF or Markdown.

### 🔮 Future idea

- Display a visual knowledge graph of topics and skill gaps.

## 🖼️ Low-fidelity UI

```text
┌──────────────────────────────┬─────────────────────────────────────────┐
│       CANDIDATE DETAILS      │          INTERVIEW QUESTIONS            │
│──────────────────────────────│─────────────────────────────────────────│
│ 📄 CV / Resume (PDF)         │ 📋 Questions appear as they are ready   │
│ 🎯 Target position          │                                         │
│ 📝 Job description          │ 🔜 Expand → answer → receive feedback   │
│                              │                                         │
│                 [✨ Generate] │ 🔜 Export as PDF or Markdown            │
└──────────────────────────────┴─────────────────────────────────────────┘
```

The left panel is collapsible. The right panel shows an empty state before
generation, a loading indicator during generation, and question cards as SSE
events arrive.


## 👤 Primary user journey

### ✨ Create a new interview session

Route: `/`

1. The candidate uploads a PDF CV.
2. The candidate enters a target position and job description.
3. The candidate clicks **Generate Questions**.
4. The frontend validates all required fields.
5. The frontend creates a session and receives a `sessionId`.
6. The browser URL changes to `/:sessionId`.
7. The frontend opens an SSE connection.
8. Each generated question is immediately added to the results panel.
9. A success or error notification is shown when streaming ends.

```text
InterviewPreparation form
  → createInterviewSession(FormData)
  → POST /api/sessions
  → receive sessionId
  → update URL to /:sessionId
  → getStreamingQuestions(sessionId)
  → append each question event
  → handle done or error event
```

### 📥 Open an existing interview session

Route: `/:sessionId`

1. React Router extracts `sessionId` from the URL.
2. `interviewSessionLoader` requests the saved session.
3. `InterviewPreparationPage` receives the loader data.
4. `InterviewPreparation` displays the saved details and questions.
5. The route error boundary displays an error if loading fails.

```text
Visit /:sessionId
  → interviewSessionLoader
  → getInterviewSession(sessionId)
  → GET /api/sessions/:sessionId
  → InterviewPreparationPage
  → InterviewPreparation(initialSession)
```

## 🔌 API contract

All endpoints use the base URL from `VITE_API_URL`.

### Create a session

`POST /api/sessions`

Content type: `multipart/form-data`

Required fields:

- `cv` — CV/resume PDF file.
- `post` — target position or full job posting.
- `jobDescription` — job requirements and responsibilities.

Successful response:

```json
{
  "sessionId": "session-id"
}
```

### Get a session

`GET /api/sessions/:sessionId`

Path parameter:

- `sessionId` — unique interview session ID.

Successful response:

```json
{
  "id": "session-id",
  "post": "Frontend Engineer",
  "jobDescription": "Role requirements and responsibilities...",
  "cvId": "cv-id",
  "questions": [
    {
      "id": "question-id",
      "question": "How do you optimize a React application?"
    }
  ]
}
```

An unsuccessful response is handled by the route error boundary.

### Stream generated questions

`GET /api/sessions/:sessionId/questions/stream`

Transport: Server-Sent Events through `EventSource`.

Defined events:

- `preparing` — the backend is preparing session data.
- `generating` — question generation is in progress.
- `question` — carries one generated question.
- `done` — all questions have been generated.
- `error` — carries an error message.

The MVP listens to `question`, `done`, and `error`. The `preparing` and
`generating` events are reserved for more detailed loading states.

Example question event:

```text
event: question
data: {"id":"question-id","question":"Describe a challenging project."}
```

Example error event:

```text
event: error
data: {"message":"Unable to generate interview questions."}
```

## 🗃️ Frontend data model

```ts
type InterviewQuestion = {
  id: string;
  question: string;
};

type InterviewSession = {
  id: string;
  post: string;
  jobDescription: string;
  cvId: string;
  questions: InterviewQuestion[];
};
```

Answer, score, and feedback fields will be added when answer evaluation is
implemented.

## ✅ MVP acceptance criteria

- All three form fields are required.
- The CV input accepts PDF files.
- Invalid input prevents session creation and displays validation feedback.
- A successful creation response updates the URL with the session ID.
- Questions appear individually without waiting for the full set.
- Inputs remain disabled while questions are being generated.
- A `done` event ends the loading state and displays a success notification.
- An `error` event ends the loading state and displays an error notification.
- Visiting a valid `/:sessionId` URL displays the saved session.
- Failure to load a saved session displays a route-level error message.