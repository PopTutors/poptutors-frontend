import { createBrowserRouter, Navigate } from "react-router-dom";
// import { lazy } from "react";
// import ProtectedRoute from "./ProtectedRoute";
import { paths } from "./config/path";
import Login from "./auth/login";
import Signup from "./auth/signup";
import Landing from "./landing/Landing";
import HomeContent from "./components/layout/Mainlayout";
import Student from "./student/Student";
import NotFound from "./landing/components/notfound";
import Assignment from "./student/Assignment";
import Profile from "./profile/profile";
import ProtectedRoute from "./protectedRoute";
import SessionCard from "./sessiondetails/SessionDetails";

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
    path: paths.landing.home.path,
    element: <Landing />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <HomeContent />
        ),
        children: [
          {
            path: paths.student.profile.path,
            element: <Profile />,
          },
          {
            path: paths.student.dashboard.path,
            element: <Student />
          },
          {
            path: paths.student.assignment.path,
            element: <Assignment />
          },
          {
            path: paths.student.assignmentdetails.path,
            element: <SessionCard />
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ]

      }
    ]
  },

  {
    path: "*",
    element: <NotFound />,
  },


]);
