
export interface Message {
  _id: string;
  job: string;
  sender: string;
  text: string;
  createdAt: string;
}

export interface WorkspaceJobDetails {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'active' | 'under_review' | 'completed';
  budget: number;
  client: string;
  hiredFreelancer: string;
}

export interface WorkSubmissionData {
  deliveryNotes: string;
  fileUrl: string;
}
