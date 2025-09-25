import JobApplicants from './pages/manager/JobApplicants';
import { createBrowserRouter } from 'react-router-dom';
import JobListing from './pages/manager/JobListing';
// import { lazy } from "react";
// import ProtectedRoute from "./ProtectedRoute";
import { paths } from './config/path';
import Login from './auth/login';
import Signup from './auth/signup';
import Landing from './landing/Landing';
import HomeContent from './components/layout/Mainlayout';
import Student from './student/Student';
import NotFound from './landing/components/Notfound';
import Assignment from './student/Assignment';
import Profile from './profile/Profile';
import SessionCard from './sessiondetails/SessionDetails';
import SessionPage from './pages/session/Session';
// import SubmitAssignmentPage from "./student/components/SubmitAssignment";
import TransactionDashboard from './student/Wallet';
import NewAssignmentPage from './pages/assignment/new-assignment';
import LiveQuestion from './liveQuestion/LiveQuestion';
import AssignmentDetailsPage from './pages/student/assignment/details';
import SessionDetailsPage from './pages/student/session/details';
import GoogleCallback from './auth/google-callback';
import ProtectedRoute from './protectedRoute';
import RequestSessionForm from './components/forms/RequestSessionForm';
import { BookExpertForm } from './components/forms/BookExpert';
import LiveQuestionDetailsPage from './pages/student/liveQuestion/details';
import Settings from './pages/manager/Settings';
import Hirings from './pages/manager/Hirings/Hirings';
import ManagerProfile from './pages/manager/MangerProfile/ManagerProfile';
import DashboardPage from './pages/manager/Dashboard/DashboardPage';
import PostAJob from './pages/manager/PostAJob/PostAJob';

export const createAppRouter = createBrowserRouter([
  {
    path: paths.auth.login.path,
    element: <Login />,
  },
  {
    path: paths.auth.register.path,
    element: <Signup />,
  },
  {
    path: paths.auth.googleCallback.path,
    element: <GoogleCallback />,
  },
  {
    path: paths.landing.home.path,
    element: <Landing />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <HomeContent />,
        children: [
          // Manager Portal
          {
            path: paths.manager.jobListing.path,
            element: <JobListing />,
          },
          {
            path: paths.manager.dashboard.path,
            element: <DashboardPage />,
          },
          {
            path: paths.manager.hirings.path,
            element: <Hirings />,
          },
          {
            path: paths.manager.profile.path,
            element: <ManagerProfile />,
          },
          {
            path: '/manager/job-listing/:id/applicants',
            element: <JobApplicants />,
          },
          {
            path: paths.manager.settings.path,
            element: <Settings />,
          },
          {
            path: paths.student.profile.path,
            element: <Profile />,
          },
           {
            path: paths.manager.postAssignment.path,
            element: <PostAJob />,
          },
          {
            path: paths.student.dashboard.path,
            element: <Student />,
          },
          // {
          //   path: paths.student.livequestion.path,
          //   element: <BookExpertPage />,
          // },
          {
            path: paths.student.assignment.path,
            element: <Assignment />,
          },
          {
            path: paths.student.livequestion.livequestionrequest.path,
            element: <BookExpertForm />,
          },
          // {
          //   path: paths.student.assignmentSubmission.path,
          //   element: <SubmitAssignmentPage />,
          // },
          {
            path: paths.student.assignment.newAssignment.path,
            element: <NewAssignmentPage />,
          },
          {
            path: paths.student.assignment.assignmentDetails.path,
            element: <AssignmentDetailsPage />,
          },
          {
            path: paths.student.assignmentdetails.path,
            element: <SessionCard />,
          },
          {
            path: paths.student.session.sessionSubmit.path,
            element: <RequestSessionForm />,
          },
          {
            path: paths.student.livequestion.path,
            element: <LiveQuestion />,
          },
          {
            path: paths.student.livequestiondetails.path,
            element: <LiveQuestionDetailsPage />,
          },
          {
            path: paths.student.session.path,
            element: <SessionPage />,
          },
          {
            path: paths.student.wallet.path,
            element: <TransactionDashboard />,
          },
          {
            path: paths.student.session.sessionDetails.path,
            element: <SessionDetailsPage />,
          },
          {
            path: '*',
            element: <NotFound />,
          },
        ],
      },
    ],
  },

  {
    path: '*',
    element: <NotFound />,
  },
]);
