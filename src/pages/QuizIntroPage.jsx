import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizBySlug } from '@/services/quizService';
import { startAttempt } from '@/services/attemptService';

export default function QuizIntroPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const q = await getQuizBySlug(slug);
        setQuiz(q);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [slug]);

  const onStart = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const attempt = await startAttempt({ quizId: quiz._id, name, email });
      navigate(`/exam/${attempt._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return (
    <div className="container py-10">
      <div className="card border-red-300 bg-red-50">
        <div className="card-body text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-900 mb-2">Error Loading Quiz</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    </div>
  );
  
  if (!quiz) return (
    <div className="container py-10">
      <div className="card">
        <div className="card-body text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz details...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12">
      <div className="container grid gap-6 lg:grid-cols-2">
        <div className="card border-indigo-200 shadow-lg animate-fadeIn">
          <div className="card-header bg-gradient-to-r from-indigo-500 to-purple-600">
            <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
          </div>
          <div className="card-body space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h3>
              <p className="text-gray-700 text-lg">{quiz.description || 'No description provided'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <div className="text-indigo-600 text-sm font-medium mb-1">Duration</div>
                <div className="text-2xl font-bold text-indigo-900">{quiz.examDuration} min</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="text-purple-600 text-sm font-medium mb-1">Tab Switch Limit</div>
                <div className="text-2xl font-bold text-purple-900">{quiz.tabSwitchLimit}</div>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <h3 className="text-amber-900 font-semibold mb-2 flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                Important Instructions
              </h3>
              <ul className="text-amber-800 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>You have <strong>{quiz.examDuration} minutes</strong> to complete this quiz</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Maximum <strong>{quiz.tabSwitchLimit} tab switches</strong> allowed</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Exceeding the limit will <strong className="text-red-600">terminate your exam</strong> and set your score to 0</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Do not refresh the page or close the browser</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Ensure stable internet connection throughout</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="card shadow-lg animate-fadeIn" style={{animationDelay: '0.1s'}}>
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Start Your Exam</h2>
            <p className="text-sm text-gray-600 mt-1">Please enter your details to begin</p>
          </div>
          <form className="card-body space-y-6" onSubmit={onStart}>
            <div>
              <label className="label text-base">Full Name *</label>
              <input 
                className="input" 
                placeholder="Enter your full name"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="label text-base">Email Address *</label>
              <input 
                type="email" 
                className="input" 
                placeholder="your.email@example.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <button className="btn btn-primary w-full btn-lg">
              <span className="text-xl mr-2">🚀</span>
              Start Exam Now
            </button>
            <p className="text-xs text-gray-500 text-center">
              By starting this exam, you agree to follow all proctoring rules and instructions.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
