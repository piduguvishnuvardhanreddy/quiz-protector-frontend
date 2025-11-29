import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuiz } from '@/services/quizService';

export default function QuizDetailsPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    (async () => {
      const q = await getQuiz(id);
      setQuiz(q);
    })();
  }, [id]);

  if (!quiz) return <div className="container py-10">Loading...</div>;

  return (
    <div className="container py-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{quiz.title}</h1>
        {quiz.quizUrlSlug && (
          <button className="btn btn-primary" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/quiz/${quiz.quizUrlSlug}`)}>
            Copy Share URL
          </button>
        )}
      </div>
      <p className="text-gray-700">{quiz.description}</p>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><div className="card-body"><div className="text-sm text-gray-600">Duration</div><div className="text-2xl font-semibold">{quiz.examDuration} min</div></div></div>
        <div className="card"><div className="card-body"><div className="text-sm text-gray-600">Tab Switch Limit</div><div className="text-2xl font-semibold">{quiz.tabSwitchLimit}</div></div></div>
        <div className="card"><div className="card-body"><div className="text-sm text-gray-600">Total Marks</div><div className="text-2xl font-semibold">{quiz.totalMarks}</div></div></div>
      </div>
      <div className="card">
        <div className="card-header"><h2 className="font-medium">Questions</h2></div>
        <div className="card-body space-y-4">
          {quiz.questions.map((q, idx) => (
            <div key={q._id} className="">
              <div className="font-medium">Q{idx + 1}. {q.questionText} <span className="text-sm text-gray-600">· {q.marks} marks</span></div>
              <ol className="list-decimal pl-6 text-sm text-gray-700">
                {q.options.map((o, i) => (
                  <li key={i} className={`${i === q.correctOptionIndex ? 'font-semibold text-green-700' : ''}`}>{o}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
