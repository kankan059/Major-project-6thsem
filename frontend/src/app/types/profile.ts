export interface ReviewData {
  _id: string;
  from: {
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface FreelancerProfileDetails {
  _id: string;
  name: string;
  email: string;
  averageRating: number;
  totalReviews: number;
  reviews?: ReviewData[];
}