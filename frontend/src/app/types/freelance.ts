export interface JobReference {
  _id: string;
  title: string;
  category: string;
  budget: number;
}

export interface FreelancerBid {
  _id: string;
  job: JobReference;
  bidAmount: number;
  proposalText: string;
  estimatedDays: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface FreelancerStats {
  totalEarnings: number;
  activeContractsCount: number;
  proposalCount: number;
}