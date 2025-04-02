
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { toast } from 'sonner';
import { Code, FileText, CheckCircle, X } from 'lucide-react';

interface ProblemSubmissionFormProps {
  onSubmit: (problem: ProblemData) => void;
  onClose: () => void;
}

export interface ProblemData {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  solutionTemplate: {
    java: string;
    cpp: string;
    python: string;
  };
}

const ProblemSubmissionForm: React.FC<ProblemSubmissionFormProps> = ({
  onSubmit,
  onClose
}) => {
  const [problem, setProblem] = useState<ProblemData>({
    title: '',
    difficulty: 'Medium',
    description: '',
    examples: [{ input: '', output: '', explanation: '' }],
    constraints: [''],
    solutionTemplate: {
      java: '// Java solution template\npublic class Solution {\n    public int[] solve(int[] nums) {\n        // Your implementation here\n        return new int[0];\n    }\n}',
      cpp: '// C++ solution template\nclass Solution {\npublic:\n    vector<int> solve(vector<int>& nums) {\n        // Your implementation here\n        return {};\n    }\n};',
      python: '# Python solution template\ndef solve(nums):\n    # Your implementation here\n    return []'
    }
  });

  const handleChange = (field: string, value: string) => {
    setProblem(prev => ({ ...prev, [field]: value }));
  };

  const handleExampleChange = (index: number, field: string, value: string) => {
    setProblem(prev => {
      const examples = [...prev.examples];
      examples[index] = { ...examples[index], [field]: value };
      return { ...prev, examples };
    });
  };

  const addExample = () => {
    setProblem(prev => ({
      ...prev,
      examples: [...prev.examples, { input: '', output: '', explanation: '' }]
    }));
  };

  const removeExample = (index: number) => {
    setProblem(prev => {
      const examples = prev.examples.filter((_, i) => i !== index);
      return { ...prev, examples };
    });
  };

  const handleConstraintChange = (index: number, value: string) => {
    setProblem(prev => {
      const constraints = [...prev.constraints];
      constraints[index] = value;
      return { ...prev, constraints };
    });
  };

  const addConstraint = () => {
    setProblem(prev => ({
      ...prev,
      constraints: [...prev.constraints, '']
    }));
  };

  const removeConstraint = (index: number) => {
    setProblem(prev => {
      const constraints = prev.constraints.filter((_, i) => i !== index);
      return { ...prev, constraints };
    });
  };

  const handleTemplateChange = (language: keyof typeof problem.solutionTemplate, value: string) => {
    setProblem(prev => ({
      ...prev,
      solutionTemplate: {
        ...prev.solutionTemplate,
        [language]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!problem.title.trim()) {
      toast.error('Please provide a problem title');
      return;
    }
    
    if (!problem.description.trim()) {
      toast.error('Please provide a problem description');
      return;
    }
    
    // Filter out empty examples and constraints
    const filteredProblem = {
      ...problem,
      examples: problem.examples.filter(ex => ex.input.trim() || ex.output.trim()),
      constraints: problem.constraints.filter(c => c.trim())
    };
    
    if (filteredProblem.examples.length === 0) {
      toast.error('Please provide at least one example');
      return;
    }
    
    onSubmit(filteredProblem);
    toast.success('Problem submitted successfully');
  };

  return (
    <div className="bg-white rounded-xl shadow-md border p-6 max-w-4xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Submit New Coding Problem</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Problem Title
            </label>
            <input
              type="text"
              value={problem.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="Two Sum, Binary Tree Traversal, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Difficulty Level
            </label>
            <select
              value={problem.difficulty}
              onChange={(e) => handleChange('difficulty', e.target.value as 'Easy' | 'Medium' | 'Hard')}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Problem Description
          </label>
          <textarea
            value={problem.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-24"
            placeholder="Describe the problem, including what the function needs to do..."
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              Examples
            </label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addExample}
            >
              Add Example
            </Button>
          </div>
          
          <div className="space-y-4">
            {problem.examples.map((example, index) => (
              <div key={index} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Example {index + 1}</h4>
                  {problem.examples.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeExample(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Input
                    </label>
                    <input
                      type="text"
                      value={example.input}
                      onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      placeholder="nums = [2,7,11,15], target = 9"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Output
                    </label>
                    <input
                      type="text"
                      value={example.output}
                      onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      placeholder="[0,1]"
                    />
                  </div>
                </div>
                
                <div className="mt-2">
                  <label className="block text-xs font-medium mb-1">
                    Explanation (optional)
                  </label>
                  <input
                    type="text"
                    value={example.explanation}
                    onChange={(e) => handleExampleChange(index, 'explanation', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              Constraints
            </label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addConstraint}
            >
              Add Constraint
            </Button>
          </div>
          
          <div className="space-y-2">
            {problem.constraints.map((constraint, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  value={constraint}
                  onChange={(e) => handleConstraintChange(index, e.target.value)}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                  placeholder="2 <= nums.length <= 104"
                />
                {problem.constraints.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeConstraint(index)}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Solution Templates
          </label>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h5 className="text-sm font-medium">Java</h5>
              </div>
              <textarea
                value={problem.solutionTemplate.java}
                onChange={(e) => handleTemplateChange('java', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm h-32"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <h5 className="text-sm font-medium">C++</h5>
              </div>
              <textarea
                value={problem.solutionTemplate.cpp}
                onChange={(e) => handleTemplateChange('cpp', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm h-32"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <h5 className="text-sm font-medium">Python</h5>
              </div>
              <textarea
                value={problem.solutionTemplate.python}
                onChange={(e) => handleTemplateChange('python', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm h-32"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
          >
            <FileText className="h-4 w-4 mr-2" />
            Submit Problem
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProblemSubmissionForm;
