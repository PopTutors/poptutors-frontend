import { Helmet } from 'react-helmet-async';
import './index.css';
import AppProvider from './provider';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function App() {
  const jsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'PopTutors',
    url: 'https://poptutors.co',
    logo: 'https://poptutors.co/logo.png',
    description:
      'PopTutors is your one-stop solution for academic help: assignments, live doubt-solving, and 1-on-1 expert sessions.',
    sameAs: [
      'https://facebook.com/poptutors',
      'https://twitter.com/poptutors',
      'https://linkedin.com/company/poptutors',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXXXXXXXXX',
      contactType: 'Customer Support',
      availableLanguage: ['English', 'Hindi'],
    },
    department: [
      {
        '@type': 'EducationalAudience',
        educationalRole: 'Assignment Help',
        description:
          'Submit your brief, review tutor offers, and get your assignments delivered on time.',
      },
      {
        '@type': 'EducationalAudience',
        educationalRole: 'Live Question Solving',
        description: 'Discuss and solve your doubts in real-time with subject experts.',
      },
      {
        '@type': 'EducationalAudience',
        educationalRole: '1-on-1 Sessions',
        description: 'Personalized teaching from top educators across various subjects.',
      },
    ],
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Ananya' },
        reviewBody: 'Pop Tutors saved my GPA—fast, affordable, and plagiarism-free!',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Rahul' },
        reviewBody: 'On-demand Q&A was a game-changer during finals week.',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Dr. Mehta' },
        reviewBody:
          'This platform pairs students with vetted pros—I’ve never had a smoother collaboration.',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Anita' },
        reviewBody:
          'Clear workflows and milestone payments make Pop Tutors my go-to tutoring network.',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLdObject)}</script>
      </Helmet>
      <AppProvider />
    </>
  );
}

export default App;
