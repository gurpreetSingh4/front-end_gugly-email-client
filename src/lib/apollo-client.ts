// import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, from } from '@apollo/client';
// import { onError } from '@apollo/client/link/error';

// // Create a link to the GraphQL endpoint
// const httpLink = createHttpLink({
//   uri: '/api/graphql',
//   credentials: 'include', // include credentials for cross-origin requests
// });

// // Error handling link
// const errorLink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors) {
//     graphQLErrors.forEach(({ message, locations, path }) => {
//       console.error(
//         `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
//       );
//     });
//   }
//   if (networkError) {
//     console.error(`[Network error]: ${networkError}`);
//   }
// });

// // Add authorization headers
// const authLink = new ApolloLink((operation, forward) => {
//   // You can add auth headers here if needed
//   return forward(operation);
// });

// // Create the Apollo Client
// export const client = new ApolloClient({
//   link: from([errorLink, authLink, httpLink]),
//   cache: new InMemoryCache(),
//   defaultOptions: {
//     watchQuery: {
//       fetchPolicy: 'cache-and-network',
//     },
//   },
// });


import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:3006/api/email/graphql', // Replace this with your actual backend API URL
  cache: new InMemoryCache(),
});