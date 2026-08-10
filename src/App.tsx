import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
  HomePage,
  homePageLoader,
  InterviewPreparation,
  InterviewPreparationPage,
  interviewSessionLoader,
} from './pages'
import { GlobalLoader, PageLoadingError } from './components'

const router = createBrowserRouter([
  {
    path: '/',
    loader: homePageLoader,
    element: <HomePage />,
    errorElement: <PageLoadingError title="Unable to load home page" />,
    hydrateFallbackElement: <GlobalLoader visible />,
  },
  {
    path: 'session/',
    element: <InterviewPreparation />,
  },
  {
    path: 'session/:sessionId',
    loader: interviewSessionLoader,
    element: <InterviewPreparationPage />,
    errorElement: <PageLoadingError title="Unable to load interview session" />,
    hydrateFallbackElement: <GlobalLoader visible />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
