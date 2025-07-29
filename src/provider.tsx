import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { createAppRouter } from './router';
import './index.css';
// import { Provider } from "react-redux";
// import store, { persistor } from "./redux-toolkit/store";
// import { PersistGate } from "redux-persist/integration/react";
// import { HelmetProvider } from "react-helmet-async";
// import LoadingScreen from "./components/ui/loading";
import { MainErrorFallback } from './components/error/main';
// import ContentMediaLoad from "./components/contentmedia/ContentMediaLoad";

const queryClient = new QueryClient();

const AppProvider = () => {
  return (
    <React.Suspense>
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <QueryClientProvider client={queryClient}>
          {/* <Provider store={store}> */}
          {/* <ContentMediaLoad /> */}
          <RouterProvider router={createAppRouter} />
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};

export default AppProvider;
