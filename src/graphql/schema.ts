// GraphQL types used throughout the application

export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
}

export interface Label {
  id: number;
  name: string;
  color?: string;
  userId?: number;
  type?: String;
  messageListVisibility?: String;
  labelListVisibility?: String;
}

export interface EmailSender {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface EmailAttachment {
  name: string;
  size: number;
  url: string;
}

export interface Email {
  id: number;
  subject: string;
  body: string;
  sender: EmailSender;
  recipient: EmailSender;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  labelIds: number[];
  labels: Label[];
  folder: string;
  attachments: EmailAttachment[];
}

export interface Draft {
  id: number;
  subject?: string;
  body?: string;
  recipients: string[];
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface LabelInput {
  name: string;
  color: string;
}

export interface DraftInput {
  subject?: string;
  body?: string;
  recipients: string[];
}
