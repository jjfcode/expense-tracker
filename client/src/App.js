import React from 'react';
import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloProvider, 
  createHttpLink,
  from
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import ExpenseCalendar from './components/ExpenseCalendar';
import Footer from './components/Footer';

// Create an HTTP link to the GraphQL server
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
  credentials: 'same-origin'
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

// Create Apollo Client instance
const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          expenses: {
            merge(existing, incoming) {
              return incoming;
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all'
    }
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="container">
        <h1>Expense Tracker</h1>
        <div className="main-content">
          <ExpenseForm />
          <ExpenseCalendar />
        </div>
        <ExpenseList />
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App; 