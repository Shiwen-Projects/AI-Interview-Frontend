import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
  InterviewPreparation,
  InterviewPreparationPage,
  InterviewSessionError,
  interviewSessionLoader,
} from './pages'

const router = createBrowserRouter([
  {
    path: '/',
    element: <InterviewPreparation />,
  },
  {
    path: '/:sessionId',
    loader: interviewSessionLoader,
    element: <InterviewPreparationPage />,
    errorElement: <InterviewSessionError />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
