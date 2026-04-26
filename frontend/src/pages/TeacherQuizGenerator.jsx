import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function TeacherQuizGenerator() {
  const { courseId } = useParams();
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [quizData, setQuizData] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Error: Please upload a PDF file.');
      return;
    }
    setLoading(true);
    setMessage('');
    setQuizData(null);
    
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('numQuestions', numQuestions.toString());
      formData.append('difficulty', difficulty);
      formData.append('publish', false);

      const res = await api.post(`/ai/generate-quiz/${courseId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(`Quiz generated! Review and edit the questions below.`);
      setQuizData(res.data.quizData);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      await api.post(`/quiz/admin/publish/${quizData.id}`, { 
        durationHours: 24,
        title: quizData.title,
        questions: quizData.questions
      });
      setMessage(`Quiz officially published and live!`);
      setQuizData(null);
    } catch (err) {
      setMessage(`Publishing failed: ${err.message}`);
    }
  };

  const updateTitle = (val) => setQuizData({ ...quizData, title: val });
  
  const updateQuestion = (qIdx, val) => {
    const updated = { ...quizData };
    updated.questions[qIdx].question = val;
    setQuizData(updated);
  };

  const updateOption = (qIdx, oIdx, val) => {
    const updated = { ...quizData };
    updated.questions[qIdx].options[oIdx] = val;
    setQuizData(updated);
  };

  const updateAnswer = (qIdx, val) => {
    const updated = { ...quizData };
    updated.questions[qIdx].answer = val;
    setQuizData(updated);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <Link to={`/teacher/courses/${courseId}`} className="text-blue-500 block mb-4">&larr; Back to Course</Link>
      <h1 className="text-3xl font-bold mb-6">AI Quiz Generator - {courseId}</h1>
      
      <div className="bg-white p-6 rounded shadow max-w-2xl mb-6 border-t-4 border-purple-500">
        <form onSubmit={handleGenerate}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">1. Upload Course Notes (PDF)</label>
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} className="w-full p-2 border rounded" required />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-semibold">2. Number of Questions</label>
              <input type="number" min="1" max="25" value={numQuestions} onChange={e => setNumQuestions(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">3. Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full p-2 border rounded">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-3 rounded disabled:opacity-50 transition">
            {loading ? 'Analyzing PDF & Generating Quiz...' : 'Generate AI Quiz'}
          </button>
        </form>
        {message && <p className="mt-4 p-4 font-semibold border rounded bg-blue-50 text-blue-800">{message}</p>}
      </div>

      {quizData && (
        <div className="bg-white p-6 rounded shadow max-w-4xl border border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex-1 w-full mr-0 md:mr-4 mb-4 md:mb-0">
               <label className="block text-sm font-bold text-gray-700 mb-1">Quiz Title</label>
               <input 
                  type="text" 
                  value={quizData.title} 
                  onChange={e => updateTitle(e.target.value)}
                  className="w-full text-2xl font-bold p-2 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition" 
               />
            </div>
            <button onClick={handlePublish} className="bg-green-600 text-white px-8 py-3 rounded font-bold hover:bg-green-700 shadow flex-shrink-0 transition">
              💾 Save & Publish Quiz Live
            </button>
          </div>

          <div className="space-y-6">
            {quizData.questions.map((q, idx) => (
              <div key={idx} className="p-5 border rounded bg-gray-50 border-gray-200 shadow-sm relative">
                <div className="absolute top-0 right-0 bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-bl">Q{idx + 1}</div>
                <label className="block font-bold text-gray-700 mb-2">Question Text</label>
                <textarea 
                  value={q.question}
                  onChange={(e) => updateQuestion(idx, e.target.value)}
                  className="w-full p-3 border rounded mb-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition resize-y"
                  rows={2}
                />
                
                <label className="block font-bold text-gray-700 mb-2">Options</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex flex-col">
                      <span className="text-xs font-bold text-gray-500 mb-1">Option {String.fromCharCode(65 + oIdx)}</span>
                      <input 
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(idx, oIdx, e.target.value)}
                        className={`p-2 rounded border focus:border-blue-500 focus:outline-none transition ${opt === q.answer ? 'bg-green-50 border-green-400' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block font-bold text-green-700 mb-2">Correct Answer</label>
                  <select 
                    value={q.answer}
                    onChange={(e) => updateAnswer(idx, e.target.value)}
                    className="w-full p-2 border border-green-500 rounded bg-green-50 focus:outline-none text-green-900 font-semibold"
                  >
                    {q.options.map((opt, oIdx) => (
                      <option key={oIdx} value={opt}>Option {String.fromCharCode(65 + oIdx)}: {opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
