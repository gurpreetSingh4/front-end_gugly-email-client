import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_EMAILS,
  GET_LABELS,
  GET_EMAIL_BY_ID,
  GET_DRAFTS,
  GET_CURRENT_USER,
  GET_ALL_USERS,
  
} from '../graphql/queries_new';
import {
  CREATE_LABEL,
  DELETE_LABEL,
  UPDATE_EMAIL_STARRED,
  MOVE_EMAIL,
  APPLY_LABEL,
  REMOVE_LABEL,
  SAVE_DRAFT,
  SEND_EMAIL,
  SWITCH_USER,
} from '../graphql/mutations_new';

export function useEmailClient() {
  const [selectedEmailId, setSelectedEmailId] = useState<number | undefined>();
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedLabelId, setSelectedLabelId] = useState<number | undefined>();
  const [_, setSearchQuery] = useState('');
  const [activeDraftId, setActiveDraftId] = useState<number | undefined>();

  // Queries
  const { data: currentUserData, refetch: refetchCurrentUser } = useQuery(GET_CURRENT_USER);
  const { data: allUsersData } = useQuery(GET_ALL_USERS);
  const {
    data: emailsData,
    loading: isLoadingEmails,
    error: emailsError,
    refetch: refetchEmails,
  } = useQuery(GET_EMAILS, {
    variables: { folder: selectedFolder },
    skip: !!selectedLabelId,
  });
  const {
    data: labelsData,
    // loading: isLoadingLabels,
    error: labelsError,
    refetch: refetchLabels,
  } = useQuery(GET_LABELS);
  const {
    data: emailDetailData,
    // loading: isLoadingEmailDetail,
    refetch: refetchEmailDetail,
  } = useQuery(GET_EMAIL_BY_ID, {
    variables: { emailId: selectedEmailId },
    skip: !selectedEmailId,
  });
  const { data: draftsData, refetch: refetchDrafts } = useQuery(GET_DRAFTS);

  // Mutations
  const [createLabelMutation] = useMutation(CREATE_LABEL);
  const [deleteLabelMutation] = useMutation(DELETE_LABEL);
  const [starEmailMutation] = useMutation(UPDATE_EMAIL_STARRED);
  const [moveEmailMutation] = useMutation(MOVE_EMAIL);
  const [applyLabelMutation] = useMutation(APPLY_LABEL);
  const [removeLabelMutation] = useMutation(REMOVE_LABEL);
  const [saveDraftMutation] = useMutation(SAVE_DRAFT);
  const [sendEmailMutation] = useMutation(SEND_EMAIL);
  const [switchUserMutation] = useMutation(SWITCH_USER, {
    onCompleted: () => {
      refetchCurrentUser();
      refetchEmails();
      refetchLabels();
      refetchDrafts();
      clearSelectedEmail();
    },
  });

  // Derived
  const selectedEmail = emailDetailData?.email || null;
  const activeDraft = draftsData?.drafts?.find((d: { id: number | undefined; }) => d.id === activeDraftId) || null;
  const emails = emailsData?.emails || [];
  const labels = labelsData?.labels || [];
  const drafts = draftsData?.drafts || [];
  const currentUser = currentUserData?.currentUser || null;
  const allUsers = allUsersData?.users || [];

  const unreadCount = emails.filter((e: { isRead: any; folder: string; }) => !e.isRead && e.folder === 'inbox').length;
  const draftCount = drafts.length;

  // Handlers
  const handleSelectEmail = useCallback((id: number) => {
    setSelectedEmailId(id);
  }, []);

  const handleSelectFolder = useCallback((folder: string) => {
    setSelectedFolder(folder);
    setSelectedLabelId(undefined);
    setSelectedEmailId(undefined);
  }, []);

  const handleSelectLabel = useCallback((id: number) => {
    setSelectedLabelId(id);
    setSelectedFolder('');
    setSelectedEmailId(undefined);
  }, []);

  const handleCreateLabel = async (name: string) => {
    await createLabelMutation({ variables: { name } });
    await refetchLabels();
  };

  const handleDeleteLabel = async (labelId: number) => {
    await deleteLabelMutation({ variables: { labelId } });
    await refetchLabels();
    if (selectedLabelId === labelId) {
      handleSelectFolder('inbox');
    }
  };


  const handleStarEmail = async (emailId: number, isStarred: boolean) => {
    await starEmailMutation({ variables: { emailId, isStarred } });
    await refetchEmails();
    await refetchEmailDetail();
  };

  const handleMoveEmail = async (emailId: number, folder: string) => {
    await moveEmailMutation({ variables: { emailId, folder } });
    await refetchEmails();
    clearSelectedEmail();
  };

  const handleApplyLabel = async (emailId: number, labelId: number) => {
    await applyLabelMutation({ variables: { emailId, labelId } });
    await refetchEmailDetail();
  };

  const handleRemoveLabel = async (emailId: number, labelId: number) => {
    await removeLabelMutation({ variables: { emailId, labelId } });
    await refetchEmailDetail();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    refetchEmails();
  };

  const handleSaveDraft = async (draft: { subject?: string; body?: string; recipients: string[] }) => {
    const result = await saveDraftMutation({ variables: draft });
    const draftId = result.data?.saveDraft?.id;
    if (draftId) setActiveDraftId(draftId);
    await refetchDrafts();
  };

  const handleSendEmail = async () => {
    const draft = drafts.find((d: { id: number | undefined; }) => d.id === activeDraftId);
    if (!draft) return;

    await sendEmailMutation({
      variables: {
        subject: draft.subject,
        body: draft.body,
        recipients: draft.recipients,
      },
    });
    setActiveDraftId(undefined);
    await refetchDrafts();
    if (selectedFolder === 'sent') {
      await refetchEmails();
    }
  };

  const clearSelectedEmail = () => {
    setSelectedEmailId(undefined);
  };

  const handleSwitchUser = async (userId: number) => {
    await switchUserMutation({ variables: { userId } });
  };

  const refreshEmails = () => {
    refetchEmails()
  };

  return {
    emails,
    selectedEmail,
    labels,
    selectedFolder,
    selectedLabelId,
    drafts,
    activeDraft,
    currentUser,
    allUsers,

    // States
    isLoadingEmails,
    emailsError,
    labelsError,

    // Counts
    unreadCount,
    draftCount,

    // Event handlers
    handleSelectEmail,
    handleSelectFolder,
    handleSelectLabel,
    handleCreateLabel,
    handleDeleteLabel,
    handleStarEmail,
    handleMoveEmail,
    handleApplyLabel,
    handleRemoveLabel,
    handleSearch,
    handleSaveDraft,
    handleSendEmail,
    refreshEmails,
    clearSelectedEmail,
    handleSwitchUser,
  };
}
