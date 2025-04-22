import { gql } from "@apollo/client";

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

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      email
      name
      avatar
    }
  }
`;

export const GET_LABELS = gql`
  query GetLabels {
    listGmailLabels {
      name
      id
      type
      messageListVisibility
      labelListVisibility
    }
  }
`;

export const GET_EMAILS = gql`
  query GetEmails($folder: String) {
    emails(folder: $folder) {
      id
      subject
      body
      sender {
        id
        name
        email
        avatar
      }
      date
      isRead
      isStarred
      labelIds
      labels {
        id
        name
        color
      }
      folder
    }
  }
`;

export const GET_EMAIL_DETAIL = gql`
  query GetEmailDetail($id: ID!) {
    email(id: $id) {
      id
      subject
      body
      sender {
        id
        name
        email
        avatar
      }
      recipient {
        id
        name
        email
        avatar
      }
      date
      isRead
      isStarred
      labelIds
      labels {
        id
        name
        color
      }
      folder
      attachments {
        name
        size
        url
      }
    }
  }
`;

export const GET_DRAFTS = gql`
  query GetDrafts {
    drafts {
      id
      subject
      body
      recipients
      createdAt
      updatedAt
    }
  }
`;

export const GET_DRAFT = gql`
  query GetDraft($id: ID!) {
    draft(id: $id) {
      id
      subject
      body
      recipients
      createdAt
      updatedAt
    }
  }
`;
