
import { DetailedFeedback } from '@/components/DetailedFeedbackForm';

// This would interact with a backend in a real application
export interface InterviewFeedback extends DetailedFeedback {
  id: string;
  candidateId: string;
  candidateName: string;
  interviewerId: string;
  interviewerName: string;
  problemId: string;
  problemTitle: string;
  interviewDate: Date;
  submittedAt: Date;
}

// Mock feedback data
const mockFeedback: InterviewFeedback[] = [
  {
    id: '1',
    candidateId: 'c1',
    candidateName: 'John Doe',
    interviewerId: 'i1',
    interviewerName: 'Jane Smith',
    problemId: '1',
    problemTitle: 'Two Sum',
    interviewDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000),
    technicalSkills: {
      problemSolving: 4,
      codeQuality: 3,
      dataStructures: 4,
      algorithms: 3,
      efficiency: 3
    },
    softSkills: {
      communication: 4,
      clarification: 4,
      collaboration: 5
    },
    notes: {
      strengths: 'Good approach to the problem, broke it down well. Used appropriate data structures.',
      areasOfImprovement: 'Could improve code readability and variable naming. Time complexity analysis was incomplete.',
      additionalComments: 'Overall strong candidate with good potential.'
    },
    overall: {
      hire: 'yes',
      recommendedLevel: 'mid',
      recommendedTeam: 'Backend'
    }
  }
];

// In-memory feedback storage for demo
let feedbackData: InterviewFeedback[] = [...mockFeedback];

export const submitFeedback = async (
  candidateId: string,
  candidateName: string,
  interviewerId: string, 
  interviewerName: string,
  problemId: string,
  problemTitle: string,
  interviewDate: Date,
  feedback: DetailedFeedback
): Promise<InterviewFeedback> => {
  const newFeedback: InterviewFeedback = {
    id: Date.now().toString(),
    candidateId,
    candidateName,
    interviewerId,
    interviewerName,
    problemId,
    problemTitle,
    interviewDate,
    submittedAt: new Date(),
    ...feedback
  };
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  feedbackData = [newFeedback, ...feedbackData];
  return newFeedback;
};

export const getFeedbackForCandidate = async (candidateId: string): Promise<InterviewFeedback[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return feedbackData.filter(f => f.candidateId === candidateId);
};

export const getFeedbackByInterviewer = async (interviewerId: string): Promise<InterviewFeedback[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return feedbackData.filter(f => f.interviewerId === interviewerId);
};

export const getFeedbackForProblem = async (problemId: string): Promise<InterviewFeedback[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return feedbackData.filter(f => f.problemId === problemId);
};

export const getAllFeedback = async (): Promise<InterviewFeedback[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [...feedbackData];
};
