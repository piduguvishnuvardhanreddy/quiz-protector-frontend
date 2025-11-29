import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAttempt } from '@/services/attemptService';

export default function AdminAttemptDetailsPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    (async () => {
      const at = await getAttempt(id);
      setAttempt(at);
    })();
  }, [id]);

  if (!attempt) return <div className="container py-10">Loading...</div>;

  return (
    <div className="container py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Attempt · {attempt.quiz.title}</h1>
        <div className="text-sm text-gray-600">{attempt.studentName} · {attempt.studentEmail}</div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><div className="card-body"><div className="text-sm text-gray-600">Score</div><div className="text-2xl font-semibold">{attempt.score} / {attempt.maxScore}</div></div></div>
        <div className="card"><div className="card-body"><div className="text-sm text-gray-600">Tab Switches</div><div className="text-2xl font-semibold">{attempt.tabSwitchCount} / {attempt.tabSwitchLimit}</div></div></div>
        <div className="card"><div className="card-body"><div className="text-sm text-gray-600">Status</div><div className={`text-2xl font-semibold ${attempt.isTerminatedDueToTabSwitch ? 'text-red-600' : 'text-green-700'}`}>{attempt.isTerminatedDueToTabSwitch ? 'Terminated' : 'Completed'}</div></div></div>
      </div>
      {attempt.feedback && (
        <div className="card"><div className="card-header"><h2 className="font-medium">Feedback</h2></div><div className="card-body"><p className="text-gray-700 whitespace-pre-wrap">{attempt.feedback}</p></div></div>
      )}
    </div>
  );
}
