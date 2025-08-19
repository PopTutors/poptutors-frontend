export const paths = {
  home: {
    path: '/dashboard',
    getHref: () => '/dashboard',
  },

  student: {
    home: {
      path: '/student/dashboard',
      getHref: () => '/student/dashboard',
    },
    profile: {
      path: '/student/profile',
      getHref: () => '/student/profile',
    },
    dashboard: {
      path: '/student/dashboard',
      getHref: () => '/student/dashboard',
    },
    assignment: {
      path: '/student/assignment',
      getHref: () => '/student/assignment',
      newAssignment: {
        path: '/student/assignment/new',
        getHref: () => '/student/assignment/new',
      },
      assignmentDetails: {
        path: '/student/assignment/:id',
        getHref: (id: string) => {
          console.log(`/student/assignment/${id}`);
          return `/student/assignment/${id}`;
        },
      },
    },
    assignmentSubmission: {
      path: '/student/assignment-submission',
      getHref: () => '/student/assignment-submission',
    },

    assignmentdetails: {
      path: '/student/assignmentdetails',
      getHref: () => '/student/assignmentdetails',
    },
    livequestion: {
      path: '/student/live-question',
      getHref: () => '/student/live-question',
      livequestionrequest: {
        path: '/student/live-question-request',
        getHref: () => '/student/live-question-request',
      },
    },
    livequestiondetails: {
      path: '/student/live-question/:id',
      getHref: (id: string) => `/student/live-question/${id}`,
    },
    session: {
      path: '/student/session',
      getHref: () => '/student/session',
      sessionSubmit: {
        path: '/student/session-submit',
        getHref: () => '/student/session-submit',
      },
      sessionDetails: {
        path: '/student/session/:id',
        getHref: (id: string) => `/student/session/${id}`,
      },
    },
    wallet: {
      path: '/student/wallet',
      getHref: () => '/student/wallet',
    },
  },
  landing: {
    path: '/landing',
    getHref: () => '/landing',
    home: {
      path: '/',
      getHref: () => '/',
    },
    assignment: {
      path: '/assignment',
      getHref: () => '/assignment',
    },
    questionSolving: {
      path: '/question-solving',
      getHref: () => '/question-solving',
    },
    session: {
      path: '/session',
      getHref: () => '/session',
    },
    refer: {
      path: '/refer-and-earn',
      getHref: () => '/refer-and-earn',
    },
    contact: {
      path: '/contact-us',
      getHref: () => '/contact-us',
    },
  },
  auth: {
    register: {
      path: '/register',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      path: '/login',
      getHref: (redirectTo?: string | null | undefined) => {
        if (!redirectTo || redirectTo === '/login') {
          return '/login';
        }
        return `/login?redirectTo=${encodeURIComponent(redirectTo)}`;
      },
    },
    googleCallback: {
      path: '/auth/google-callback',
      getHref: (role?: string) =>
        role ? `/auth/google-callback?role=${encodeURIComponent(role)}` : '/auth/google-callback',
    },
  },
} as const;
