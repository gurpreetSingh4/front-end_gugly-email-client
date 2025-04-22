import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:3006/api/email/graphql?userId=67f86f91bded946f18f0d29e&regEmail=sgurpreet601@gmail.com', // Replace this with your actual backend API URL
  cache: new InMemoryCache(),
  credentials: 'include',
});