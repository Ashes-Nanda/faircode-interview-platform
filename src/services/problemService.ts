
import { ProblemData } from '@/components/ProblemSubmissionForm';

// This would interact with a backend in a real application
export interface Problem extends ProblemData {
  id: string;
  createdBy: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  verifiedBy?: string;
}

// Mock problems for demo purposes
const mockProblems: Problem[] = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      }
    ],
    constraints: [
      '2 <= nums.length <= 104',
      '-109 <= nums[i] <= 109',
      '-109 <= target <= 109',
      'Only one valid answer exists.'
    ],
    solutionTemplate: {
      java: 'public int[] twoSum(int[] nums, int target) {\n    // Your code implementation\n    return new int[0];\n}',
      cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code implementation\n    return {};\n}',
      python: 'def twoSum(nums, target):\n    # Your code implementation\n    return []'
    },
    createdBy: 'jane.smith@example.com',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'approved'
  },
  {
    id: '2',
    title: 'Valid Parentheses',
    difficulty: 'Medium',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.',
    examples: [
      {
        input: 's = "()"',
        output: 'true',
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
      },
      {
        input: 's = "(]"',
        output: 'false',
      }
    ],
    constraints: [
      '1 <= s.length <= 104',
      's consists of parentheses only \'()[]{}\''
    ],
    solutionTemplate: {
      java: 'public boolean isValid(String s) {\n    // Your code implementation\n    return false;\n}',
      cpp: 'bool isValid(string s) {\n    // Your code implementation\n    return false;\n}',
      python: 'def isValid(s):\n    # Your code implementation\n    return False'
    },
    createdBy: 'interviewer@company.com',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'pending'
  }
];

// In-memory problem storage for demo
let problems: Problem[] = [...mockProblems];

export const submitProblem = async (problem: ProblemData): Promise<Problem> => {
  const newProblem: Problem = {
    ...problem,
    id: Date.now().toString(),
    createdBy: 'current-user@example.com', // In a real app, this would come from auth
    createdAt: new Date(),
    status: 'pending'
  };
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  problems = [newProblem, ...problems];
  return newProblem;
};

export const getPendingProblems = async (): Promise<Problem[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return problems.filter(p => p.status === 'pending');
};

export const getApprovedProblems = async (): Promise<Problem[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return problems.filter(p => p.status === 'approved');
};

export const approveProblem = async (id: string, verifiedBy: string): Promise<Problem> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = problems.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Problem not found');
  }
  
  const updatedProblem = {
    ...problems[index],
    status: 'approved',
    verifiedBy
  } as Problem;
  
  problems = [
    ...problems.slice(0, index),
    updatedProblem,
    ...problems.slice(index + 1)
  ];
  
  return updatedProblem;
};

export const rejectProblem = async (id: string, verifiedBy: string, reason: string): Promise<Problem> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = problems.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Problem not found');
  }
  
  const updatedProblem = {
    ...problems[index],
    status: 'rejected',
    verifiedBy,
    rejectionReason: reason
  } as Problem & { rejectionReason: string };
  
  problems = [
    ...problems.slice(0, index),
    updatedProblem,
    ...problems.slice(index + 1)
  ];
  
  return updatedProblem;
};

export const editProblem = async (problem: Problem): Promise<Problem> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = problems.findIndex(p => p.id === problem.id);
  if (index === -1) {
    throw new Error('Problem not found');
  }
  
  problems = [
    ...problems.slice(0, index),
    problem,
    ...problems.slice(index + 1)
  ];
  
  return problem;
};
