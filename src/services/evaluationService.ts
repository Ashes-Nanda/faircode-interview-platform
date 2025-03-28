
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
  
  // This is a simulation - in a real app, we would actually run the code
  // against the test cases in a secure environment
  const testResults: TestResult[] = testCases.map((testCase, index) => {
    // Simulate different results
    // In a real implementation, we would compile and run the code against each test case
    const passed = Math.random() > 0.3; // 70% chance to pass each test
    
    return {
      passed,
      message: passed ? 'Test passed successfully' : 'Failed to match expected output',
      testCase: testCase.description,
      expected: testCase.expectedOutput,
      actual: passed ? testCase.expectedOutput : `[${index},${index+2}]`
    };
  });
  
  const passedCount = testResults.filter(result => result.passed).length;
  const score = Math.round((passedCount / testResults.length) * 100);
  
  return {
    testResults,
    score,
    passed: score >= 70 // Pass if 70% or more tests pass
  };
};
