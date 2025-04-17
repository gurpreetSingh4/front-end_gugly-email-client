import { gql } from '@apollo/client';

export const CREATE_LABEL = gql`
  mutation CreateLabel($input: LabelInput!) {
    createLabel(input: $input) {
      id
      name
      color
    }
  }
`;

export const DELETE_LABEL = gql`
  mutation DeleteLabel($id: ID!) {
    deleteLabel(id: $id) {
      success
    }
  }
`;

export const STAR_EMAIL = gql`
  mutation StarEmail($id: ID!, $isStarred: Boolean!) {
    starEmail(id: $id, isStarred: $isStarred) {
      id
      isStarred
    }
  }
`;

export const MOVE_EMAIL = gql`
  mutation MoveEmail($id: ID!, $folder: String!) {
    moveEmail(id: $id, folder: $folder) {
      id
      folder
    }
  }
`;

export const ADD_LABEL_TO_EMAIL = gql`
  mutation AddLabelToEmail($emailId: ID!, $labelId: ID!) {
    addLabelToEmail(emailId: $emailId, labelId: $labelId) {
      id
      labelIds
      labels {
        id
        name
        color
      }
    }
  }
`;

export const REMOVE_LABEL_FROM_EMAIL = gql`
  mutation RemoveLabelFromEmail($emailId: ID!, $labelId: ID!) {
    removeLabelFromEmail(emailId: $emailId, labelId: $labelId) {
      id
      labelIds
      labels {
        id
        name
        color
      }
    }
  }
`;

export const CREATE_DRAFT = gql`
  mutation CreateDraft($input: DraftInput!) {
    createDraft(input: $input) {
      id
      subject
      body
      recipients
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_DRAFT = gql`
  mutation UpdateDraft($id: ID!, $input: DraftInput!) {
    updateDraft(id: $id, input: $input) {
      id
      subject
      body
      recipients
      updatedAt
    }
  }
`;

export const DELETE_DRAFT = gql`
  mutation DeleteDraft($id: ID!) {
    deleteDraft(id: $id) {
      success
    }
  }
`;

export const SEND_EMAIL = gql`
  mutation SendEmail($draftId: ID!) {
    sendEmail(draftId: $draftId) {
      success
    }
  }
`;

export const SWITCH_USER = gql`
  mutation SwitchUser($userId: ID!) {
    switchUser(userId: $userId) {
      id
      username
      email
      name
      avatar
    }
  }
`;
