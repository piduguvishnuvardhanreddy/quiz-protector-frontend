import { useState } from 'react';
import QuestionEditor from '@/components/QuestionEditor';
import { createQuiz } from '@/services/quizService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DocumentPlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function CreateQuizPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    examDuration: 30,
    tabSwitchLimit: 3,
  });
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, marks: 1 },
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, marks: 1 }]);
    toast.info('Question added');
  };

  const removeQuestion = (idx) => {
    if (questions.length === 1) {
      toast.error('Quiz must have at least one question');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== idx));
    toast.info('Question removed');
  };

  const updateQuestion = (idx, q) => setQuestions(questions.map((it, i) => (i === idx ? q : it)));

  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error('Quiz title is required');
      return false;
    }
    if (form.examDuration < 1) {
      toast.error('Exam duration must be at least 1 minute');
      return false;
    }
    if (form.tabSwitchLimit < 0) {
      toast.error('Tab switch limit cannot be negative');
      return false;
    }
    if (questions.length === 0) {
      toast.error('Quiz must have at least one question');
      return false;
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        toast.error(`Question ${i + 1}: Question text is required`);
        return false;
      }
      if (q.options.some(opt => !opt.trim())) {
        toast.error(`Question ${i + 1}: All options must be filled`);
        return false;
      }
      if (q.marks < 1) {
        toast.error(`Question ${i + 1}: Marks must be at least 1`);
        return false;
      }
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const payload = { 
        ...form, 
        questions, 
        isActive: true 
      };
      
      console.log('Creating quiz with payload:', payload);
      const created = await createQuiz(payload);
      console.log('Quiz created:', created);
      
      toast.success('Quiz created successfully!');
      setTimeout(() => {
        navigate(`/admin/quizzes/${created._id}`);
      }, 1000);
    } catch (err) {
      console.error('Error creating quiz:', err);
      const errorMessage = err.message || 'Failed to create quiz';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <DocumentPlusIcon className="h-8 w-8 mr-3 text-indigo-600" />
            Create New Quiz
          </h1>
          <p className="text-gray-600 mt-1">Build your quiz with custom questions and settings</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Quiz Basic Info */}
        <div className="card border-indigo-200">
          <div className="card-header bg-indigo-50">
            <h2 className="text-xl font-semibold text-indigo-900">Quiz Information</h2>
          </div>
          <div className="card-body grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="label">Quiz Title *</label>
              <input 
                className="input" 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
                placeholder="Enter quiz title"
                required 
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea 
                className="input h-24" 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of the quiz (optional)"
              />
            </div>
            <div>
              <label className="label">Exam Duration (minutes) *</label>
              <input 
                type="number" 
                min={1} 
                className="input" 
                value={form.examDuration} 
                onChange={(e) => setForm({ ...form, examDuration: Number(e.target.value) })} 
                required 
              />
              <p className="text-xs text-gray-500 mt-1">How long students have to complete the quiz</p>
            </div>
            <div>
              <label className="label">Tab Switch Limit *</label>
              <input 
                type="number" 
                min={0} 
                className="input" 
                value={form.tabSwitchLimit} 
                onChange={(e) => setForm({ ...form, tabSwitchLimit: Number(e.target.value) })} 
                required 
              />
              <p className="text-xs text-gray-500 mt-1">Maximum allowed tab switches before termination</p>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Questions ({questions.length})</h2>
              <p className="text-sm text-gray-600">Total Marks: {totalMarks}</p>
            </div>
            <button 
              type="button" 
              className="btn btn-primary flex items-center gap-2" 
              onClick={addQuestion}
            >
              <DocumentPlusIcon className="h-5 w-5" />
              Add Question
            </button>
          </div>
          
          {questions.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-12">
                <DocumentPlusIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No questions yet. Click "Add Question" to start building your quiz.</p>
              </div>
            </div>
          ) : (
            questions.map((q, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-4 top-4 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  {idx + 1}
                </div>
                <QuestionEditor 
                  question={q} 
                  onChange={(next) => updateQuestion(idx, next)} 
                  onRemove={() => removeQuestion(idx)} 
                />
              </div>
            ))
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm flex items-center">
              <span className="font-semibold mr-2">Error:</span>
              {error}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button 
            type="submit"
            disabled={loading || questions.length === 0}
            className="btn btn-primary btn-lg flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Quiz...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-5 w-5" />
                Create Quiz
              </>
            )}
          </button>
          <button 
            type="button"
            onClick={() => navigate('/admin')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
