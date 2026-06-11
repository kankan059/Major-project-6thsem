export interface Bid {
  _id: string;
  job: string;
  freelancer: {
    _id: string;
    name: string;
    email: string;
  };
  bidAmount: number;
  proposalText: string;
  estimatedDays: number;
  status: 'pending' | 'accepted' | 'rejected';
}