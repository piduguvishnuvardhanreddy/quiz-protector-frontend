import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listQuizzes } from '@/services/quizService';
import { toast } from 'react-toastify';
import { 
  PlusCircleIcon, 
  ClipboardDocumentCheckIcon, 
  DocumentTextIcon,
  UsersIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await listQuizzes();
      setQuizzes(data);
    } catch (err) {
      toast.error('Failed to load quizzes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyQuizUrl = (slug) => {
    const url = `${window.location.origin}/quiz/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Quiz URL copied to clipboard!');
  };

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your quizzes and view student attempts</p>
        </div>
        <Link to="/admin/quizzes/new" className="btn btn-primary btn-lg flex items-center gap-2">
          <PlusCircleIcon className="h-5 w-5" />
          Create New Quiz
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-indigo-50 border-indigo-200">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-600 font-medium">Total Quizzes</p>
                <p className="text-3xl font-bold text-indigo-900 mt-1">{quizzes.length}</p>
              </div>
              <DocumentTextIcon className="h-12 w-12 text-indigo-300" />
            </div>
          </div>
        </div>
        <div className="card bg-green-50 border-green-200">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Active Quizzes</p>
                <p className="text-3xl font-bold text-green-900 mt-1">
                  {quizzes.filter(q => q.isActive).length}
                </p>
              </div>
              <EyeIcon className="h-12 w-12 text-green-300" />
            </div>
          </div>
        </div>
        <div className="card bg-purple-50 border-purple-200">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Questions</p>
                <p className="text-3xl font-bold text-purple-900 mt-1">
                  {quizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0)}
                </p>
              </div>
              <DocumentTextIcon className="h-12 w-12 text-purple-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Quiz List */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Quizzes</h2>
        {loading ? (
          <div className="card">
            <div className="card-body text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading quizzes...</p>
            </div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-12">
              <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg mb-2">No quizzes yet</p>
              <p className="text-gray-500 text-sm mb-6">Create your first quiz to get started</p>
              <Link to="/admin/quizzes/new" className="btn btn-primary inline-flex items-center gap-2">
                <PlusCircleIcon className="h-5 w-5" />
                Create Your First Quiz
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((q) => (
              <div key={q._id} className="card hover:shadow-lg transition-shadow border-gray-200">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{q.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{q.description || 'No description'}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ml-2 flex-shrink-0 ${
                      q.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {q.isActive ? '✓ Active' : '○ Inactive'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <DocumentTextIcon className="h-4 w-4" />
                      <span>{q.questions?.length || 0} Questions • {q.totalMarks || 0} Marks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      <span>{q.examDuration} minutes • {q.tabSwitchLimit} tab switches</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created {new Date(q.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Link 
                        className="btn btn-secondary btn-sm flex-1 flex items-center justify-center gap-1" 
                        to={`/admin/quizzes/${q._id}`}
                      >
                        <EyeIcon className="h-4 w-4" />
                        Details
                      </Link>
                      <Link 
                        className="btn btn-secondary btn-sm flex-1 flex items-center justify-center gap-1" 
                        to={`/admin/quizzes/${q._id}/attempts`}
                      >
                        <UsersIcon className="h-4 w-4" />
                        Attempts
                      </Link>
                    </div>
                    {q.quizUrlSlug && (
                      <button
                        className="btn btn-primary btn-sm w-full flex items-center justify-center gap-2"
                        onClick={() => copyQuizUrl(q.quizUrlSlug)}
                      >
                        <ClipboardDocumentCheckIcon className="h-4 w-4" />
                        Copy Quiz Link
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
