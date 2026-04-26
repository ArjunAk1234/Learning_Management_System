import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import api from '../api';

export default function StudentQuiz() {
  const { quizId } = useParams();
  const { studentId } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);

  const handleSubmit = async (e, autoSubmit = false) => {
    if (e) e.preventDefault();
    if (!quiz || submitting) return;
    
    // Check for missed questions if manually submitting
    if (!autoSubmit && Object.keys(answers).length < quiz.questions.length) {
      if (!window.confirm("You have unanswered questions. Are you sure you want to submit?")) {
        return;
      }
    }

    setSubmitting(true);
    if (timerInterval) clearInterval(timerInterval);

    try {
      const res = await api.post('/quiz/submit', {
        quizId,
        studentId,
        answers
      });
      alert(`Quiz submitted successfully! Score: ${res.data.score}/${quiz.questions.length}`);
      navigate('/student/dashboard');
    } catch (err) {
      alert(`Submission failed: ${err.response?.data?.error || err.message}`);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // Check if already submitted first
    api.get(`/quiz/check/${quizId}/${studentId}`)
      .then(res => {
        if (res.data.submitted) {
          alert('You have already submitted this quiz!');
          navigate('/student/dashboard');
          return null; // Halt flow
        }
        return api.get('/quiz/active'); // Fetch active quizzes
      })
      .then(res => {
        if (!res) return;
        const activeQuiz = res.data.find(q => q.id === quizId);
        if (!activeQuiz) {
          alert('This quiz is not currently active.');
          navigate('/student/dashboard');
          return;
        }
        
        // Calculate remaining time relative to Quiz End Time
        const remainingMs = new Date(activeQuiz.endTime).getTime() - new Date().getTime();
        const remainingSecs = Math.max(0, Math.floor(remainingMs / 1000));
        
        // Provide maximum 1 hr limit unless the end time is sooner
        const limitSecs = Math.min(3600, remainingSecs); 

        setQuiz(activeQuiz);
        setTimeLeft(limitSecs);
        setLoading(false);

        // Start countdown
        const interval = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              handleSubmit(null, true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        setTimerInterval(interval);

        return () => clearInterval(interval);
      })
      .catch(err => {
         console.error(err);
         setLoading(false);
      });
      
      // Cleanup on unmount
      return () => { if (timerInterval) clearInterval(timerInterval); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, studentId]);

  const handleOptionSelect = (qIdx, oIdx) => {
    setAnswers(prev => ({
      ...prev,
      [`q${qIdx}`]: oIdx
    }));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) return <div className="p-8 text-center text-xl font-bold">Loading official quiz materials...</div>;
  if (!quiz) return null; // Fallback if quiz fetch failed

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex justify-center">
      <div className="w-full max-w-3xl bg-white p-6 rounded shadow border-t-4 border-blue-600">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 pb-4 mb-6 pt-2 z-10 flex justify-between items-center shadow-sm px-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{quiz.title}</h1>
            <p className="text-sm text-gray-500 mt-1">Course: {quiz.course} | {quiz.questions.length} Questions</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Time Remaining</span>
            <div className={`text-3xl font-mono ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
        
        <div className="space-y-8 mb-8">
          {quiz.questions.map((q, qIdx) => (
            <div key={qIdx} className="p-5 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-gray-800">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm mr-2">Q{qIdx + 1}</span>
                {q.question}
              </h3>
              <div className="space-y-3">
                {q.options.map((opt, oIdx) => {
                  const isSelected = answers[`q${qIdx}`] === oIdx;
                  return (
                    <label 
                      key={oIdx} 
                      className={`block p-4 border rounded cursor-pointer transition ${isSelected ? 'bg-blue-100 border-blue-500 shadow' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
                    >
                      <input 
                        type="radio" 
                        name={`q${qIdx}`} 
                        value={oIdx}
                        checked={isSelected}
                        onChange={() => handleOptionSelect(qIdx, oIdx)}
                        className="mr-3 scale-125 accent-blue-600"
                      />
                      <span className={`${isSelected ? 'font-semibold text-blue-900' : 'text-gray-700'}`}>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-6 flex justify-between items-center">
          <p className="text-gray-500 text-sm">Review your answers carefully before submitting.</p>
          <button 
            onClick={handleSubmit} 
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-full shadow-lg transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Answers'}
          </button>
        </div>
      </div>
    </div>
  );
}
