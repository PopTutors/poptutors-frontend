import { Settings } from "lucide-react";

import { m } from "framer-motion";

export const paths = {
  manager: {
    dashboard: {
      path: '/manager/dashboard',
      getHref: () => '/manager/dashboard',
    },
    messages: {
      path: '/manager/messages',
      getHref: () => '/manager/messages',
    },
    profile: {
      path: '/manager/profile',
      getHref: () => '/manager/profile',
    },
    hirings: {
      path: '/manager/hirings',
      getHref: () => '/manager/hirings',
    },
    jobListing: {
      path: '/manager/job-listing',
      getHref: () => '/manager/job-listing',
    },
    postAssignment: {
      path: '/manager/post-assignment',
      getHref: () => '/manager/post-assignment',
    },
    postSession: {
      path: '/manager/post-session',
      getHref: () => '/manager/post-session',
    },
    postLiveHelp: {
      path: '/manager/post-live-help',
      getHref: () => '/manager/post-live-help',
    },
    sessions: {
      path: '/manager/sessions',
      getHref: () => '/manager/sessions',
    },
    exams: {
      path: '/manager/liveHelp',
      getHref: () => '/manager/liveHelp',
    },
    finance: {
      path: '/manager/finance',
      getHref: () => '/manager/finance',
    },
    hubManager: {
      path: '/manager/hub-manager',
      getHref: () => '/manager/hub-manager',
    },
    teacher: {
      path: '/manager/teacher',
      getHref: () => '/manager/teacher',
    },
    settings: {
      path: '/manager/settings',
      getHref: () => '/manager/settings',
    },
    teacherProfile: {
      path: '/manager/teacher/profile/:id',
      getHref: (id: string) => `/manager/teacher/profile/${id}`,
    }
  },
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
  teacher: {
    dashboard: {
      path: '/teacher/dashboard',
      getHref: () => '/teacher/dashboard',
    },
    profile: {
      path: '/teacher/profile',
      getHref: () => '/teacher/profile',
    },
    jobListing: {
      path: '/teacher/jobs', // changed for testing
      getHref: () => '/teacher/jobs',
    },
    examHelpList: {
      path: '/teacher/exam-help',
      getHref: () => '/teacher/exam-help'
    },
    settings: {
      path: '/teacher/settings',
      getHref: () => '/teacher/settings'
    },
    assignmentList: {
      path: '/teacher/assignment-list',
      getHref: () => '/teacher/assignment-list'
    },
    sessionList: {
      path: '/teacher/session-list',
      getHref: () => '/teacher/session-list'
    }
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
