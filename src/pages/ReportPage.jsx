import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAttempt } from '@/services/attemptService';

export default function ReportPage() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    (async () => {
      const at = await getAttempt(attemptId);
      setAttempt(at);
    })();
  }, [attemptId]);

  if (!attempt) return <div className="container py-10">Loading...</div>;

  const { quiz } = attempt;

  return (
    <div className="container py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{quiz.title} - Report</h1>
        <p className="text-sm text-gray-600">{attempt.studentName} · {attempt.studentEmail}</p>
      </div>

      {attempt.isTerminatedDueToTabSwitch && (
        <div className="card border-red-500 bg-red-50">
          <div className="card-body">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚠️</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-red-700 mb-2">MALPRACTICE DETECTED</h2>
                <p className="text-red-600 font-medium mb-2">
                  Your exam was terminated due to excessive tab switching ({attempt.tabSwitchCount} switches, limit: {attempt.tabSwitchLimit}).
                </p>
                <p className="text-red-600">
                  As per exam rules, your score has been set to 0. This incident has been recorded and reported to the administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><div className="card-body">
          <div className="text-sm text-gray-600">Score</div>
          <div className={`text-2xl font-semibold ${attempt.isTerminatedDueToTabSwitch ? 'text-red-600' : ''}`}>
            {attempt.score} / {attempt.maxScore}
            {attempt.isTerminatedDueToTabSwitch && <span className="text-sm block text-red-500">(Malpractice)</span>}
          </div>
        </div></div>
        <div className="card"><div className="card-body">
          <div className="text-sm text-gray-600">Tab Switches</div>
          <div className={`text-2xl font-semibold ${attempt.tabSwitchCount > attempt.tabSwitchLimit ? 'text-red-600' : ''}`}>
            {attempt.tabSwitchCount} / {attempt.tabSwitchLimit}
          </div>
        </div></div>
        <div className="card"><div className="card-body">
          <div className="text-sm text-gray-600">Status</div>
          <div className={`text-2xl font-semibold ${attempt.isTerminatedDueToTabSwitch ? 'text-red-600' : 'text-green-700'}`}>
            {attempt.isTerminatedDueToTabSwitch ? 'Terminated' : 'Completed'}
          </div>
        </div></div>
      </div>

      {attempt.answers?.length ? (
        <div className="card">
          <div className="card-header"><h2 className="font-medium">Breakdown</h2></div>
          <div className="card-body space-y-3">
            {attempt.answers.map((a, idx) => (
              <div key={idx} className="border rounded p-3">
                <div className="text-sm text-gray-600">Question ID: {a.questionId}</div>
                <div className="flex justify-between mt-1">
                  <div>Selected: {a.selectedOptionIndex + 1}</div>
                  <div className={`${a.isCorrect ? 'text-green-700' : 'text-red-600'}`}>{a.isCorrect ? 'Correct' : 'Incorrect'} · +{a.marksAwarded}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {attempt.feedback && (
        <div className="card">
          <div className="card-header"><h2 className="font-medium">Feedback</h2></div>
          <div className="card-body"><p className="text-gray-700 whitespace-pre-wrap">{attempt.feedback}</p></div>
        </div>
      )}
    </div>
  );
}
