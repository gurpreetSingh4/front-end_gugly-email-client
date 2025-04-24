import { gql, useQuery } from '@apollo/client';

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
