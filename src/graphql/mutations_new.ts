import { gql } from "@apollo/client";

// 1. Create a new label
export const CREATE_LABEL = gql`
  mutation CreateLabel($name: String!) {
    createLabel(name: $name) {
      id
      name
    }
  }
`;

// 2. Delete a label
export const DELETE_LABEL = gql`
  mutation DeleteLabel($labelId: ID!) {
    deleteLabel(id: $labelId)
  }
`;

// 3. Star or unstar an email
export const UPDATE_EMAIL_STARRED = gql`
  mutation UpdateEmailStarred($emailId: ID!, $isStarred: Boolean!) {
    updateEmailStarred(id: $emailId, isStarred: $isStarred) {
      id
      isStarred
    }
  }
`;

// 4. Move email to another folder
export const MOVE_EMAIL = gql`
  mutation MoveEmail($emailId: ID!, $folder: String!) {
    moveEmail(id: $emailId, folder: $folder) {
      id
      folder
    }
  }
`;

// 5. Apply label to email
export const APPLY_LABEL = gql`
  mutation ApplyLabel($emailId: ID!, $labelId: ID!) {
    applyLabel(emailId: $emailId, labelId: $labelId) {
      id
      labels {
        id
        name
      }
    }
  }
`;

// 6. Remove label from email
export const REMOVE_LABEL = gql`
  mutation RemoveLabel($emailId: ID!, $labelId: ID!) {
    removeLabel(emailId: $emailId, labelId: $labelId) {
      id
      labels {
        id
        name
      }
    }
  }
`;

// 7. Save a draft
export const SAVE_DRAFT = gql`
  mutation SaveDraft($subject: String, $body: String, $recipients: [String!]!) {
    saveDraft(input: { subject: $subject, body: $body, recipients: $recipients }) {
      id
      subject
      body
      recipients
      folder
    }
  }
`;

// 8. Send an email
export const SEND_EMAIL = gql`
  mutation SendEmail($subject: String!, $body: String!, $recipients: [String!]!) {
    sendEmail(input: { subject: $subject, body: $body, recipients: $recipients }) {
      id
      subject
      body
      recipients
      date
      folder
    }
  }
`;

// 9. Switch user (optional)
export const SWITCH_USER = gql`
  mutation SwitchUser($userId: ID!) {
    switchUser(userId: $userId) {
      id
      name
      email
    }
  }
`;
