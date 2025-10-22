export interface User {
  user_id: string;
  email?: string;
  wallet_address: string;
  hez_balance: number;
  pez_balance: number;
  trust_score: number;
  is_citizen: boolean;
  kyc_status: 'not_started' | 'pending' | 'approved';
  kyc_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  transaction_id: string;
  from_address: string;
  to_address: string;
  amount: number;
  token_type: 'HEZ' | 'PEZ';
  status: string;
  timestamp: string;
}

export interface TrustScoreBreakdown {
  base_score: number;
  citizen_bonus: number;
  education_bonus: number;
  governance_bonus: number;
  validator_bonus: number;
  total_score: number;
}

export interface Proposal {
  proposal_id: string;
  title: string;
  description: string;
  category: string;
  votes_for: number;
  votes_against: number;
  status: string;
  created_at: string;
  ends_at: string;
}

export interface Course {
  course_id: string;
  title: string;
  description: string;
  difficulty: string;
  duration_hours: number;
  trust_score_reward: number;
  enrolled_count: number;
}