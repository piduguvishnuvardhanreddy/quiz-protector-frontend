import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listQuizAttempts, getQuiz } from '@/services/quizService';

export default function AdminQuizAttemptsPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    (async () => {
      const q = await getQuiz(id);
      setQuiz(q);
      const data = await listQuizAttempts(id);
      setAttempts(data);
    })();
  }, [id]);

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Attempts · {quiz?.title}</h1>
      <div className="space-y-3">
        {attempts.map((a) => (
          <div key={a._id} className="card">
            <div className="card-body flex items-center justify-between">
              <div>
                <div className="font-medium">{a.studentName} · {a.studentEmail}</div>
                <div className="text-sm text-gray-600">{new Date(a.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm">{a.score}/{a.maxScore}</div>
                <div className={`text-xs px-2 py-1 rounded ${a.isTerminatedDueToTabSwitch ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {a.isTerminatedDueToTabSwitch ? 'Terminated' : 'Completed'}
                </div>
                <Link to={`/admin/attempts/${a._id}`} className="btn btn-secondary">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
