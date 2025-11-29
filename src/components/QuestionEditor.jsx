import { useState, useEffect } from 'react';
import { TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function QuestionEditor({ question, onChange, onRemove }) {
  const [local, setLocal] = useState(
    question || { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, marks: 1 }
  );

  useEffect(() => {
    if (question) {
      setLocal(question);
    }
  }, [question]);

  const update = (patch) => {
    const next = { ...local, ...patch };
    setLocal(next);
    onChange?.(next);
  };

  const updateOption = (idx, value) => {
    const options = [...local.options];
    options[idx] = value;
    update({ options });
  };

  return (
    <div className="card border-gray-300 hover:border-indigo-300 transition-colors">
      <div className="card-body space-y-4">
        {/* Question Text */}
        <div>
          <label className="label font-semibold">Question Text *</label>
          <textarea
            className="input h-24 resize-none"
            value={local.questionText}
            onChange={(e) => update({ questionText: e.target.value })}
            placeholder="Enter your question here..."
            required
          />
        </div>

        {/* Options Grid */}
        <div>
          <label className="label font-semibold mb-3">Answer Options *</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {local.options.map((opt, idx) => (
              <div key={idx} className="relative">
                <div className="flex items-center gap-2">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    local.correctOptionIndex === idx 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <input
                    className={`input flex-1 ${local.correctOptionIndex === idx ? 'border-green-500 bg-green-50' : ''}`}
                    value={opt}
                    onChange={(e) => updateOption(idx, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    required
                  />
                  {local.correctOptionIndex === idx && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Click on the correct option selector below to mark the correct answer</p>
        </div>

        {/* Settings Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-2 border-t border-gray-200">
          <div>
            <label className="label font-semibold">Correct Answer *</label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => update({ correctOptionIndex: idx })}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    local.correctOptionIndex === idx
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label font-semibold">Marks *</label>
            <input
              type="number"
              min={1}
              max={100}
              className="input"
              value={local.marks}
              onChange={(e) => update({ marks: Number(e.target.value) || 1 })}
              required
            />
          </div>
          <div className="md:text-right">
            <button 
              type="button" 
              className="btn btn-danger flex items-center gap-2 w-full md:w-auto justify-center" 
              onClick={onRemove}
            >
              <TrashIcon className="h-4 w-4" />
              Remove Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
