import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Job {
  _id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  status: 'open' | 'active' | 'completed' | 'under_review';
  client: { _id: string; name: string };
  createdAt: string;
}

interface JobState {
  jobsList: Job[];
  clientJobs: Job[];
  loading: boolean;
}

const initialState: JobState = {
  jobsList: [],
  clientJobs: [],
  loading: false,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobsList: (state, action: PayloadAction<Job[]>) => {
      state.jobsList = action.payload;
    },
    setClientJobs: (state, action: PayloadAction<Job[]>) => {
      state.clientJobs = action.payload;
    },
    addJob: (state, action: PayloadAction<Job>) => {
      state.clientJobs.unshift(action.payload);
      state.jobsList.unshift(action.payload);
    },
    setJobLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  
    updateJobStatus: (state, action: PayloadAction<{ jobId: string; status: 'open' | 'active' | 'completed' }>) => {
      const jobIndex = state.clientJobs.findIndex(j => j._id === action.payload.jobId);
      if (jobIndex !== -1) {
        state.clientJobs[jobIndex].status = action.payload.status;
      }

      const marketIndex = state.jobsList.findIndex(j => j._id === action.payload.jobId);
      if (marketIndex !== -1) {
        state.jobsList[marketIndex].status = action.payload.status;
      }
    }
  },
});

export const { setJobsList, setClientJobs, addJob, setJobLoading , updateJobStatus } = jobSlice.actions;
export default jobSlice.reducer;