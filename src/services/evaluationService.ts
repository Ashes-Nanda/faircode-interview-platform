
import { TestCase } from './compilerService';

export interface TestResult {
  passed: boolean;
  message: string;
  testCase: string;
  expected: string;
  actual: string;
}

export interface EvaluationResult {
  testResults: TestResult[];
  score: number;
  passed: boolean;
  executionTime?: number;
}

/**
 * Evaluates code against test cases and returns results
 * In a real app, this would call a secure backend service
 */
export const evaluateCode = async (
  code: string,
  language: 'java' | 'cpp' | 'python',
  problem: string
): Promise<EvaluationResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Demo test cases for the "Two Sum" problem
  const testCases = [
    {
      input: "[2,7,11,15], 9",
      expectedOutput: "[0,1]",
      description: "Basic case with solution at beginning of array"
    },
    {
      input: "[3,2,4], 6",
      expectedOutput: "[1,2]",
      description: "Solution in middle of array"
    },
    {
      input: "[3,3], 6",
      expectedOutput: "[0,1]",
      description: "Duplicate values that sum to target"
    },
    {
      input: "[1,2,3,4,5], 9",
      expectedOutput: "[3,4]",
      description: "Solution at end of array"
    },
    {
      input: "[-1,-2,-3,-4,-5], -8",
      expectedOutput: "[2,4]",
      description: "Negative numbers"
    }
  ];
  
  // This demonstrates a more deterministic approach for demo purposes
  // In a real implementation, we would actually run the code against each test case
  const testResults: TestResult[] = testCases.map((testCase, index) => {
    // For demo: make first 3 tests pass, and randomly determine the others
    // This creates a more predictable demo while still showing both passing and failing tests
    const passed = index < 3 ? true : Math.random() > 0.4;
    
    return {
      passed,
      message: passed ? 'Test passed successfully' : 'Failed to match expected output',
      testCase: testCase.description,
      expected: testCase.expectedOutput,
      actual: passed ? testCase.expectedOutput : `[${index},${Math.floor(Math.random() * 5)}]`
    };
  });
  
  const passedCount = testResults.filter(result => result.passed).length;
  const score = Math.round((passedCount / testResults.length) * 100);
  
  return {
    testResults,
    score,
    passed: score >= 70, // Pass if 70% or more tests pass
    executionTime: Math.round(Math.random() * 500) + 100 // Simulate execution time between 100-600ms
  };
};

// Function to generate AI feedback on code
export const generateCodeFeedback = async (
  code: string,
  language: 'java' | 'cpp' | 'python',
  testResults: TestResult[]
): Promise<string> => {
  // Simulate network delay for AI processing
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // This is a mock function - in a real app this would call an AI service
  const passRate = testResults.filter(t => t.passed).length / testResults.length;
  
  if (passRate === 1) {
    return "Your solution is correct and passes all test cases. The algorithm has optimal time complexity and is well-structured. Great job handling edge cases!";
  } else if (passRate >= 0.7) {
    return "Your solution passes most test cases but has some issues. Consider edge cases like empty arrays or duplicate values. There might be a more optimal approach with better time complexity.";
  } else {
    return "Your solution doesn't handle most test cases correctly. Review your algorithm logic, particularly how you're finding the pairs that sum to the target. Consider using a hash map to improve efficiency.";
  }
};

// Function to verify test cases for problem creation
export const verifyTestCases = async (
  testCases: {
    input: string;
    expectedOutput: string;
    description?: string;
  }[],
  language: 'java' | 'cpp' | 'python',
  solutionCode: string
): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, this would actually run the solution against the test cases to verify them
  // For this demo, we'll just simulate a successful verification
  return true;
};

// Function to validate problem description format
export const validateProblemFormat = (
  description: string,
  constraints: string[],
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[]
): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (!description.trim()) {
    errors.push('Problem description cannot be empty');
  }
  
  if (constraints.length === 0 || !constraints.some(c => c.trim())) {
    errors.push('At least one constraint must be provided');
  }
  
  if (examples.length === 0 || !examples.some(e => e.input && e.output)) {
    errors.push('At least one example with input and output must be provided');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
