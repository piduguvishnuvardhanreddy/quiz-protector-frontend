import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Timer from '@/components/Timer';
import { getAttempt, submitAnswers, recordTabSwitch } from '@/services/attemptService';
import { getQuizForTaking } from '@/services/quizService';

export default function ExamPage() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const navigate = useNavigate();
  const terminatedRef = useRef(false);

  // Detect tab switches using visibilitychange and blur/focus
  useEffect(() => {
    const onVisibility = async () => {
      if (document.hidden) await onTabSwitch();
    };
    const onBlur = async () => { await onTabSwitch(); };
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  });

  const onTabSwitch = async () => {
    try {
      if (terminatedRef.current) return;
      const res = await recordTabSwitch(attemptId);
      if (res.terminated) {
        terminatedRef.current = true;
        alert('EXAM TERMINATED: Malpractice detected! You exceeded the tab switch limit. Your score has been set to 0.');
        // Immediately navigate to report page without submitting again (backend already saved)
        navigate(`/report/${attemptId}`, { replace: true });
      } else {
        setTabSwitchCount(res.tabSwitchCount);
        if (res.tabSwitchCount >= attempt.tabSwitchLimit - 1) {
          alert(`WARNING: You have ${attempt.tabSwitchLimit - res.tabSwitchCount} tab switch remaining. Do not switch tabs or your exam will be terminated!`);
        }
      }
    } catch (err) {
      // ignore errors during tab switch record
    }
  };

  useEffect(() => {
    (async () => {
      const at = await getAttempt(attemptId);
      setAttempt(at);
      const quizId = at.quiz._id || at.quiz;
      const q = await getQuizForTaking(quizId);
      setQuiz(q);
    })();
  }, [attemptId]);

  const onSelect = (questionId, selectedOptionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOptionIndex }));
  };

  const doSubmit = async (terminated = false) => {
    if (terminatedRef.current) return; // Don't submit if already terminated
    if (!quiz) return;
    const payload = quiz.questions.map((q) => ({
      questionId: q._id,
      selectedOptionIndex: answers[q._id] ?? -1,
    })).filter((a) => a.selectedOptionIndex >= 0);
    const res = await submitAnswers(attemptId, payload);
    navigate(`/report/${attemptId}`, { replace: true });
  };

  if (!quiz || !attempt) return <div className="container py-10">Loading...</div>;

  const totalSeconds = (quiz.examDuration || 30) * 60;
  
  // If exam is already terminated, redirect to report immediately
  if (terminatedRef.current) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Exam Terminated</h2>
        <p className="text-gray-600">Redirecting to report page...</p>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz.questions.length;
  const progressPercentage = (answeredCount / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-6">
      <div className="container space-y-6">
        {/* Header with Timer and Stats */}
        <div className="card sticky top-4 z-10 shadow-lg border-indigo-200">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="text-gray-600">
                    Progress: <strong className="text-indigo-600">{answeredCount}/{totalQuestions}</strong> questions
                  </span>
                  <span className={`font-medium ${
                    tabSwitchCount >= attempt.tabSwitchLimit - 1 ? 'text-red-600 animate-pulse' : 'text-gray-600'
                  }`}>
                    🔍 Tab switches: <strong>{tabSwitchCount}/{attempt.tabSwitchLimit}</strong>
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 transition-all duration-300 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <Timer totalSeconds={totalSeconds} onExpire={() => doSubmit(false)} />
            </div>
          </div>
        </div>

        {/* Questions */}
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); doSubmit(false); }}>
          {quiz.questions.map((q, idx) => (
            <div key={q._id} className="card shadow-lg animate-fadeIn" style={{animationDelay: `${idx * 0.05}s`}}>
              <div className="card-body">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    answers[q._id] !== undefined 
                      ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-medium text-gray-900 mb-1">{q.questionText}</div>
                    <div className="text-sm text-gray-500">Marks: {q.marks}</div>
                  </div>
                </div>
                <div className="grid gap-3 ml-14">
                  {q.options.map((opt, i) => (
                    <label 
                      key={i} 
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        answers[q._id] === i 
                          ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                      } ${terminatedRef.current ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="radio"
                        name={q._id}
                        checked={answers[q._id] === i}
                        onChange={() => onSelect(q._id, i)}
                        disabled={terminatedRef.current}
                        className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="flex-1 text-gray-700">{opt}</span>
                      {answers[q._id] === i && (
                        <span className="text-indigo-600 font-medium text-sm">✓ Selected</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          {/* Submit Button */}
          <div className="card border-green-200 bg-green-50 shadow-lg">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-lg font-semibold text-gray-900 mb-1">
                    Ready to submit your exam?
                  </p>
                  <p className="text-sm text-gray-600">
                    You've answered {answeredCount} out of {totalQuestions} questions
                  </p>
                </div>
                <button 
                  className="btn btn-success btn-lg px-8" 
                  disabled={terminatedRef.current}
                >
                  <span className="text-xl mr-2">✔️</span>
                  Submit Exam
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
