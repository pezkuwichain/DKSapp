import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || 'https://citizenpez.preview.emergentagent.com';

export const api = {
  // Auth
  signup: async (email?: string) => {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, preferred_language: 'en' }),
    });
    return response.json();
  },

  login: async (wallet_address: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_address }),
    });
    return response.json();
  },

  // User
  getUser: async (user_id: string) => {
    const response = await fetch(`${API_URL}/api/user/${user_id}`);
    return response.json();
  },

  getWallet: async (user_id: string) => {
    const response = await fetch(`${API_URL}/api/user/${user_id}/wallet`);
    return response.json();
  },

  // Trust Score
  getTrustScore: async (user_id: string) => {
    const response = await fetch(`${API_URL}/api/trust-score/${user_id}`);
    return response.json();
  },

  // KYC
  submitKYC: async (user_id: string, kycData: any) => {
    const response = await fetch(`${API_URL}/api/kyc/submit/${user_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(kycData),
    });
    return response.json();
  },

  // Transactions
  createTransaction: async (user_id: string, txData: any) => {
    const response = await fetch(`${API_URL}/api/transactions/${user_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(txData),
    });
    return response.json();
  },

  getTransactions: async (user_id: string) => {
    const response = await fetch(`${API_URL}/api/transactions/${user_id}`);
    return response.json();
  },

  // Governance
  getProposals: async () => {
    const response = await fetch(`${API_URL}/api/governance/proposals`);
    return response.json();
  },

  vote: async (user_id: string, proposal_id: string, vote_type: string) => {
    const response = await fetch(`${API_URL}/api/governance/vote/${user_id}?proposal_id=${proposal_id}&vote_type=${vote_type}`, {
      method: 'POST',
    });
    return response.json();
  },

  // Education
  getCourses: async () => {
    const response = await fetch(`${API_URL}/api/education/courses`);
    return response.json();
  },

  enrollCourse: async (user_id: string, course_id: string) => {
    const response = await fetch(`${API_URL}/api/education/enroll/${user_id}?course_id=${course_id}`, {
      method: 'POST',
    });
    return response.json();
  },

  getMyCourses: async (user_id: string) => {
    const response = await fetch(`${API_URL}/api/education/my-courses/${user_id}`);
    return response.json();
  },

  // Feature Check
  checkFeatureAccess: async (user_id: string, feature: string) => {
    const response = await fetch(`${API_URL}/api/features/check/${user_id}?feature=${feature}`);
    return response.json();
  },
};