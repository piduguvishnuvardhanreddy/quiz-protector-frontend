import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { submitFeedback } from '@/services/attemptService';

export default function FeedbackPage() {
  const { attemptId } = useParams();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitFeedback(attemptId, feedback);
      navigate(`/report/${attemptId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-2xl">
      <div className="card">
        <div className="card-header">
          <h1 className="text-xl font-semibold">Exam terminated due to tab switching</h1>
        </div>
        <form className="card-body space-y-4" onSubmit={onSubmit}>
          <p className="text-gray-700 text-sm">Please provide feedback before viewing your report.</p>
          <textarea className="input h-40" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Your comments..." />
          <div className="flex justify-end">
            <button disabled={loading} className="btn btn-primary">Submit Feedback</button>
          </div>
        </form>
      </div>
    </div>
  );
}
