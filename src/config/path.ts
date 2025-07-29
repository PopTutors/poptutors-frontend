export const paths = {
  home: {
    path: "/dashboard",
    getHref: () => "/dashboard",
  },

  student: {
    home: {
      path: "/student/dashboard",
      getHref: () => "/student/dashboard",
    },
    profile: {
      path: "/student/profile",
      getHref: () => "/student/profile",
    },
    dashboard: {
      path: "/student/dashboard",
      getHref: () => "/student/dashboard",
    },
    assignment: {
      path: "/student/assignment",
      getHref: () => "/student/assignment",
      newAssignment: {
        path: "/student/assignment/new",
        getHref: () => "/student/assignment/new",
      },
    },
    assignmentSubmission: {
      path: "/student/assignment-submission",
      getHref: () => "/student/assignment-submission",
    },

    assignmentdetails: {
      path: "/student/assignmentdetails",
      getHref: () => "/student/assignmentdetails",
    },
    livequestion: {
      path: "/student/live-question",
      getHref: () => "/student/live-question",
    },
    session: {
      path: "/student/session",
      getHref: () => "/student/session",
      sessionSubmit: {
        path: "/student/session-submit",
        getHref: () => "/student/session-submit",
      },
    },
  },
  landing: {
    path: "/landing",
    getHref: () => "/landing",
    home: {
      path: "/",
      getHref: () => "/",
    },
    assignment: {
      path: "/assignment",
      getHref: () => "/assignment",
    },
    questionSolving: {
      path: "/question-solving",
      getHref: () => "/question-solving",
    },
    session: {
      path: "/session",
      getHref: () => "/session",
    },
    refer: {
      path: "/refer-and-earn",
      getHref: () => "/refer-and-earn",
    },
    contact: {
      path: "/contact-us",
      getHref: () => "/contact-us",
    },
  },
  auth: {
    register: {
      path: "/register",
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
        }`,
    },
    login: {
      path: "/login",
      getHref: (redirectTo?: string | null | undefined) => {
        if (!redirectTo || redirectTo === "/auth/login") {
          return "/auth/login";
        }
        return `/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`;
      },
    },
  },
} as const;
