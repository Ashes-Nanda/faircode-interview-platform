
import React from 'react';
import { motion } from 'framer-motion';
import { Code, ArrowRight, Sparkles } from 'lucide-react';

interface ProblemDifficulty {
  level: 'Easy' | 'Medium' | 'Hard';
  color: string;
}

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: ProblemDifficulty;
  completionRate: number;
  tags: string[];
  isFeatured?: boolean;
}

interface PracticeProblemsPanelProps {
  onStartProblem: (id?: string) => void;
}

const PracticeProblemsPanel: React.FC<PracticeProblemsPanelProps> = ({ onStartProblem }) => {
  // Mock data for practice problems
  const problems: Problem[] = [
    {
      id: 'prob-001',
      title: 'Two Sum',
      description: 'Find two numbers in an array that add up to a target.',
      difficulty: { level: 'Easy', color: 'bg-green-100 text-green-700' },
      completionRate: 75,
      tags: ['Array', 'Hash Table'],
      isFeatured: true
    },
    {
      id: 'prob-002',
      title: 'Valid Parentheses',
      description: 'Determine if the input string has valid parentheses.',
      difficulty: { level: 'Easy', color: 'bg-green-100 text-green-700' },
      completionRate: 68,
      tags: ['String', 'Stack']
    },
    {
      id: 'prob-003',
      title: 'Merge Intervals',
      description: 'Merge all overlapping intervals and return non-overlapping intervals.',
      difficulty: { level: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
      completionRate: 42,
      tags: ['Array', 'Sorting']
    },
    {
      id: 'prob-004',
      title: 'LRU Cache',
      description: 'Design and implement a Least Recently Used (LRU) cache.',
      difficulty: { level: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
      completionRate: 35,
      tags: ['Hash Table', 'Linked List', 'Design']
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Practice Problems</h2>
        <button 
          className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center"
          onClick={() => onStartProblem()}
        >
          View All
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </button>
      </div>
      
      {/* Featured Problem */}
      {problems.find(p => p.isFeatured) && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium">Featured Problem</span>
            <Sparkles className="ml-2 h-3.5 w-3.5 text-amber-500" />
          </div>
          
          {problems
            .filter(problem => problem.isFeatured)
            .map(problem => (
              <motion.div
                key={problem.id}
                whileHover={{ scale: 1.01 }}
                className="border border-brand-100 bg-brand-50/30 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{problem.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{problem.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${problem.difficulty.color}`}>
                        {problem.difficulty.level}
                      </span>
                      {problem.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => onStartProblem(problem.id)}
                    className="shrink-0 text-sm bg-brand-600 hover:bg-brand-700 text-white px-3 py-1 rounded-md flex items-center"
                  >
                    Solve
                    <Code className="ml-1 h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      )}
      
      {/* Problem List */}
      <div className="space-y-2">
        {problems.filter(problem => !problem.isFeatured).map(problem => (
          <motion.div
            key={problem.id}
            whileHover={{ scale: 1.01 }}
            className="border border-gray-100 hover:border-gray-200 rounded-lg p-3"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{problem.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${problem.difficulty.color}`}>
                    {problem.difficulty.level}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {problem.completionRate}% completion rate
                  </span>
                </div>
              </div>
              <button
                onClick={() => onStartProblem(problem.id)}
                className="text-sm border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded-md"
              >
                Solve
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PracticeProblemsPanel;
