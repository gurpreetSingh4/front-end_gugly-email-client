import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_EMAILS, GET_LABELS, GET_EMAIL_DETAIL, GET_DRAFTS, 
  GET_CURRENT_USER, GET_ALL_USERS
} from '../graphql/queries';
import {
  CREATE_LABEL, DELETE_LABEL, STAR_EMAIL, MOVE_EMAIL,
  ADD_LABEL_TO_EMAIL, REMOVE_LABEL_FROM_EMAIL,
  CREATE_DRAFT, UPDATE_DRAFT, DELETE_DRAFT, SEND_EMAIL,
  SWITCH_USER
} from '../graphql/mutations';
import { Email, Label, Draft } from '../graphql/schema';
import { apiRequest } from '../lib/queryClient';

export function useEmailClient() {
  // States
  const [selectedEmailId, setSelectedEmailId] = useState<number | undefined>();
  const [selectedFolder, setSelectedFolder] = useState<string>('inbox');
  const [selectedLabelId, setSelectedLabelId] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDraftId, setActiveDraftId] = useState<number | undefined>();
  const [currentUserId, setCurrentUserId] = useState<number>(1); // Default to first user
  
  // User queries
  const {
    data: currentUserData,
    loading: isLoadingCurrentUser,
    error: currentUserError,
    refetch: refetchCurrentUser
  } = useQuery(GET_CURRENT_USER);

  const {
    data: allUsersData,
    loading: isLoadingAllUsers,
    error: allUsersError
  } = useQuery(GET_ALL_USERS);

  // Emails and related queries
  const { 
    data: emailsData, 
    loading: isLoadingEmails, 
    error: emailsError,
    refetch: refetchEmails
  } = useQuery(GET_EMAILS, {
    variables: { folder: selectedFolder },
    skip: !!selectedLabelId, // Skip if we're viewing by label
  });
  
  const {
    data: labelsData,
    loading: isLoadingLabels,
    error: labelsError,
    refetch: refetchLabels
  } = useQuery(GET_LABELS);
  
  const {
    data: emailDetailData,
    loading: isLoadingEmailDetail,
    error: emailDetailError
  } = useQuery(GET_EMAIL_DETAIL, {
    variables: { id: selectedEmailId },
    skip: !selectedEmailId,
  });
  
  const {
    data: draftsData,
    loading: isLoadingDrafts,
    error: draftsError,
    refetch: refetchDrafts
  } = useQuery(GET_DRAFTS);
  
  // Use REST API as fallback
  useEffect(() => {
    if (!emailsData && !isLoadingEmails) {
      fetchEmails();
    }
    
    if (!labelsData && !isLoadingLabels) {
      fetchLabels();
    }
    
    if (selectedEmailId && !emailDetailData && !isLoadingEmailDetail) {
      fetchEmailDetail(selectedEmailId);
    }
    
    if (!draftsData && !isLoadingDrafts) {
      fetchDrafts();
    }
  }, [
    emailsData, isLoadingEmails, 
    labelsData, isLoadingLabels,
    selectedEmailId, emailDetailData, isLoadingEmailDetail,
    draftsData, isLoadingDrafts
  ]);
  
  // REST API fallback functions
  const fetchEmails = async () => {
    try {
      const url = selectedLabelId 
        ? `/api/emails?labelId=${selectedLabelId}` 
        : `/api/emails?folder=${selectedFolder}${searchQuery ? `&search=${searchQuery}` : ''}`;
      
      const response = await apiRequest('GET', url);
      const data = await response.json();
      // Manually update instead of relying on Apollo cache
      setEmails(data);
    } catch (error) {
      console.error('Failed to fetch emails:', error);
    }
  };
  
  const fetchLabels = async () => {
    try {
      const response = await apiRequest('GET', '/api/labels');
      const data = await response.json();
      setLabels(data);
    } catch (error) {
      console.error('Failed to fetch labels:', error);
    }
  };
  
  const fetchEmailDetail = async (id: number) => {
    try {
      const response = await apiRequest('GET', `/api/emails/${id}`);
      const data = await response.json();
      setSelectedEmailDetail(data);
    } catch (error) {
      console.error('Failed to fetch email detail:', error);
    }
  };
  
  const fetchDrafts = async () => {
    try {
      const response = await apiRequest('GET', '/api/drafts');
      const data = await response.json();
      setDrafts(data);
    } catch (error) {
      console.error('Failed to fetch drafts:', error);
    }
  };
  
  // Local state (when Apollo fails)
  const [emails, setEmails] = useState<Email[] | null>(null);
  const [labels, setLabels] = useState<Label[] | null>(null);
  const [selectedEmailDetail, setSelectedEmailDetail] = useState<Email | null>(null);
  const [drafts, setDrafts] = useState<Draft[] | null>(null);
  
  // Current email and draft
  const selectedEmail = emailDetailData?.email || selectedEmailDetail;
  const activeDraft = drafts?.find(draft => draft.id === activeDraftId);
  
  // Counts
  const unreadCount = emails?.filter(email => !email.isRead && email.folder === 'inbox').length || 0;
  const draftCount = drafts?.length || 0;
  
  // Event handlers
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
    
    // Fetch emails for this label
    fetchEmails();
  }, []);
  
  const handleCreateLabel = async (labelData: { name: string; color: string }) => {
    try {
      const response = await apiRequest('POST', '/api/labels', labelData);
      const newLabel = await response.json();
      
      // Update local state
      if (labels) {
        setLabels([...labels, newLabel]);
      }
      
      return newLabel;
    } catch (error) {
      console.error('Failed to create label:', error);
      throw error;
    }
  };
  
  const handleDeleteLabel = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/labels/${id}`);
      
      // Update local state
      if (labels) {
        setLabels(labels.filter(label => label.id !== id));
      }
      
      // If we were viewing this label, go back to inbox
      if (selectedLabelId === id) {
        handleSelectFolder('inbox');
      }
    } catch (error) {
      console.error('Failed to delete label:', error);
      throw error;
    }
  };
  
  const handleStarEmail = async (id: number, isStarred: boolean) => {
    try {
      const response = await apiRequest('POST', `/api/emails/${id}/star`, { isStarred });
      const updatedEmail = await response.json();
      
      // Update local state
      if (emails) {
        setEmails(emails.map(email => 
          email.id === id ? { ...email, isStarred } : email
        ));
      }
      
      if (selectedEmail && selectedEmail.id === id) {
        setSelectedEmailDetail({ ...selectedEmail, isStarred });
      }
      
      return updatedEmail;
    } catch (error) {
      console.error('Failed to star email:', error);
      throw error;
    }
  };
  
  const handleMoveEmail = async (id: number, folder: string) => {
    try {
      const response = await apiRequest('POST', `/api/emails/${id}/move`, { folder });
      const updatedEmail = await response.json();
      
      // Update local state
      if (emails) {
        setEmails(emails.filter(email => email.id !== id));
      }
      
      // If this was the selected email, clear it
      if (selectedEmailId === id) {
        setSelectedEmailId(undefined);
        setSelectedEmailDetail(null);
      }
      
      return updatedEmail;
    } catch (error) {
      console.error('Failed to move email:', error);
      throw error;
    }
  };
  
  const handleApplyLabel = async (emailId: number, labelId: number) => {
    try {
      const response = await apiRequest('POST', `/api/emails/${emailId}/labels`, { 
        labelId, 
        action: 'add' 
      });
      const updatedEmail = await response.json();
      
      // Update local state
      if (selectedEmail && selectedEmail.id === emailId) {
        const label = labels?.find(l => l.id === labelId);
        
        if (label && !selectedEmail.labelIds.includes(labelId)) {
          const updatedLabels = [...(selectedEmail.labels || []), label];
          const updatedLabelIds = [...selectedEmail.labelIds, labelId];
          
          setSelectedEmailDetail({
            ...selectedEmail,
            labelIds: updatedLabelIds,
            labels: updatedLabels
          });
        }
      }
      
      return updatedEmail;
    } catch (error) {
      console.error('Failed to apply label:', error);
      throw error;
    }
  };
  
  const handleRemoveLabel = async (emailId: number, labelId: number) => {
    try {
      const response = await apiRequest('POST', `/api/emails/${emailId}/labels`, { 
        labelId, 
        action: 'remove' 
      });
      const updatedEmail = await response.json();
      
      // Update local state
      if (selectedEmail && selectedEmail.id === emailId) {
        const updatedLabels = selectedEmail.labels.filter(label => label.id !== labelId);
        const updatedLabelIds = selectedEmail.labelIds.filter(id => id !== labelId);
        
        setSelectedEmailDetail({
          ...selectedEmail,
          labelIds: updatedLabelIds,
          labels: updatedLabels
        });
      }
      
      return updatedEmail;
    } catch (error) {
      console.error('Failed to remove label:', error);
      throw error;
    }
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchEmails();
  };
  
  const handleSaveDraft = async (draftData: { subject?: string; body?: string; recipients: string[] }) => {
    try {
      let response;
      let newDraft;
      
      if (activeDraftId) {
        // Update existing draft
        response = await apiRequest('PUT', `/api/drafts/${activeDraftId}`, draftData);
        newDraft = await response.json();
      } else {
        // Create new draft
        response = await apiRequest('POST', '/api/drafts', draftData);
        newDraft = await response.json();
        setActiveDraftId(newDraft.id);
      }
      
      // Update drafts in state
      await fetchDrafts();
      
      return newDraft;
    } catch (error) {
      console.error('Failed to save draft:', error);
      throw error;
    }
  };
  
  const handleSendEmail = async () => {
    if (!activeDraftId) return;
    
    try {
      await apiRequest('POST', `/api/drafts/${activeDraftId}/send`);
      
      // Clear active draft
      setActiveDraftId(undefined);
      
      // Refresh drafts and sent emails
      await fetchDrafts();
      if (selectedFolder === 'sent') {
        await fetchEmails();
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  };
  
  const handleDeleteDraft = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/drafts/${id}`);
      
      // Update local state
      if (drafts) {
        setDrafts(drafts.filter(draft => draft.id !== id));
      }
      
      // If this was the active draft, clear it
      if (activeDraftId === id) {
        setActiveDraftId(undefined);
      }
    } catch (error) {
      console.error('Failed to delete draft:', error);
      throw error;
    }
  };
  
  const refreshEmails = () => {
    fetchEmails();
  };
  
  const refreshLabels = () => {
    fetchLabels();
  };
  
  const clearSelectedEmail = () => {
    setSelectedEmailId(undefined);
    setSelectedEmailDetail(null);
  };

  // User switching mutation
  const [switchUserMutation] = useMutation(SWITCH_USER, {
    onCompleted: (data) => {
      // Refetch all the data for the new user
      refetchCurrentUser();
      refetchEmails();
      refetchLabels();
      refetchDrafts();
      
      // Reset email selection
      clearSelectedEmail();
    }
  });

  const handleSwitchUser = async (userId: number) => {
    try {
      await switchUserMutation({ variables: { userId: userId.toString() } });
      setCurrentUserId(userId);
    } catch (error) {
      console.error('Failed to switch user:', error);
    }
  };
  
  // Local state for users (when Apollo fails)
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  
  return {
    // Data
    emails: emailsData?.emails || emails || [],
    selectedEmail,
    labels: labelsData?.labels || labels || [],
    selectedFolder,
    selectedLabelId,
    searchQuery,
    drafts: draftsData?.drafts || drafts || [],
    activeDraft,
    currentUser: currentUserData?.currentUser || currentUser,
    allUsers: allUsersData?.users || allUsers || [],
    
    // States
    isLoadingEmails,
    isLoadingLabels,
    emailsError,
    labelsError,
    isLoadingCurrentUser,
    isLoadingAllUsers,
    
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
    handleDeleteDraft,
    refreshEmails,
    refreshLabels,
    clearSelectedEmail,
    handleSwitchUser
  };
}
