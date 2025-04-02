
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { CheckCircle, AlertTriangle, Code, FileText, XCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { ProblemData } from './ProblemSubmissionForm';

interface ProblemVerificationPanelProps {
  problem: ProblemData;
  onApprove: (problem: ProblemData) => void;
  onReject: (problem: ProblemData, reason: string) => void;
  onEdit: (problem: ProblemData) => void;
  onClose: () => void;
}

const ProblemVerificationPanel: React.FC<ProblemVerificationPanelProps> = ({
  problem,
  onApprove,
  onReject,
  onEdit,
  onClose
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [viewSection, setViewSection] = useState<'description' | 'templates'>('description');

  const handleApprove = () => {
    onApprove(problem);
    toast.success('Problem approved and published');
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    onReject(problem, rejectionReason);
    toast.info('Problem rejected with feedback');
  };

  const difficultyColor = 
    problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800';

  return (
    <div className="bg-white rounded-xl shadow-md border p-6 max-w-4xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold mr-3">{problem.title}</h2>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColor}`}>
            {problem.difficulty}
          </span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(problem)}
          >
            Edit
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>

      <div className="mb-6 border-b">
        <div className="flex">
          <button
            onClick={() => setViewSection('description')}
            className={`py-2 px-4 text-sm font-medium ${
              viewSection === 'description' ? 'border-b-2 border-brand-500' : ''
            }`}
          >
            Problem Details
          </button>
          <button
            onClick={() => setViewSection('templates')}
            className={`py-2 px-4 text-sm font-medium ${
              viewSection === 'templates' ? 'border-b-2 border-brand-500' : ''
            }`}
          >
            Solution Templates
          </button>
        </div>
      </div>

      {viewSection === 'description' ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="whitespace-pre-line">{problem.description}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Examples</h3>
            <div className="space-y-3">
              {problem.examples.map((example, index) => (
                <div key={index} className="bg-gray-50 border rounded-md p-4">
                  <h4 className="font-medium mb-2">Example {index + 1}</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Input:</span> {example.input}</p>
                    <p><span className="font-medium">Output:</span> {example.output}</p>
                    {example.explanation && (
                      <p><span className="font-medium">Explanation:</span> {example.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Constraints</h3>
            <ul className="list-disc pl-5 space-y-1 bg-gray-50 rounded-md p-4">
              {problem.constraints.map((constraint, index) => (
                <li key={index} className="text-sm">{constraint}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Java Template</h3>
            <pre className="bg-gray-50 border rounded-md p-4 overflow-x-auto text-sm font-mono">
              {problem.solutionTemplate.java}
            </pre>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">C++ Template</h3>
            <pre className="bg-gray-50 border rounded-md p-4 overflow-x-auto text-sm font-mono">
              {problem.solutionTemplate.cpp}
            </pre>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Python Template</h3>
            <pre className="bg-gray-50 border rounded-md p-4 overflow-x-auto text-sm font-mono">
              {problem.solutionTemplate.python}
            </pre>
          </div>
        </div>
      )}

      {showRejectionForm ? (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-medium mb-2">Provide Feedback</h3>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-32"
            placeholder="Please provide specific feedback about why this problem is being rejected and what changes are needed..."
          />
          
          <div className="flex justify-end gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowRejectionForm(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleReject}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject with Feedback
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex justify-end gap-3">
          <Button 
            variant="outline"
            onClick={() => setShowRejectionForm(true)}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Request Changes
          </Button>
          <Button 
            onClick={handleApprove}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve & Publish
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProblemVerificationPanel;
