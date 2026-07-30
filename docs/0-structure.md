# 🏗️ Frontend Structure

## 🌳 Application hierarchy

```text
main.tsx
├── React.StrictMode
└── MantineProvider
    ├── Notifications
    └── App
        └── RouterProvider
            ├── /                  → InterviewPreparation
            └── /:sessionId
                ├── loader         → interviewSessionLoader
                ├── page           → InterviewPreparationPage
                │   └── InterviewPreparation
                │       └── QuestionCard[]
                └── error boundary → InterviewSessionError
```

`main.tsx` is the application entry point. It installs the Mantine theme,
notification system, global styles, and renders the router through `App`.

## 📁 Source layout

```text
src/
├── 🚀 main.tsx                     # React root, Mantine theme, notifications
├── 🧭 App.tsx                      # Browser router and route definitions
├── 🎨 index.css                    # Tailwind import and global design tokens
├── 🎨 App.css                      # Imported legacy Vite template styles
│
├── 🌐 api/
│   └── interview/
│       ├── interview.ts             # Session REST requests and question SSE
│       ├── types.ts                 # API callback/handler types
│       └── index.ts                 # Public exports
│
├── 🧩 components/
│   ├── Alert/                       # Shared typed alert wrapper
│   ├── Loader/                      # Shared full-screen loading overlay
│   └── index.ts                     # Shared component exports
│
├── 🔄 context/
│   ├── GlobalUIContext.tsx          # Global loading state and overlay
│   └── index.ts                     # Context exports
│
└── 📄 pages/
    └── Interview/
        ├── InterviewPreparation.tsx # Form, generation state, and results UI
        ├── InterviewPreparationPage.tsx
        │                             # Existing-session page and route error UI
        ├── QuestionCard.tsx          # Single generated question
        ├── interviewSessionLoader.ts # Loads a session before route rendering
        ├── types.ts                  # Interview session domain models
        ├── constants.ts              # SSE event names
        ├── lang.ts                   # Interview UI copy
        └── index.ts                  # Feature exports
```
