import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMyAttempts } from '@/services/quizService';
import { Link } from 'react-router-dom';
import { ClockIcon, DocumentTextIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttempts();
  }, []);

  const loadAttempts = async () => {
    try {
      setLoading(true);
      const data = await getMyAttempts();
      setAttempts(data);
    } catch (err) {
      console.error('Error loading attempts:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getStatusBadge = (attempt) => {
    if (attempt.isTerminatedDueToTabSwitch) {
      return <span className="badge bg-red-100 text-red-800"><XCircleIcon className="h-4 w-4 inline mr-1" />Terminated</span>;
    }
    if (attempt.endTime) {
      return <span className="badge bg-green-100 text-green-800"><CheckCircleIcon className="h-4 w-4 inline mr-1" />Completed</span>;
    }
    return <span className="badge bg-yellow-100 text-yellow-800"><ClockIcon className="h-4 w-4 inline mr-1" />In Progress</span>;
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-600 mt-1">Track your quiz attempts and scores</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold flex items-center">
            <DocumentTextIcon className="h-6 w-6 mr-2" />
            My Quiz Attempts
          </h2>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading attempts...</div>
          ) : attempts.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">No quiz attempts yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Your instructor will share quiz links with you. Complete them to see results here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.map((attempt) => (
                <div key={attempt._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{attempt.quiz?.title || 'Quiz'}</h3>
                      <p className="text-gray-600 text-sm mt-1">{attempt.quiz?.description}</p>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                        <span className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {formatDate(attempt.startTime)}
                        </span>
                        {attempt.endTime && (
                          <>
                            <span>Score: <strong className="text-gray-900">{attempt.score || 0}/{attempt.maxScore}</strong></span>
                            <span>Time: <strong className="text-gray-900">{Math.round((attempt.timeSpent || 0) / 60)}min</strong></span>
                          </>
                        )}
                        <span>Tab Switches: <strong className={attempt.tabSwitchCount >= attempt.tabSwitchLimit ? 'text-red-600' : 'text-gray-900'}>{attempt.tabSwitchCount}/{attempt.tabSwitchLimit}</strong></span>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col items-end gap-2">
                      {getStatusBadge(attempt)}
                      {attempt.endTime && (
                        <Link 
                          to={`/report/${attempt._id}`}
                          className="btn btn-sm btn-primary"
                        >
                          View Report
                        </Link>
                      )}
                      {!attempt.endTime && !attempt.isTerminatedDueToTabSwitch && (
                        <Link 
                          to={`/exam/${attempt._id}`}
                          className="btn btn-sm btn-secondary"
                        >
                          Resume
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card bg-indigo-50 border-indigo-200">
        <div className="card-body">
          <h3 className="font-semibold text-indigo-900 mb-2">📚 How to Take a Quiz</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-indigo-800">
            <li>Get the quiz link from your instructor</li>
            <li>Click the link to view quiz details</li>
            <li>Start the quiz when ready</li>
            <li>Complete all questions within the time limit</li>
            <li>Avoid switching tabs (limited switches allowed)</li>
            <li>Submit your answers before time runs out</li>
            <li>View your results and feedback here</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
