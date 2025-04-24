import { ApolloClient, InMemoryCache } from "@apollo/client";

const userId = sessionStorage.getItem("regUserId");

export const client = new ApolloClient({
  uri: `${
    import.meta.env.VITE_EMAIL_SERVICE_URL
  }/api/email/graphql?userid=${userId}`, // Replace this with your actual backend API URL
  cache: new InMemoryCache(),
  credentials: "include",
});

// uri: `${import.meta.env.VITE_EMAIL_SERVICE_URL}/api/email/graphql`, // Replace this with your actual backend API URL

// uri: 'http://localhost:3006/api/email/graphql?userId=67f86f91bded946f18f0d29e&regemail=sgurpreet601@gmail.com', // Replace this with your actual backend API URL
