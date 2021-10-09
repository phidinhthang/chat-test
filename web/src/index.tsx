import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const client = new QueryClient({
  defaultOptions: {
    queries: { retry: 0, refetchOnWindowFocus: false, refetchOnMount: false },
  },
});

ReactDOM.render(
  <QueryClientProvider client={client}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
  document.getElementById('root')
);
