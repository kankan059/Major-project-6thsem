export interface Job {
  _id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  status: 'open' | 'active' | 'completed' | 'under_review';
  client: { _id: string; name: string };
  createdAt: string;
}

export interface JobFormData {
  title: string;
  description: string;
  budget: string;
  category: string;
}

export interface ClientReference {
  _id: string;
  name: string;
  email: string;
}

export interface MarketplaceJob {
  _id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  status: 'open' | 'active' | 'completed';
  client: ClientReference;
  createdAt: string;
}

export interface ClientDetails {
  _id: string;
  name: string;
  email: string;
}

export interface SingleJobConfig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  status: 'open' | 'active' | 'completed';
  client: ClientDetails;
  createdAt: string;
}

export interface ProposalSubmitData {
  bidAmount: string;
  estimatedDays: string;
  proposalText: string;
}

export interface BackendErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}