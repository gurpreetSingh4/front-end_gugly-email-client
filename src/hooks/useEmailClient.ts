import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const baseURL = `${import.meta.env.VITE_EMAIL_SERVICE_URL}/api/email`;

function getQueryParams() {
  const userId = localStorage.getItem('regUserId');
  const regEmail = sessionStorage.getItem('regEmail');
  return { userId, regEmail };
}
console.log("emailclient query parameter here", getQueryParams())

export function useEmailClient() {
  const [selectedEmailId, setSelectedEmailId] = useState<number | undefined>();
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedLabelId, setSelectedLabelId] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDraftId, setActiveDraftId] = useState<number | undefined>();

  const [emails, setEmails] = useState([]);
  const [labels, setLabels] = useState([]);
  const [emailDetail, setEmailDetail] = useState(null);
  const [drafts, setDrafts] = useState<{ id: number; subject?: string; body?: string; recipients: string[] }[]>([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [emailsError, setEmailsError] = useState<any>(null);
  const [labelsError, setLabelsError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchEmails = useCallback(async () => {
    try {
      setLoading(true);
      setEmailsError(null);
      const { userId, regEmail } = getQueryParams();
      const response = await axios.get(`${baseURL}/emails`, {
        params: { userid: userId, regemail: regEmail, folder: selectedFolder },

      });
      console.log("/emails", Object.entries(response.data))
      setEmails(response.data || []);
      setEmailsError(null);

    } catch (error) {
      setEmailsError(error);
    } finally {
      setLoading(false);
    }
  }, [selectedFolder])

  const fetchLabels = async () => {
    try {
      setLabelsError(null);
      const { userId, regEmail } = getQueryParams();
      const response = await axios.get(`${baseURL}/labels`, {
        params: { userid: userId, regemail: regEmail },
      });
      console.log("/labels", Object.entries(response.data))

      setLabels(response.data || []);
    } catch (error) {
      setLabelsError(error);
    }
  };

  const fetchCurrentUser = async () => {
    const { userId, regEmail } = getQueryParams();
    const response = await axios.get(`${baseURL}/currentuser`, {
      params: { userid: userId, regemail: regEmail },
    });
    console.log("/currentuser", Object.entries(response.data))

    setCurrentUser(response.data);
  };

  const fetchAllUsers = async () => {
    const { userId } = getQueryParams();
    const response = await axios.get(`${baseURL}/users`, {
      params: { userid: userId },
    });
    console.log("/users", Object.entries(response.data))

    setAllUsers(response.data);
  };

  const fetchEmailById = useCallback(async (emailId: number) => {
    const { userId, regEmail } = getQueryParams();
    const response = await axios.get(`${baseURL}/email`, {
      params: { userid: userId, regemail: regEmail },
      data: { id: emailId },
    });
    console.log("/email", Object.entries(response.data))

    setEmailDetail(response.data);
  }, [])

  const fetchDrafts = async () => {
    const { userId, regEmail } = getQueryParams();
    const response = await axios.get(`${baseURL}/drafts`, {
      params: { userid: userId, regemail: regEmail },
    });
    console.log("/drafts", Object.entries(response.data))

    setDrafts(response.data);
  };

  const handleCreateLabel = async (name: string) => {
    const { userId, regEmail } = getQueryParams();
    await axios.post(`${baseURL}/createlabel`, { name }, {
      params: { userid: userId, regemail: regEmail },
    });
    await fetchLabels();
    console.log("done  /createlabel")

  };

  const handleDeleteLabel = async (labelId: number) => {
    const { userId, regEmail } = getQueryParams();
    await axios.post(`${baseURL}/deletelabel`, { id: labelId }, {
      params: { userid: userId, regemail: regEmail },
    });
    await fetchLabels();
    if (selectedLabelId === labelId) handleSelectFolder('inbox');

    console.log("done  /deletelabel")

  };

  const handleStarEmail = async (emailId: number, isStarred: boolean) => {
    const { userId, regEmail } = getQueryParams();
    await axios.post(`${baseURL}/updateemailstarred`, { id: emailId, isStarred }, {
      params: { userid: userId, regemail: regEmail },
    });
    await fetchEmails();
    await fetchEmailById(emailId);

    console.log("done  /updateemailstarred")

  };

  const handleMoveEmail = async (emailId: number, folder: string) => {
    const { userId, regEmail } = getQueryParams();
    await axios.post(`${baseURL}/moveemail`, { id: emailId, folder }, {
      params: { userid: userId, regemail: regEmail },
    });
    await fetchEmails();
    clearSelectedEmail();

    console.log("done  /moveemail")

  };

  const handleApplyLabel = async (emailId: number, labelId: number) => {
    const { userId, regEmail } = getQueryParams();
    await axios.post(`${baseURL}/applylabel`, { emailId, labelId }, {
      params: { userid: userId, regemail: regEmail },
    });
    await fetchEmailById(emailId);
    console.log("done  /applylabel")

  };

  const handleRemoveLabel = async (emailId: number, labelId: number) => {
    const { userId, regEmail } = getQueryParams();
    await axios.post(`${baseURL}/removelabel`, { emailId, labelId }, {
      params: { userid: userId, regemail: regEmail },
    });
    await fetchEmailById(emailId);
    console.log("done  /removelabel")

  };

  const handleSaveDraft = async (draft: { subject?: string; body?: string; recipients: string[] }) => {
    const { userId, regEmail } = getQueryParams();
    const result = await axios.post(`${baseURL}/savedraft`, draft, {
      params: { userid: userId, regemail: regEmail },
    });
    const draftId = result.data?.id;
    if (draftId) setActiveDraftId(draftId);
    await fetchDrafts();
    console.log("done  /savedraft")

  };

  const handleSendEmail = async () => {
    const draft = drafts.find((d: any) => d.id === activeDraftId);
    if (!draft) return;

    const { userId, regEmail } = getQueryParams();
    await axios.post(`${baseURL}/sendemail`, {
      subject: draft.subject,
      body: draft.body,
      recipients: draft.recipients,
    }, {
      params: { userid: userId, regemail: regEmail },
    });
    setActiveDraftId(undefined);
    await fetchDrafts();
    if (selectedFolder === 'sent') await fetchEmails();

    console.log("done  /sendemail")

  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    const { userId, regEmail } = getQueryParams();
    const response = await axios.get(`${baseURL}/searchemails`, {
      params: { userid: userId, regemail: regEmail },
      data: { query },
    });
    setEmails(response.data || []);
    console.log("done  /searchemails")

  };

  const handleSwitchUser = async (userId: number, email: string) => {
    // Assume you store new user info
    localStorage.setItem('regUserId', userId.toString());
    localStorage.setItem('regEmail', email.toString());
    localStorage.setItem('userId', email.toString());
    sessionStorage.setItem('regEmail', email.toString());
    sessionStorage.setItem('regUserId', userId.toString());
    sessionStorage.setItem('userId', userId.toString());

    getQueryParams()
    await fetchCurrentUser();
    await fetchEmails();
    await fetchLabels();
    await fetchDrafts();
    clearSelectedEmail();
  };

  const clearSelectedEmail = () => {
    setSelectedEmailId(undefined);
  };

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

  const refreshEmails = () => {
    fetchEmails();
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchAllUsers();
    fetchEmails();
    fetchLabels();
    fetchDrafts();
  }, [selectedFolder]);

  const selectedEmail = emailDetail;
  const activeDraft = drafts.find((d: any) => d.id === activeDraftId) || null;
  const unreadCount = emails.filter((e: any) => !e.isRead && e.folder === 'inbox').length;
  const draftCount = drafts.length;

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
    isLoadingEmails: loading,
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
