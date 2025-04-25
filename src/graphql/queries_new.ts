import { gql } from '@apollo/client';

// input SearchFilterInput {
//   folder: String
//   dateRange: String
//   hasAttachments: Boolean
//   labelIds: [ID!]
// }


export const GET_EMAIL_LABEL_STATS = gql`
  query GetEmailLabelStats {
    getEmailLabelStats {
      labels {
        id
        name
        type
      }
      stats {
        labelId
        name
        total
        unread
        color
      }
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      email
      name
      avatar
    }
  }
`;


// 1. Fetch emails by folder
export const GET_EMAILS = gql`
  query GetEmails($folder: String!) {
    emails(folder: $folder) {
      id
      subject
      sender {
        name
        email
      }
      recipients
      body
      date
      isStarred
      folder
      labels {
        id
        name
      }
    }
  }
`;

// 2. Fetch all labels
export const GET_LABELS = gql`
  query GetLabels {
    labels {
      id
      name
    }
  }
`;

// 3. Fetch a single email by ID
export const GET_EMAIL_BY_ID = gql`
  query GetEmailById($emailId: ID!) {
    email(id: $emailId) {
      id
      subject
      sender {
        name
        email
      }
      recipients
      body
      date
      isStarred
      folder
      labels {
        id
        name
      }
    }
  }
`;

// 4. Search emails
export const SEARCH_EMAILS = gql`
  query SearchEmails($query: String!) {
    searchEmails(query: $query) {
      id
      subject
      sender {
        name
        email
      }
      body
      date
    }
  }
`;

// 5. Get all users (for switching accounts)
export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      email
      avatar
    }
  }
`;

// 6. Enhanced search (AI or vector based)
export const ENHANCED_SEARCH = gql`
  query EnhancedSearch($query: String!, $filters: SearchFilterInput, $useAI: Boolean!) {
    enhancedSearch(query: $query, filters: $filters, useAI: $useAI) {
      id
      subject
      sender {
        name
        email
      }
      body
      date
    }
  }
`;

// 7. Get all drafts
export const GET_DRAFTS = gql`
  query GetDrafts {
    drafts {
      id
      subject
      body
      recipients
    }
  }
`;

