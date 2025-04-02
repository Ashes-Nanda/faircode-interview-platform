
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Plus, FileText, CheckCircle, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import ProblemSubmissionForm from './ProblemSubmissionForm';
import ProblemVerificationPanel from './ProblemVerificationPanel';
import { submitProblem, getPendingProblems, getApprovedProblems, approveProblem, rejectProblem, Problem } from '../services/problemService';

const ProblemSubmissionManager: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [pendingProblems, setPendingProblems] = useState<Problem[]>([]);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showVerificationPanel, setShowVerificationPanel] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [expandedSection, setExpandedSection] = useState<'approved' | 'pending'>('pending');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    setIsLoading(true);
    try {
      const [approved, pending] = await Promise.all([
        getApprovedProblems(),
        getPendingProblems()
      ]);
      setProblems(approved);
      setPendingProblems(pending);
    } catch (error) {
      console.error('Error fetching problems:', error);
      toast.error('Failed to load problems');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitProblem = async (problemData: any) => {
    try {
      await submitProblem(problemData);
      setShowSubmissionForm(false);
      toast.success('Problem submitted successfully');
      fetchProblems();
    } catch (error) {
      console.error('Error submitting problem:', error);
      toast.error('Failed to submit problem');
    }
  };

  const handleVerifyProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setShowVerificationPanel(true);
  };

  const handleApproveProblem = async (problem: Problem) => {
    try {
      await approveProblem(problem.id, 'current-interviewer@example.com');
      setShowVerificationPanel(false);
      toast.success('Problem approved and published');
      fetchProblems();
    } catch (error) {
      console.error('Error approving problem:', error);
      toast.error('Failed to approve problem');
    }
  };

  const handleRejectProblem = async (problem: Problem, reason: string) => {
    try {
      await rejectProblem(problem.id, 'current-interviewer@example.com', reason);
      setShowVerificationPanel(false);
      toast.info('Problem rejected with feedback');
      fetchProblems();
    } catch (error) {
      console.error('Error rejecting problem:', error);
      toast.error('Failed to reject problem');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Problem Management</h2>
        <Button onClick={() => setShowSubmissionForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Problem
        </Button>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-soft border overflow-hidden">
          <button
            className="flex justify-between items-center w-full p-4 bg-gray-50 hover:bg-gray-100 text-left"
            onClick={() => setExpandedSection(expandedSection === 'pending' ? 'approved' : 'pending')}
          >
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-500" />
              <h3 className="font-medium">Pending Review ({pendingProblems.length})</h3>
            </div>
            {expandedSection === 'pending' ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {expandedSection === 'pending' && (
            <div className="p-4">
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : pendingProblems.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No problems pending review
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingProblems.map(problem => (
                    <div 
                      key={problem.id}
                      className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
                    >
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">{problem.title}</h4>
                          <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Submitted on {formatDate(problem.createdAt)}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyProblem(problem)}
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-soft border overflow-hidden">
          <button
            className="flex justify-between items-center w-full p-4 bg-gray-50 hover:bg-gray-100 text-left"
            onClick={() => setExpandedSection(expandedSection === 'approved' ? 'pending' : 'approved')}
          >
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              <h3 className="font-medium">Published Problems ({problems.length})</h3>
            </div>
            {expandedSection === 'approved' ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {expandedSection === 'approved' && (
            <div className="p-4">
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : problems.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No published problems
                </div>
              ) : (
                <div className="space-y-3">
                  {problems.map(problem => (
                    <div 
                      key={problem.id}
                      className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
                    >
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">{problem.title}</h4>
                          <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Published on {formatDate(problem.createdAt)}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyProblem(problem)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showSubmissionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <ProblemSubmissionForm
            onSubmit={handleSubmitProblem}
            onClose={() => setShowSubmissionForm(false)}
          />
        </div>
      )}

      {showVerificationPanel && selectedProblem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <ProblemVerificationPanel
            problem={selectedProblem}
            onApprove={handleApproveProblem}
            onReject={handleRejectProblem}
            onEdit={(problem) => console.log('Edit problem:', problem)} // Implement edit functionality if needed
            onClose={() => {
              setShowVerificationPanel(false);
              setSelectedProblem(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProblemSubmissionManager;
