// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';
// // // import { useNavigate } from 'react-router-dom';
// // // import Swal from 'sweetalert2';
// // // import './admin.css'

// // // function AdminDashboard() {
// // //   const [quizzes, setQuizzes] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const [view, setView] = useState('allQuizzes');
// // //   const [selectedQuiz, setSelectedQuiz] = useState(null);
// // //   const [studentEmail, setStudentEmail] = useState('');
// // //   const [studentProgress, setStudentProgress] = useState([]);
// // //   const [submissions, setSubmissions] = useState([]);
// // //   const [leaderboard, setLeaderboard] = useState([]);
// // //   const navigate = useNavigate();

// // //   useEffect(() => {
// // //     document.body.classList.add("admin-body");
// // //     return () => {
// // //       document.body.classList.remove("admin-body");
// // //     };
// // //   }, []);
// // //   useEffect(() => {
// // //     fetchAllQuizzes();
// // //   }, []);

// // //   const fetchAllQuizzes = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const response = await axios.get('http://localhost:8006/quiz/admin/all');
// // //       setQuizzes(response.data);
// // //       setLoading(false);
// // //     } catch (err) {
// // //       setError('Failed to fetch quizzes');
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchSubmissions = async (quizId) => {
// // //     try {
// // //       setLoading(true);
// // //       const response = await axios.get(`http://localhost:8006/quiz/admin/submissions/${quizId}`);
// // //       setSubmissions(response.data.submissions || []);
// // //       setLoading(false);
// // //     } catch (err) {
// // //       console.error(err);
// // //       setError('Failed to fetch submissions');
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchStudentProgress = async () => {
// // //     if (!studentEmail) {
// // //       setError('Please enter a student email');
// // //       return;
// // //     }

// // //     try {
// // //       setLoading(true);
// // //       const response = await axios.get(`http://localhost:8006/quiz/admin/progress/${studentEmail}`);
// // //       setStudentProgress(response.data);
// // //       setLoading(false);
// // //     } catch (err) {
// // //       console.error(err);
// // //       setError('Failed to fetch student progress');
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchLeaderboard = async (quizId) => {
// // //     try {
// // //       setLoading(true);
// // //       const response = await axios.get(`http://localhost:8006/leaderboard/quiz/${quizId}`);
// // //       setLeaderboard(response.data);
// // //       setLoading(false);
// // //     } catch (err) {
// // //       setError('Failed to fetch leaderboard');
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleViewChange = (newView, quiz = null) => {
// // //     setView(newView);
// // //     setError(null);

// // //     if (quiz) {
// // //       setSelectedQuiz(quiz);

// // //       if (newView === 'submissions') {
// // //         fetchSubmissions(quiz.id);
// // //       } else if (newView === 'leaderboard') {
// // //         fetchLeaderboard(quiz.id);
// // //       }
// // //     }
// // //   };

// // //   const renderQuizList = () => {
// // //     if (loading) return <div className="loading">Loading quizzes...</div>;
// // //     if (error) return <div className="error">{error}</div>;

// // //     return (
// // //       <div className="quiz-list">
// // //         <h2>All Quizzes</h2>
// // //         {quizzes.length === 0 ? (
// // //           <div>No quizzes available. Create a quiz to get started.</div>
// // //         ) : (
// // //           <div className="quiz-table-container">
// // //             <table className="quiz-table">
// // //               <thead className="quiz-table-head">
// // //                 <tr className="quiz-table-head-row">
// // //                   <th className="quiz-table-header-cell">Title</th>
// // //                   <th className="quiz-table-header-cell">Start Time</th>
// // //                   <th className="quiz-table-header-cell">End Time</th>
// // //                   <th className="quiz-table-header-cell">Questions</th>
// // //                   <th className="quiz-table-header-cell">Actions</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="quiz-table-body">
// // //                 {quizzes.map((quiz) => (
// // //                   <tr key={quiz.id} className="quiz-table-row">
// // //                     <td className="quiz-table-cell">{quiz.title}</td>
// // //                     <td className="quiz-table-cell">{new Date(quiz.startTime).toLocaleString()}</td>
// // //                     <td className="quiz-table-cell">{new Date(quiz.endTime).toLocaleString()}</td>
// // //                     <td className="quiz-table-cell">{quiz.questions.length}</td>
// // //                     <td className="quiz-table-cell">
// // //                       <button className="quiz-action-button" onClick={() => handleViewChange('submissions', quiz)}>
// // //                         Submissions
// // //                       </button>
// // //                       <button className="quiz-action-button" onClick={() => handleViewChange('leaderboard', quiz)}>
// // //                         Leaderboard
// // //                       </button>
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           </div>

// // //         )}
// // //       </div>
// // //     );
// // //   };

// // //   const renderSubmissions = () => {
// // //     if (!selectedQuiz) return <div>No quiz selected</div>;
// // //     if (loading) return <div className="loading">Loading submissions...</div>;

// // //     return (
// // //       <div className="submissions">
// // //         <h2>Submissions: {selectedQuiz.title}</h2>
// // //         {submissions.length === 0 ? (
// // //           <p>No submissions yet</p>
// // //         ) : (
// // //           <table className='progress-table'>
// // //             <thead>
// // //               <tr>
// // //                 <th>Email</th>
// // //                 <th>Username</th>
// // //                 <th>Score</th>
// // //                 <th>Submitted At</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {submissions.map((sub, index) => (
// // //                 <tr key={index}>
// // //                   <td>{sub.studentId}</td>
// // //                   <td>{sub.studentname}</td>
// // //                   <td>{sub.score} / {selectedQuiz.questions.length}</td>
// // //                   <td>{new Date(sub.submitted_at).toLocaleString()}</td>
// // //                 </tr>
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //         )}
// // //         <button
// // //           onClick={() => handleViewChange('allQuizzes')}
// // //           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-4"
// // //         >
// // //           Back to Quizzes
// // //         </button>

// // //       </div>
// // //     );
// // //   };

// // //   const renderStudentProgress = () => {
// // //     return (
// // //       <div className="student-progress">
// // //         <h2>Student Progress</h2>
// // //         <div className="search-bar">
// // //           <input
// // //             type="email"
// // //             placeholder="Enter student email"
// // //             value={studentEmail}
// // //             onChange={(e) => setStudentEmail(e.target.value)}
// // //           />
// // //           <button onClick={fetchStudentProgress}>Search</button>
// // //         </div>

// // //         {loading ? (
// // //           <div className="loading">Loading progress...</div>
// // //         ) : studentProgress.length > 0 ? (
// // //           <table className="progress-table">
// // //             <thead>
// // //               <tr>
// // //                 <th>Quiz Title</th>
// // //                 <th>Status</th>
// // //                 <th>Score</th>
// // //                 <th>Submitted At</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {studentProgress.map((item, index) => (
// // //                 <tr key={index} className={item.status === 'missed' ? 'missed' : ''}>
// // //                   <td>{item.title}</td>
// // //                   <td>{item.status}</td>
// // //                   <td>{item.status === 'submitted' ? `${item.score}` : 'N/A'}</td>
// // //                   <td>
// // //                     {item.submittedAt
// // //                       ? new Date(item.submittedAt).toLocaleString()
// // //                       : 'N/A'}
// // //                   </td>
// // //                 </tr>
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //         ) : error ? (
// // //           <div className="error">{error}</div>
// // //         ) : (
// // //           <p>Enter student email to view progress</p>
// // //         )}
// // //       </div>
// // //     );
// // //   };

// // //   const renderLeaderboard = () => {
// // //     if (!selectedQuiz) return <div>No quiz selected</div>;
// // //     if (loading) return <div className="loading">Loading leaderboard...</div>;

// // //     return (
// // //       <div className="leaderboard">
// // //         <h2>Leaderboard: {selectedQuiz.title}</h2>
// // //         {leaderboard.length === 0 ? (
// // //           <p>No submissions yet</p>
// // //         ) : (
// // //           <table className='progress-table'>
// // //             <thead>
// // //               <tr>
// // //                 <th>Rank</th>
// // //                 <th>Username</th>
// // //                 <th>Score</th>
// // //                 <th>Submitted At</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {leaderboard.map((entry) => (
// // //                 <tr key={entry.email}>
// // //                   <td>{entry.rank}</td>
// // //                   <td>{entry.username}</td>
// // //                   <td>{entry.score} / {selectedQuiz.questions.length}</td>
// // //                   <td>{new Date(entry.submittedAt).toLocaleString()}</td>
// // //                 </tr>
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //         )}
// // //         <button
// // //           onClick={() => handleViewChange('allQuizzes')}
// // //           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-4"
// // //         >
// // //           Back to Quizzes
// // //         </button>      </div>
// // //     );
// // //   };

// // //   return (
// // //     <div className="admin-container">
// // //       <div className="header">
// // //         <h1 className='admin-h1'>Quiz Admin Dashboard</h1>
// // //         <nav>
// // //           <button onClick={() => handleViewChange('allQuizzes')}>All Quizzes</button>
// // //           <button onClick={() => handleViewChange('createQuiz')}>Create Quiz</button>
// // //           <button onClick={() => handleViewChange('progress')}>Student Progress</button>
// // //         </nav>
// // //       </div>


// // //       <main>
// // //         {view === 'allQuizzes' && renderQuizList()}
// // //         {view === 'createQuiz' && <QuizCreator onQuizCreated={fetchAllQuizzes} />}
// // //         {view === 'submissions' && renderSubmissions()}
// // //         {view === 'progress' && renderStudentProgress()}
// // //         {view === 'leaderboard' && renderLeaderboard()}
// // //       </main>
// // //     </div>
// // //   );
// // // }

// // // // Quiz Creator Component
// // // function QuizCreator({ onQuizCreated }) {
// // //   const [title, setTitle] = useState('');
// // //   const [startTime, setStartTime] = useState('');
// // //   const [endTime, setEndTime] = useState('');
// // //   const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState(null);

// // //   const addQuestion = () => {
// // //     setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
// // //   };

// // //   const updateQuestion = (index, field, value) => {
// // //     const updatedQuestions = [...questions];
// // //     updatedQuestions[index][field] = value;
// // //     setQuestions(updatedQuestions);
// // //   };

// // //   const updateOption = (questionIndex, optionIndex, value) => {
// // //     const updatedQuestions = [...questions];
// // //     updatedQuestions[questionIndex].options[optionIndex] = value;
// // //     setQuestions(updatedQuestions);
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();

// // //     // Validate form first
// // //     if (!title || !startTime || !endTime) {
// // //       Swal.fire({
// // //         title: 'Missing Information',
// // //         text: 'Please fill all required fields',
// // //         icon: 'warning',
// // //         confirmButtonColor: '#3085d6'
// // //       });
// // //       return;
// // //     }

// // //     if (questions.some(q => !q.question || q.options.some(opt => !opt) || !q.answer)) {
// // //       Swal.fire({
// // //         title: 'Incomplete Questions',
// // //         text: 'Please complete all questions with options and answers',
// // //         icon: 'warning',
// // //         confirmButtonColor: '#3085d6'
// // //       });
// // //       return;
// // //     }

// // //     // If validation passes, show confirmation dialog
// // //     Swal.fire({
// // //       title: 'Create Quiz?',
// // //       text: `Are you sure you want to create the quiz "${title}" with ${questions.length} question(s)?`,
// // //       icon: 'question',
// // //       showCancelButton: true,
// // //       confirmButtonColor: '#3085d6',
// // //       cancelButtonColor: '#d33',
// // //       confirmButtonText: 'Yes, create it!'
// // //     }).then(async (result) => {
// // //       if (result.isConfirmed) {
// // //         try {
// // //           setLoading(true);
// // //           // Format dates to RFC3339
// // //           const formattedStartTime = new Date(startTime).toISOString();
// // //           const formattedEndTime = new Date(endTime).toISOString();

// // //           await axios.post('http://localhost:8006/quiz/admin/create', {
// // //             title,
// // //             questions,
// // //             startTime: formattedStartTime,
// // //             endTime: formattedEndTime
// // //           });

// // //           // Show success message
// // //           Swal.fire({
// // //             title: 'Success!',
// // //             text: 'Quiz has been created successfully',
// // //             icon: 'success',
// // //             confirmButtonColor: '#3085d6'
// // //           });

// // //           // Reset form
// // //           setTitle('');
// // //           setStartTime('');
// // //           setEndTime('');
// // //           setQuestions([{ question: '', options: ['', '', '', ''], answer: '' }]);
// // //           setError(null);

// // //           // Notify parent component
// // //           onQuizCreated();
// // //           setLoading(false);
// // //         } catch (err) {
// // //           Swal.fire({
// // //             title: 'Error!',
// // //             text: 'Failed to create quiz',
// // //             icon: 'error',
// // //             confirmButtonColor: '#3085d6'
// // //           });
// // //           setLoading(false);
// // //         }
// // //       }
// // //     });
// // //   };

// // //   return (
// // //     <div className="quiz-creator">
// // //       <h2>Create New Quiz</h2>
// // //       {error && <div className="error">{error}</div>}

// // //       <form className='quiz-form' onSubmit={handleSubmit}>
// // //         <div className="form-group">
// // //           <label>Quiz Title</label>
// // //           <input
// // //             type="text"
// // //             value={title}
// // //             onChange={(e) => setTitle(e.target.value)}
// // //             placeholder="Enter quiz title"
// // //             required
// // //           />
// // //         </div>

// // //         <div className="form-group">
// // //           <label>Start Time</label>
// // //           <input
// // //             type="datetime-local"
// // //             value={startTime}
// // //             onChange={(e) => setStartTime(e.target.value)}
// // //             required
// // //           />
// // //         </div>

// // //         <div className="form-group">
// // //           <label>End Time</label>
// // //           <input
// // //             type="datetime-local"
// // //             value={endTime}
// // //             onChange={(e) => setEndTime(e.target.value)}
// // //             required
// // //           />
// // //         </div>

// // //         <h3>Questions</h3>
// // //         {questions.map((q, qIndex) => (
// // //           <div key={qIndex} className="question-block">
// // //             <h4>Question {qIndex + 1}</h4>
// // //             <input
// // //               type="text"
// // //               placeholder="Enter question"
// // //               value={q.question}
// // //               onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
// // //               required
// // //             />

// // //             <div className="options">
// // //               {q.options.map((option, oIndex) => (
// // //                 <div key={oIndex} className="option">
// // //                   <input
// // //                     type="text"
// // //                     placeholder={`Option ${oIndex + 1}`}
// // //                     value={option}
// // //                     onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
// // //                     required
// // //                   />
// // //                   <input
// // //                     type="radio"
// // //                     name={`correct-${qIndex}`}
// // //                     checked={q.answer === option}
// // //                     onChange={() => updateQuestion(qIndex, 'answer', option)}
// // //                     disabled={!option}
// // //                   />
// // //                   <label>Correct</label>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         ))}

// // //         <button type="button" onClick={addQuestion}>Add Question</button>
// // //         <button type="submit" disabled={loading}>
// // //           {loading ? 'Creating...' : 'Create Quiz'}
// // //         </button>
// // //       </form>
// // //     </div>
// // //   );
// // // }

// // // export default AdminDashboard;

// // import React, { useState, useEffect, useRef } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import Swal from 'sweetalert2';
// // import './admin.css';

// // const API = 'http://localhost:8006';

// // function AdminDashboard() {
// //   const [quizzes, setQuizzes] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [view, setView] = useState('allQuizzes');
// //   const [selectedQuiz, setSelectedQuiz] = useState(null);
// //   const [studentEmail, setStudentEmail] = useState('');
// //   const [studentProgress, setStudentProgress] = useState([]);
// //   const [submissions, setSubmissions] = useState([]);
// //   const [leaderboard, setLeaderboard] = useState([]);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     document.body.classList.add('admin-body');
// //     return () => document.body.classList.remove('admin-body');
// //   }, []);

// //   useEffect(() => {
// //     fetchAllQuizzes();
// //   }, []);

// //   const fetchAllQuizzes = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.get(`${API}/quiz/admin/all`);
// //       setQuizzes(response.data);
// //       setLoading(false);
// //     } catch (err) {
// //       setError('Failed to fetch quizzes');
// //       setLoading(false);
// //     }
// //   };

// //   const fetchSubmissions = async (quizId) => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.get(`${API}/quiz/admin/submissions/${quizId}`);
// //       setSubmissions(response.data.submissions || []);
// //       setLoading(false);
// //     } catch (err) {
// //       setError('Failed to fetch submissions');
// //       setLoading(false);
// //     }
// //   };

// //   const fetchStudentProgress = async () => {
// //     if (!studentEmail) { setError('Please enter a student email'); return; }
// //     try {
// //       setLoading(true);
// //       const response = await axios.get(`${API}/quiz/admin/progress/${studentEmail}`);
// //       setStudentProgress(response.data);
// //       setLoading(false);
// //     } catch (err) {
// //       setError('Failed to fetch student progress');
// //       setLoading(false);
// //     }
// //   };

// //   const fetchLeaderboard = async (quizId) => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.get(`${API}/leaderboard/quiz/${quizId}`);
// //       setLeaderboard(response.data);
// //       setLoading(false);
// //     } catch (err) {
// //       setError('Failed to fetch leaderboard');
// //       setLoading(false);
// //     }
// //   };

// //   const handleViewChange = (newView, quiz = null) => {
// //     setView(newView);
// //     setError(null);
// //     if (quiz) {
// //       setSelectedQuiz(quiz);
// //       if (newView === 'submissions') fetchSubmissions(quiz.id);
// //       else if (newView === 'leaderboard') fetchLeaderboard(quiz.id);
// //     }
// //   };

// //   const renderQuizList = () => {
// //     if (loading) return <div className="loading">Loading quizzes...</div>;
// //     if (error) return <div className="error">{error}</div>;
// //     return (
// //       <div className="quiz-list">
// //         <h2>All Quizzes</h2>
// //         {quizzes.length === 0 ? (
// //           <div>No quizzes available. Create a quiz to get started.</div>
// //         ) : (
// //           <div className="quiz-table-container">
// //             <table className="quiz-table">
// //               <thead className="quiz-table-head">
// //                 <tr className="quiz-table-head-row">
// //                   <th className="quiz-table-header-cell">Title</th>
// //                   <th className="quiz-table-header-cell">Start Time</th>
// //                   <th className="quiz-table-header-cell">End Time</th>
// //                   <th className="quiz-table-header-cell">Questions</th>
// //                   <th className="quiz-table-header-cell">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="quiz-table-body">
// //                 {quizzes.map((quiz) => (
// //                   <tr key={quiz.id} className="quiz-table-row">
// //                     <td className="quiz-table-cell">{quiz.title}</td>
// //                     <td className="quiz-table-cell">{new Date(quiz.startTime).toLocaleString()}</td>
// //                     <td className="quiz-table-cell">{new Date(quiz.endTime).toLocaleString()}</td>
// //                     <td className="quiz-table-cell">{quiz.questions.length}</td>
// //                     <td className="quiz-table-cell">
// //                       <button className="quiz-action-button" onClick={() => handleViewChange('submissions', quiz)}>Submissions</button>
// //                       <button className="quiz-action-button" onClick={() => handleViewChange('leaderboard', quiz)}>Leaderboard</button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   const renderSubmissions = () => {
// //     if (!selectedQuiz) return <div>No quiz selected</div>;
// //     if (loading) return <div className="loading">Loading submissions...</div>;
// //     return (
// //       <div className="submissions">
// //         <h2>Submissions: {selectedQuiz.title}</h2>
// //         {submissions.length === 0 ? <p>No submissions yet</p> : (
// //           <table className="progress-table">
// //             <thead><tr><th>Email</th><th>Username</th><th>Score</th><th>Submitted At</th></tr></thead>
// //             <tbody>
// //               {submissions.map((sub, index) => (
// //                 <tr key={index}>
// //                   <td>{sub.studentId}</td>
// //                   <td>{sub.studentname}</td>
// //                   <td>{sub.score} / {selectedQuiz.questions.length}</td>
// //                   <td>{new Date(sub.submitted_at).toLocaleString()}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         )}
// //         <button onClick={() => handleViewChange('allQuizzes')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-4">Back to Quizzes</button>
// //       </div>
// //     );
// //   };

// //   const renderStudentProgress = () => (
// //     <div className="student-progress">
// //       <h2>Student Progress</h2>
// //       <div className="search-bar">
// //         <input type="email" placeholder="Enter student email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} />
// //         <button onClick={fetchStudentProgress}>Search</button>
// //       </div>
// //       {loading ? <div className="loading">Loading progress...</div>
// //         : studentProgress.length > 0 ? (
// //           <table className="progress-table">
// //             <thead><tr><th>Quiz Title</th><th>Status</th><th>Score</th><th>Submitted At</th></tr></thead>
// //             <tbody>
// //               {studentProgress.map((item, index) => (
// //                 <tr key={index} className={item.status === 'missed' ? 'missed' : ''}>
// //                   <td>{item.title}</td>
// //                   <td>{item.status}</td>
// //                   <td>{item.status === 'submitted' ? `${item.score}` : 'N/A'}</td>
// //                   <td>{item.submittedAt ? new Date(item.submittedAt).toLocaleString() : 'N/A'}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         ) : error ? <div className="error">{error}</div>
// //           : <p>Enter student email to view progress</p>}
// //     </div>
// //   );

// //   const renderLeaderboard = () => {
// //     if (!selectedQuiz) return <div>No quiz selected</div>;
// //     if (loading) return <div className="loading">Loading leaderboard...</div>;
// //     return (
// //       <div className="leaderboard">
// //         <h2>Leaderboard: {selectedQuiz.title}</h2>
// //         {leaderboard.length === 0 ? <p>No submissions yet</p> : (
// //           <table className="progress-table">
// //             <thead><tr><th>Rank</th><th>Username</th><th>Score</th><th>Submitted At</th></tr></thead>
// //             <tbody>
// //               {leaderboard.map((entry) => (
// //                 <tr key={entry.email}>
// //                   <td>{entry.rank}</td>
// //                   <td>{entry.username}</td>
// //                   <td>{entry.score} / {selectedQuiz.questions.length}</td>
// //                   <td>{new Date(entry.submittedAt).toLocaleString()}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         )}
// //         <button onClick={() => handleViewChange('allQuizzes')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-4">Back to Quizzes</button>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="admin-container">
// //       <div className="header">
// //         <h1 className="admin-h1">Quiz Admin Dashboard</h1>
// //         <nav>
// //           <button onClick={() => handleViewChange('allQuizzes')}>All Quizzes</button>
// //           <button onClick={() => handleViewChange('createQuiz')}>Create Quiz</button>
// //           <button onClick={() => handleViewChange('createQuizAI')} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', fontWeight: 600 }}>
// //             ✦ Create Quiz with AI
// //           </button>
// //           <button onClick={() => handleViewChange('progress')}>Student Progress</button>
// //         </nav>
// //       </div>
// //       <main>
// //         {view === 'allQuizzes' && renderQuizList()}
// //         {view === 'createQuiz' && <QuizCreator onQuizCreated={fetchAllQuizzes} />}
// //         {view === 'createQuizAI' && <AIQuizCreator onQuizCreated={fetchAllQuizzes} />}
// //         {view === 'submissions' && renderSubmissions()}
// //         {view === 'progress' && renderStudentProgress()}
// //         {view === 'leaderboard' && renderLeaderboard()}
// //       </main>
// //     </div>
// //   );
// // }

// // // ─────────────────────────────────────────────
// // // AI Quiz Creator — Step 1: config → Step 2: edit generated questions → Step 3: save
// // // ─────────────────────────────────────────────
// // function AIQuizCreator({ onQuizCreated }) {
// //   const [step, setStep] = useState('config'); // 'config' | 'edit'

// //   // Config state
// //   const [course, setCourse] = useState('');
// //   const [numQuestions, setNumQuestions] = useState(5);
// //   const [difficulty, setDifficulty] = useState('medium');
// //   const [startTime, setStartTime] = useState('');
// //   const [endTime, setEndTime] = useState('');
// //   const [pdfFile, setPdfFile] = useState(null);
// //   const [generating, setGenerating] = useState(false);
// //   const [genError, setGenError] = useState(null);
// //   const fileInputRef = useRef(null);

// //   // Generated quiz state (editable)
// //   const [genTitle, setGenTitle] = useState('');
// //   const [genQuestions, setGenQuestions] = useState([]);
// //   const [saving, setSaving] = useState(false);

// //   const handleGenerate = async (e) => {
// //     e.preventDefault();
// //     if (!course.trim()) { setGenError('Please enter a course name'); return; }
// //     if (!pdfFile) { setGenError('Please upload a PDF file'); return; }
// //     if (!startTime || !endTime) { setGenError('Please set start and end times'); return; }

// //     setGenerating(true);
// //     setGenError(null);

// //     try {
// //       const formData = new FormData();
// //       formData.append('pdf', pdfFile);
// //       formData.append('numQuestions', numQuestions);
// //       formData.append('difficulty', difficulty);
// //       formData.append('startTime', new Date(startTime).toISOString());
// //       formData.append('endTime', new Date(endTime).toISOString());

// //       const response = await axios.post(
// //         `${API}/ai/generate-quiz/${encodeURIComponent(course)}`,
// //         formData,
// //         { headers: { 'Content-Type': 'multipart/form-data' } }
// //       );

// //       const quiz = response.data;
// //       setGenTitle(quiz.title);
// //       // Normalize questions: ensure options is always array of 4 strings
// //       setGenQuestions(quiz.questions.map(q => ({
// //         question: q.question,
// //         options: Array.isArray(q.options) ? q.options : ['', '', '', ''],
// //         answer: q.answer,
// //       })));
// //       setStep('edit');
// //     } catch (err) {
// //       setGenError(err.response?.data?.error || 'Failed to generate quiz. Try again.');
// //     } finally {
// //       setGenerating(false);
// //     }
// //   };

// //   // Edit helpers
// //   const updateGenQuestion = (idx, field, value) => {
// //     setGenQuestions(qs => {
// //       const copy = qs.map(q => ({ ...q, options: [...q.options] }));
// //       copy[idx][field] = value;
// //       return copy;
// //     });
// //   };

// //   const updateGenOption = (qIdx, oIdx, value) => {
// //     setGenQuestions(qs => {
// //       const copy = qs.map(q => ({ ...q, options: [...q.options] }));
// //       const prevAnswer = copy[qIdx].answer;
// //       const oldOptionVal = copy[qIdx].options[oIdx];
// //       copy[qIdx].options[oIdx] = value;
// //       // If the edited option was the current answer, update answer to new value
// //       if (prevAnswer === oldOptionVal) copy[qIdx].answer = value;
// //       return copy;
// //     });
// //   };

// //   const deleteGenQuestion = (idx) => {
// //     setGenQuestions(qs => qs.filter((_, i) => i !== idx));
// //   };

// //   const addGenQuestion = () => {
// //     setGenQuestions(qs => [...qs, { question: '', options: ['', '', '', ''], answer: '' }]);
// //   };

// //   const handleSaveAIQuiz = async () => {
// //     if (!genTitle.trim()) { Swal.fire({ title: 'Missing Title', icon: 'warning', text: 'Please enter a quiz title.' }); return; }
// //     if (genQuestions.length === 0) { Swal.fire({ title: 'No Questions', icon: 'warning', text: 'Add at least one question.' }); return; }
// //     const incomplete = genQuestions.some(q => !q.question.trim() || q.options.some(o => !o.trim()) || !q.answer.trim());
// //     if (incomplete) { Swal.fire({ title: 'Incomplete Questions', icon: 'warning', text: 'All questions need text, 4 options, and a correct answer.' }); return; }

// //     const result = await Swal.fire({
// //       title: 'Create Quiz?',
// //       text: `Create "${genTitle}" with ${genQuestions.length} question(s)?`,
// //       icon: 'question',
// //       showCancelButton: true,
// //       confirmButtonColor: '#3085d6',
// //       cancelButtonColor: '#d33',
// //       confirmButtonText: 'Yes, create it!',
// //     });

// //     if (!result.isConfirmed) return;

// //     setSaving(true);
// //     try {
// //       await axios.post(`${API}/quiz/admin/create`, {
// //         title: genTitle,
// //         questions: genQuestions,
// //         startTime: new Date(startTime).toISOString(),
// //         endTime: new Date(endTime).toISOString(),
// //       });
// //       Swal.fire({ title: 'Success!', text: 'Quiz created successfully!', icon: 'success', confirmButtonColor: '#3085d6' });
// //       onQuizCreated();
// //       // Reset
// //       setStep('config');
// //       setCourse(''); setNumQuestions(5); setDifficulty('medium');
// //       setStartTime(''); setEndTime(''); setPdfFile(null);
// //       setGenTitle(''); setGenQuestions([]);
// //     } catch (err) {
// //       Swal.fire({ title: 'Error!', text: 'Failed to create quiz.', icon: 'error', confirmButtonColor: '#3085d6' });
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   // ── Step 1: Config form ────────────────────────────────────────────────────
// //   if (step === 'config') {
// //     return (
// //       <div className="quiz-creator ai-quiz-creator">
// //         <div className="ai-badge">✦ AI-Powered</div>
// //         <h2>Generate Quiz with AI</h2>
// //         <p className="ai-subtitle">Upload course material and let AI craft your quiz questions.</p>

// //         {genError && <div className="error" style={{ marginBottom: 16 }}>{genError}</div>}

// //         <form className="quiz-form" onSubmit={handleGenerate}>
// //           <div className="form-group">
// //             <label>Course Name</label>
// //             <input
// //               type="text"
// //               value={course}
// //               onChange={e => setCourse(e.target.value)}
// //               placeholder="e.g. Introduction to Computer Science"
// //               required
// //             />
// //           </div>

// //           <div className="form-group">
// //             <label>Upload Course PDF</label>
// //             <div
// //               className="pdf-drop-zone"
// //               onClick={() => fileInputRef.current?.click()}
// //               onDragOver={e => e.preventDefault()}
// //               onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === 'application/pdf') setPdfFile(f); }}
// //             >
// //               {pdfFile ? (
// //                 <div className="pdf-selected">
// //                   <span className="pdf-icon">📄</span>
// //                   <span>{pdfFile.name}</span>
// //                   <button type="button" className="pdf-clear-btn" onClick={e => { e.stopPropagation(); setPdfFile(null); }}>✕</button>
// //                 </div>
// //               ) : (
// //                 <div className="pdf-placeholder">
// //                   <span style={{ fontSize: 32 }}>⬆</span>
// //                   <p>Click or drag & drop a PDF here</p>
// //                   <span className="pdf-hint">Only PDF files are accepted</span>
// //                 </div>
// //               )}
// //             </div>
// //             <input ref={fileInputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => setPdfFile(e.target.files[0] || null)} />
// //           </div>

// //           <div className="form-row">
// //             <div className="form-group">
// //               <label>Number of Questions</label>
// //               <select value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))}>
// //                 {[3, 5, 8, 10, 15, 20].map(n => <option key={n} value={n}>{n} Questions</option>)}
// //               </select>
// //             </div>
// //             <div className="form-group">
// //               <label>Difficulty</label>
// //               <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
// //                 <option value="easy">Easy</option>
// //                 <option value="medium">Medium</option>
// //                 <option value="hard">Hard</option>
// //               </select>
// //             </div>
// //           </div>

// //           <div className="form-row">
// //             <div className="form-group">
// //               <label>Start Time</label>
// //               <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
// //             </div>
// //             <div className="form-group">
// //               <label>End Time</label>
// //               <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
// //             </div>
// //           </div>

// //           <button type="submit" className="ai-generate-btn" disabled={generating}>
// //             {generating ? (
// //               <span className="generating-state">
// //                 <span className="spinner" />
// //                 Generating Quiz...
// //               </span>
// //             ) : '✦ Generate Quiz'}
// //           </button>
// //         </form>

// //         <style>{`
// //           .ai-quiz-creator { position: relative; }
// //           .ai-badge {
// //             display: inline-block;
// //             background: linear-gradient(135deg, #667eea, #764ba2);
// //             color: #fff;
// //             font-size: 12px;
// //             font-weight: 700;
// //             letter-spacing: 0.05em;
// //             padding: 4px 12px;
// //             border-radius: 999px;
// //             margin-bottom: 12px;
// //           }
// //           .ai-subtitle { color: #666; margin: -8px 0 24px; font-size: 14px; }
// //           .pdf-drop-zone {
// //             border: 2px dashed #c4b5fd;
// //             border-radius: 12px;
// //             padding: 32px 20px;
// //             text-align: center;
// //             cursor: pointer;
// //             background: #faf5ff;
// //             transition: border-color 0.2s, background 0.2s;
// //           }
// //           .pdf-drop-zone:hover { border-color: #7c3aed; background: #f3e8ff; }
// //           .pdf-placeholder p { margin: 8px 0 4px; font-size: 15px; color: #555; }
// //           .pdf-hint { font-size: 12px; color: #999; }
// //           .pdf-selected { display: flex; align-items: center; gap: 12px; justify-content: center; font-size: 15px; color: #333; }
// //           .pdf-icon { font-size: 24px; }
// //           .pdf-clear-btn { background: none; border: none; cursor: pointer; color: #999; font-size: 18px; padding: 0 4px; }
// //           .pdf-clear-btn:hover { color: #e53e3e; }
// //           .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
// //           .ai-generate-btn {
// //             width: 100%;
// //             padding: 14px;
// //             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// //             color: #fff;
// //             border: none;
// //             border-radius: 10px;
// //             font-size: 16px;
// //             font-weight: 700;
// //             cursor: pointer;
// //             margin-top: 8px;
// //             transition: opacity 0.2s, transform 0.1s;
// //           }
// //           .ai-generate-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
// //           .ai-generate-btn:disabled { opacity: 0.65; cursor: not-allowed; }
// //           .generating-state { display: flex; align-items: center; justify-content: center; gap: 10px; }
// //           .spinner {
// //             width: 18px; height: 18px;
// //             border: 2px solid rgba(255,255,255,0.4);
// //             border-top-color: #fff;
// //             border-radius: 50%;
// //             animation: spin 0.8s linear infinite;
// //           }
// //           @keyframes spin { to { transform: rotate(360deg); } }
// //         `}</style>
// //       </div>
// //     );
// //   }

// //   // ── Step 2: Edit AI-generated questions ────────────────────────────────────
// //   return (
// //     <div className="quiz-creator ai-quiz-editor">
// //       <div className="ai-badge">✦ AI Generated — Review & Edit</div>
// //       <h2>Review Generated Quiz</h2>
// //       <p className="ai-subtitle">Edit questions, options, or answers before saving. You can also delete or add questions.</p>

// //       <div className="form-group">
// //         <label>Quiz Title</label>
// //         <input type="text" value={genTitle} onChange={e => setGenTitle(e.target.value)} placeholder="Quiz title" />
// //       </div>

// //       <div className="form-group" style={{ display: 'flex', gap: 12, fontSize: 13, color: '#666', background: '#f8f4ff', padding: '10px 14px', borderRadius: 8, border: '1px solid #e9d5ff' }}>
// //         <span>📅 {startTime ? new Date(startTime).toLocaleString() : '—'} → {endTime ? new Date(endTime).toLocaleString() : '—'}</span>
// //         <span>·</span>
// //         <span>📚 {course}</span>
// //         <span>·</span>
// //         <span>⚡ {difficulty}</span>
// //       </div>

// //       <h3 style={{ marginTop: 24 }}>Questions ({genQuestions.length})</h3>

// //       {genQuestions.map((q, qIdx) => (
// //         <div key={qIdx} className="question-block ai-question-block">
// //           <div className="ai-question-header">
// //             <h4 style={{ margin: 0 }}>Question {qIdx + 1}</h4>
// //             <button
// //               type="button"
// //               className="delete-question-btn"
// //               onClick={() => deleteGenQuestion(qIdx)}
// //               title="Delete this question"
// //             >✕ Delete</button>
// //           </div>

// //           <input
// //             type="text"
// //             placeholder="Enter question"
// //             value={q.question}
// //             onChange={e => updateGenQuestion(qIdx, 'question', e.target.value)}
// //           />

// //           <div className="options">
// //             {q.options.map((option, oIdx) => (
// //               <div key={oIdx} className="option">
// //                 <input
// //                   type="text"
// //                   placeholder={`Option ${oIdx + 1}`}
// //                   value={option}
// //                   onChange={e => updateGenOption(qIdx, oIdx, e.target.value)}
// //                 />
// //                 <input
// //                   type="radio"
// //                   name={`correct-ai-${qIdx}`}
// //                   checked={q.answer === option && option !== ''}
// //                   onChange={() => updateGenQuestion(qIdx, 'answer', option)}
// //                   disabled={!option}
// //                 />
// //                 <label>Correct</label>
// //               </div>
// //             ))}
// //           </div>

// //           {q.answer && (
// //             <div className="ai-answer-badge">
// //               ✓ Correct answer: <strong>{q.answer}</strong>
// //             </div>
// //           )}
// //         </div>
// //       ))}

// //       <button type="button" className="add-question-btn" onClick={addGenQuestion}>+ Add Question</button>

// //       <div className="ai-editor-actions">
// //         <button type="button" className="back-btn" onClick={() => setStep('config')}>← Back to Config</button>
// //         <button type="button" className="ai-save-btn" onClick={handleSaveAIQuiz} disabled={saving}>
// //           {saving ? 'Creating...' : '✓ Create Quiz'}
// //         </button>
// //       </div>

// //       <style>{`
// //         .ai-quiz-editor { position: relative; }
// //         .ai-badge {
// //           display: inline-block;
// //           background: linear-gradient(135deg, #667eea, #764ba2);
// //           color: #fff;
// //           font-size: 12px;
// //           font-weight: 700;
// //           letter-spacing: 0.05em;
// //           padding: 4px 12px;
// //           border-radius: 999px;
// //           margin-bottom: 12px;
// //         }
// //         .ai-subtitle { color: #666; margin: -8px 0 20px; font-size: 14px; }
// //         .ai-question-block { position: relative; border: 1.5px solid #e9d5ff; border-radius: 10px; background: #faf5ff; }
// //         .ai-question-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
// //         .delete-question-btn {
// //           background: #fff0f0;
// //           color: #e53e3e;
// //           border: 1px solid #fed7d7;
// //           border-radius: 6px;
// //           padding: 4px 10px;
// //           font-size: 12px;
// //           font-weight: 600;
// //           cursor: pointer;
// //           transition: background 0.15s;
// //         }
// //         .delete-question-btn:hover { background: #fed7d7; }
// //         .ai-answer-badge {
// //           margin-top: 10px;
// //           font-size: 13px;
// //           color: #276749;
// //           background: #f0fff4;
// //           border: 1px solid #9ae6b4;
// //           border-radius: 6px;
// //           padding: 6px 12px;
// //         }
// //         .add-question-btn {
// //           width: 100%;
// //           padding: 12px;
// //           background: #fff;
// //           color: #7c3aed;
// //           border: 2px dashed #c4b5fd;
// //           border-radius: 10px;
// //           font-size: 15px;
// //           font-weight: 600;
// //           cursor: pointer;
// //           margin-top: 4px;
// //           transition: background 0.15s;
// //         }
// //         .add-question-btn:hover { background: #faf5ff; }
// //         .ai-editor-actions { display: flex; gap: 12px; margin-top: 24px; }
// //         .back-btn {
// //           flex: 1;
// //           padding: 12px;
// //           background: #fff;
// //           color: #555;
// //           border: 1.5px solid #ddd;
// //           border-radius: 10px;
// //           font-size: 15px;
// //           font-weight: 600;
// //           cursor: pointer;
// //           transition: background 0.15s;
// //         }
// //         .back-btn:hover { background: #f5f5f5; }
// //         .ai-save-btn {
// //           flex: 2;
// //           padding: 12px;
// //           background: linear-gradient(135deg, #38a169, #2f855a);
// //           color: #fff;
// //           border: none;
// //           border-radius: 10px;
// //           font-size: 16px;
// //           font-weight: 700;
// //           cursor: pointer;
// //           transition: opacity 0.2s;
// //         }
// //         .ai-save-btn:hover:not(:disabled) { opacity: 0.9; }
// //         .ai-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
// //         .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
// //       `}</style>
// //     </div>
// //   );
// // }

// // // ─────────────────────────────────────────────
// // // Manual Quiz Creator (unchanged logic, + delete question button)
// // // ─────────────────────────────────────────────
// // function QuizCreator({ onQuizCreated }) {
// //   const [title, setTitle] = useState('');
// //   const [startTime, setStartTime] = useState('');
// //   const [endTime, setEndTime] = useState('');
// //   const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);

// //   const addQuestion = () => {
// //     setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
// //   };

// //   const deleteQuestion = (index) => {
// //     if (questions.length === 1) {
// //       Swal.fire({ title: 'Cannot Delete', text: 'A quiz must have at least one question.', icon: 'warning', confirmButtonColor: '#3085d6' });
// //       return;
// //     }
// //     setQuestions(questions.filter((_, i) => i !== index));
// //   };

// //   const updateQuestion = (index, field, value) => {
// //     const updated = [...questions];
// //     updated[index][field] = value;
// //     setQuestions(updated);
// //   };

// //   const updateOption = (qIdx, oIdx, value) => {
// //     const updated = questions.map(q => ({ ...q, options: [...q.options] }));
// //     const prevAnswer = updated[qIdx].answer;
// //     const oldVal = updated[qIdx].options[oIdx];
// //     updated[qIdx].options[oIdx] = value;
// //     if (prevAnswer === oldVal) updated[qIdx].answer = value;
// //     setQuestions(updated);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!title || !startTime || !endTime) {
// //       Swal.fire({ title: 'Missing Information', text: 'Please fill all required fields', icon: 'warning', confirmButtonColor: '#3085d6' });
// //       return;
// //     }
// //     if (questions.some(q => !q.question || q.options.some(opt => !opt) || !q.answer)) {
// //       Swal.fire({ title: 'Incomplete Questions', text: 'Please complete all questions with options and answers', icon: 'warning', confirmButtonColor: '#3085d6' });
// //       return;
// //     }

// //     const result = await Swal.fire({
// //       title: 'Create Quiz?',
// //       text: `Are you sure you want to create "${title}" with ${questions.length} question(s)?`,
// //       icon: 'question',
// //       showCancelButton: true,
// //       confirmButtonColor: '#3085d6',
// //       cancelButtonColor: '#d33',
// //       confirmButtonText: 'Yes, create it!',
// //     });

// //     if (!result.isConfirmed) return;

// //     try {
// //       setLoading(true);
// //       await axios.post(`${API}/quiz/admin/create`, {
// //         title,
// //         questions,
// //         startTime: new Date(startTime).toISOString(),
// //         endTime: new Date(endTime).toISOString(),
// //       });
// //       Swal.fire({ title: 'Success!', text: 'Quiz has been created successfully', icon: 'success', confirmButtonColor: '#3085d6' });
// //       setTitle(''); setStartTime(''); setEndTime('');
// //       setQuestions([{ question: '', options: ['', '', '', ''], answer: '' }]);
// //       setError(null);
// //       onQuizCreated();
// //     } catch (err) {
// //       Swal.fire({ title: 'Error!', text: 'Failed to create quiz', icon: 'error', confirmButtonColor: '#3085d6' });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="quiz-creator">
// //       <h2>Create New Quiz</h2>
// //       {error && <div className="error">{error}</div>}
// //       <form className="quiz-form" onSubmit={handleSubmit}>
// //         <div className="form-group">
// //           <label>Quiz Title</label>
// //           <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter quiz title" required />
// //         </div>
// //         <div className="form-group">
// //           <label>Start Time</label>
// //           <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
// //         </div>
// //         <div className="form-group">
// //           <label>End Time</label>
// //           <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
// //         </div>

// //         <h3>Questions</h3>
// //         {questions.map((q, qIdx) => (
// //           <div key={qIdx} className="question-block">
// //             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
// //               <h4 style={{ margin: 0 }}>Question {qIdx + 1}</h4>
// //               <button
// //                 type="button"
// //                 onClick={() => deleteQuestion(qIdx)}
// //                 style={{
// //                   background: '#fff0f0', color: '#e53e3e', border: '1px solid #fed7d7',
// //                   borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
// //                 }}
// //               >✕ Delete</button>
// //             </div>
// //             <input type="text" placeholder="Enter question" value={q.question} onChange={e => updateQuestion(qIdx, 'question', e.target.value)} required />
// //             <div className="options">
// //               {q.options.map((option, oIdx) => (
// //                 <div key={oIdx} className="option">
// //                   <input type="text" placeholder={`Option ${oIdx + 1}`} value={option} onChange={e => updateOption(qIdx, oIdx, e.target.value)} required />
// //                   <input type="radio" name={`correct-${qIdx}`} checked={q.answer === option} onChange={() => updateQuestion(qIdx, 'answer', option)} disabled={!option} />
// //                   <label>Correct</label>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         ))}

// //         <button type="button" onClick={addQuestion}>Add Question</button>
// //         <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Quiz'}</button>
// //       </form>
// //     </div>
// //   );
// // }

// // export default AdminDashboard;

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import './admin.css';

// const API = 'http://localhost:8006';

// function AdminDashboard() {
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [view, setView] = useState('allQuizzes');
//   const [selectedQuiz, setSelectedQuiz] = useState(null);
//   const [studentEmail, setStudentEmail] = useState('');
//   const [studentProgress, setStudentProgress] = useState([]);
//   const [submissions, setSubmissions] = useState([]);
//   const [leaderboard, setLeaderboard] = useState([]);
//   // ── NEW: subject filter for All Quizzes ──
//   const [subjectFilter, setSubjectFilter] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     document.body.classList.add('admin-body');
//     return () => document.body.classList.remove('admin-body');
//   }, []);

//   useEffect(() => {
//     fetchAllQuizzes();
//   }, []);

//   const fetchAllQuizzes = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API}/quiz/admin/all`);
//       setQuizzes(response.data);
//       setLoading(false);
//     } catch (err) {
//       setError('Failed to fetch quizzes');
//       setLoading(false);
//     }
//   };

//   const fetchSubmissions = async (quizId) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API}/quiz/admin/submissions/${quizId}`);
//       setSubmissions(response.data.submissions || []);
//       setLoading(false);
//     } catch (err) {
//       setError('Failed to fetch submissions');
//       setLoading(false);
//     }
//   };

//   const fetchStudentProgress = async () => {
//     if (!studentEmail) { setError('Please enter a student email'); return; }
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API}/quiz/admin/progress/${studentEmail}`);
//       setStudentProgress(response.data);
//       setLoading(false);
//     } catch (err) {
//       setError('Failed to fetch student progress');
//       setLoading(false);
//     }
//   };

//   const fetchLeaderboard = async (quizId) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API}/leaderboard/quiz/${quizId}`);
//       setLeaderboard(response.data);
//       setLoading(false);
//     } catch (err) {
//       setError('Failed to fetch leaderboard');
//       setLoading(false);
//     }
//   };

//   const handleViewChange = (newView, quiz = null) => {
//     setView(newView);
//     setError(null);
//     if (quiz) {
//       setSelectedQuiz(quiz);
//       if (newView === 'submissions') fetchSubmissions(quiz.id);
//       else if (newView === 'leaderboard') fetchLeaderboard(quiz.id);
//     }
//   };

//   // ── Derive unique subjects from quizzes for the filter dropdown ──
//   const uniqueSubjects = Array.from(
//     new Set(quizzes.map(q => q.subject || q.course || '').filter(Boolean))
//   ).sort();

//   // ── Filtered quizzes based on selected subject ──
//   const filteredQuizzes = subjectFilter
//     ? quizzes.filter(q => (q.subject || q.course || '') === subjectFilter)
//     : quizzes;

//   const renderQuizList = () => {
//     if (loading) return <div className="loading">Loading quizzes...</div>;
//     if (error) return <div className="error">{error}</div>;
//     return (
//       <div className="quiz-list">
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
//           <h2 style={{ margin: 0 }}>All Quizzes</h2>

//           {/* ── Subject Filter Dropdown ── */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//             <label style={{ fontSize: 14, fontWeight: 600, color: '#555', whiteSpace: 'nowrap' }}>
//               Filter by Subject:
//             </label>
//             <select
//               value={subjectFilter}
//               onChange={e => setSubjectFilter(e.target.value)}
//               style={{
//                 padding: '7px 32px 7px 12px',
//                 borderRadius: 8,
//                 border: '1.5px solid #c4b5fd',
//                 background: '#faf5ff',
//                 color: '#4a1d96',
//                 fontWeight: 600,
//                 fontSize: 14,
//                 cursor: 'pointer',
//                 outline: 'none',
//                 appearance: 'none',
//                 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237c3aed' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
//                 backgroundRepeat: 'no-repeat',
//                 backgroundPosition: 'right 10px center',
//                 minWidth: 180,
//               }}
//             >
//               <option value="">All Subjects</option>
//               {uniqueSubjects.map(s => (
//                 <option key={s} value={s}>{s}</option>
//               ))}
//             </select>
//             {subjectFilter && (
//               <button
//                 onClick={() => setSubjectFilter('')}
//                 style={{
//                   background: 'none', border: 'none', color: '#999',
//                   cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 4px',
//                 }}
//                 title="Clear filter"
//               >✕</button>
//             )}
//           </div>
//         </div>

//         {filteredQuizzes.length === 0 ? (
//           <div style={{ padding: '24px 0', color: '#777', textAlign: 'center' }}>
//             {subjectFilter ? `No quizzes found for "${subjectFilter}".` : 'No quizzes available. Create a quiz to get started.'}
//           </div>
//         ) : (
//           <div className="quiz-table-container">
//             <table className="quiz-table">
//               <thead className="quiz-table-head">
//                 <tr className="quiz-table-head-row">
//                   <th className="quiz-table-header-cell">Title</th>
//                   <th className="quiz-table-header-cell">Subject</th>
//                   <th className="quiz-table-header-cell">Start Time</th>
//                   <th className="quiz-table-header-cell">End Time</th>
//                   <th className="quiz-table-header-cell">Questions</th>
//                   <th className="quiz-table-header-cell">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="quiz-table-body">
//                 {filteredQuizzes.map((quiz) => (
//                   <tr key={quiz.id} className="quiz-table-row">
//                     <td className="quiz-table-cell">{quiz.title}</td>
//                     <td className="quiz-table-cell">
//                       {quiz.subject || quiz.course ? (
//                         <span style={{
//                           display: 'inline-block',
//                           background: '#f3e8ff',
//                           color: '#7c3aed',
//                           border: '1px solid #e9d5ff',
//                           borderRadius: 6,
//                           padding: '2px 10px',
//                           fontSize: 12,
//                           fontWeight: 600,
//                         }}>
//                           {quiz.subject || quiz.course}
//                         </span>
//                       ) : (
//                         <span style={{ color: '#bbb', fontSize: 13 }}>—</span>
//                       )}
//                     </td>
//                     <td className="quiz-table-cell">{new Date(quiz.startTime).toLocaleString()}</td>
//                     <td className="quiz-table-cell">{new Date(quiz.endTime).toLocaleString()}</td>
//                     <td className="quiz-table-cell">{quiz.questions.length}</td>
//                     <td className="quiz-table-cell">
//                       <button className="quiz-action-button" onClick={() => handleViewChange('submissions', quiz)}>Submissions</button>
//                       <button className="quiz-action-button" onClick={() => handleViewChange('leaderboard', quiz)}>Leaderboard</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderSubmissions = () => {
//     if (!selectedQuiz) return <div>No quiz selected</div>;
//     if (loading) return <div className="loading">Loading submissions...</div>;
//     return (
//       <div className="submissions">
//         <h2>Submissions: {selectedQuiz.title}</h2>
//         {submissions.length === 0 ? <p>No submissions yet</p> : (
//           <table className="progress-table">
//             <thead><tr><th>Email</th><th>Username</th><th>Score</th><th>Submitted At</th></tr></thead>
//             <tbody>
//               {submissions.map((sub, index) => (
//                 <tr key={index}>
//                   <td>{sub.studentId}</td>
//                   <td>{sub.studentname}</td>
//                   <td>{sub.score} / {selectedQuiz.questions.length}</td>
//                   <td>{new Date(sub.submitted_at).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//         <button onClick={() => handleViewChange('allQuizzes')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-4">Back to Quizzes</button>
//       </div>
//     );
//   };

//   const renderStudentProgress = () => (
//     <div className="student-progress">
//       <h2>Student Progress</h2>
//       <div className="search-bar">
//         <input type="email" placeholder="Enter student email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} />
//         <button onClick={fetchStudentProgress}>Search</button>
//       </div>
//       {loading ? <div className="loading">Loading progress...</div>
//         : studentProgress.length > 0 ? (
//           <table className="progress-table">
//             <thead><tr><th>Quiz Title</th><th>Status</th><th>Score</th><th>Submitted At</th></tr></thead>
//             <tbody>
//               {studentProgress.map((item, index) => (
//                 <tr key={index} className={item.status === 'missed' ? 'missed' : ''}>
//                   <td>{item.title}</td>
//                   <td>{item.status}</td>
//                   <td>{item.status === 'submitted' ? `${item.score}` : 'N/A'}</td>
//                   <td>{item.submittedAt ? new Date(item.submittedAt).toLocaleString() : 'N/A'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : error ? <div className="error">{error}</div>
//           : <p>Enter student email to view progress</p>}
//     </div>
//   );

//   const renderLeaderboard = () => {
//     if (!selectedQuiz) return <div>No quiz selected</div>;
//     if (loading) return <div className="loading">Loading leaderboard...</div>;
//     return (
//       <div className="leaderboard">
//         <h2>Leaderboard: {selectedQuiz.title}</h2>
//         {leaderboard.length === 0 ? <p>No submissions yet</p> : (
//           <table className="progress-table">
//             <thead><tr><th>Rank</th><th>Username</th><th>Score</th><th>Submitted At</th></tr></thead>
//             <tbody>
//               {leaderboard.map((entry) => (
//                 <tr key={entry.email}>
//                   <td>{entry.rank}</td>
//                   <td>{entry.username}</td>
//                   <td>{entry.score} / {selectedQuiz.questions.length}</td>
//                   <td>{new Date(entry.submittedAt).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//         <button onClick={() => handleViewChange('allQuizzes')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-4">Back to Quizzes</button>
//       </div>
//     );
//   };

//   return (
//     <div className="admin-container">
//       <div className="header">
//         <h1 className="admin-h1">Quiz Admin Dashboard</h1>
//         <nav>
//           <button onClick={() => handleViewChange('allQuizzes')}>All Quizzes</button>
//           <button onClick={() => handleViewChange('createQuiz')}>Create Quiz</button>
//           <button onClick={() => handleViewChange('createQuizAI')} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', fontWeight: 600 }}>
//             ✦ Create Quiz with AI
//           </button>
//           <button onClick={() => handleViewChange('progress')}>Student Progress</button>
//         </nav>
//       </div>
//       <main>
//         {view === 'allQuizzes' && renderQuizList()}
//         {view === 'createQuiz' && <QuizCreator onQuizCreated={fetchAllQuizzes} />}
//         {view === 'createQuizAI' && <AIQuizCreator onQuizCreated={fetchAllQuizzes} />}
//         {view === 'submissions' && renderSubmissions()}
//         {view === 'progress' && renderStudentProgress()}
//         {view === 'leaderboard' && renderLeaderboard()}
//       </main>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // AI Quiz Creator — Step 1: config → Step 2: edit generated questions → Step 3: save
// // ─────────────────────────────────────────────
// function AIQuizCreator({ onQuizCreated }) {
//   const [step, setStep] = useState('config');
//   const [courses, setCourses] = useState([]);
//   const [course, setCourse] = useState('');
//   const [customCourse, setCustomCourse] = useState('');
//   const [numQuestions, setNumQuestions] = useState(5);
//   const [difficulty, setDifficulty] = useState('medium');
//   const [startTime, setStartTime] = useState('');
//   const [endTime, setEndTime] = useState('');
//   const [pdfFile, setPdfFile] = useState(null);
//   const [generating, setGenerating] = useState(false);
//   const [genError, setGenError] = useState(null);
//   const fileInputRef = useRef(null);
//   const [genTitle, setGenTitle] = useState('');
//   const [genQuestions, setGenQuestions] = useState([]);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await axios.get(`${API}/courses/`);
//         setCourses(res.data || []);
//       } catch (error) {
//         console.error('Error fetching courses:', error);
//         setCourses([]);
//       }
//     };
//     fetchCourses();
//   }, []);

//   // The effective course value — either selected from dropdown or typed manually
//   const effectiveCourse = course === '__custom__' ? customCourse : course;

//   const handleGenerate = async (e) => {
//     e.preventDefault();
//     if (!effectiveCourse.trim()) { setGenError('Please select or enter a course'); return; }
//     if (!pdfFile) { setGenError('Please upload a PDF file'); return; }
//     if (!startTime || !endTime) { setGenError('Please set start and end times'); return; }
//     setGenerating(true);
//     setGenError(null);
//     try {
//       const formData = new FormData();
//       formData.append('pdf', pdfFile);
//       formData.append('numQuestions', numQuestions);
//       formData.append('difficulty', difficulty);
//       formData.append('startTime', new Date(startTime).toISOString());
//       formData.append('endTime', new Date(endTime).toISOString());
//       const response = await axios.post(
//         `${API}/ai/generate-quiz/${encodeURIComponent(effectiveCourse)}`,
//         formData,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );
//       const quiz = response.data;
//       setGenTitle(quiz.title);
//       setGenQuestions(quiz.questions.map(q => ({
//         question: q.question,
//         options: Array.isArray(q.options) ? q.options : ['', '', '', ''],
//         answer: q.answer,
//       })));
//       setStep('edit');
//     } catch (err) {
//       setGenError(err.response?.data?.error || 'Failed to generate quiz. Try again.');
//     } finally {
//       setGenerating(false);
//     }
//   };

//   const updateGenQuestion = (idx, field, value) => {
//     setGenQuestions(qs => {
//       const copy = qs.map(q => ({ ...q, options: [...q.options] }));
//       copy[idx][field] = value;
//       return copy;
//     });
//   };

//   const updateGenOption = (qIdx, oIdx, value) => {
//     setGenQuestions(qs => {
//       const copy = qs.map(q => ({ ...q, options: [...q.options] }));
//       const prevAnswer = copy[qIdx].answer;
//       const oldOptionVal = copy[qIdx].options[oIdx];
//       copy[qIdx].options[oIdx] = value;
//       if (prevAnswer === oldOptionVal) copy[qIdx].answer = value;
//       return copy;
//     });
//   };

//   const deleteGenQuestion = (idx) => {
//     setGenQuestions(qs => qs.filter((_, i) => i !== idx));
//   };

//   const addGenQuestion = () => {
//     setGenQuestions(qs => [...qs, { question: '', options: ['', '', '', ''], answer: '' }]);
//   };

//   const handleSaveAIQuiz = async () => {
//     if (!genTitle.trim()) { Swal.fire({ title: 'Missing Title', icon: 'warning', text: 'Please enter a quiz title.' }); return; }
//     if (genQuestions.length === 0) { Swal.fire({ title: 'No Questions', icon: 'warning', text: 'Add at least one question.' }); return; }
//     const incomplete = genQuestions.some(q => !q.question.trim() || q.options.some(o => !o.trim()) || !q.answer.trim());
//     if (incomplete) { Swal.fire({ title: 'Incomplete Questions', icon: 'warning', text: 'All questions need text, 4 options, and a correct answer.' }); return; }
//     const result = await Swal.fire({
//       title: 'Create Quiz?',
//       text: `Create "${genTitle}" with ${genQuestions.length} question(s)?`,
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, create it!',
//     });
//     if (!result.isConfirmed) return;
//     setSaving(true);
//     try {
//       await axios.post(`${API}/quiz/admin/create`, {
//         title: genTitle,
//         course: effectiveCourse,
//         questions: genQuestions,
//         startTime: new Date(startTime).toISOString(),
//         endTime: new Date(endTime).toISOString(),
//       });
//       Swal.fire({ title: 'Success!', text: 'Quiz created successfully!', icon: 'success', confirmButtonColor: '#3085d6' });
//       onQuizCreated();
//       setStep('config');
//       setCourse(''); setCustomCourse(''); setNumQuestions(5); setDifficulty('medium');
//       setStartTime(''); setEndTime(''); setPdfFile(null);
//       setGenTitle(''); setGenQuestions([]);
//     } catch (err) {
//       Swal.fire({ title: 'Error!', text: 'Failed to create quiz.', icon: 'error', confirmButtonColor: '#3085d6' });
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (step === 'config') {
//     return (
//       <div className="quiz-creator ai-quiz-creator">
//         <div className="ai-badge">✦ AI-Powered</div>
//         <h2>Generate Quiz with AI</h2>
//         <p className="ai-subtitle">Upload course material and let AI craft your quiz questions.</p>
//         {genError && <div className="error" style={{ marginBottom: 16 }}>{genError}</div>}
//         <form className="quiz-form" onSubmit={handleGenerate}>

//           {/* ── Course Selection Dropdown ── */}
//           <div className="form-group">
//             <label>Course / Subject</label>
//             <select
//               value={course}
//               onChange={e => setCourse(e.target.value)}
//               required={course !== '__custom__'}
//               style={{
//                 width: '100%',
//                 padding: '10px 14px',
//                 borderRadius: 8,
//                 border: '1.5px solid #c4b5fd',
//                 background: '#faf5ff',
//                 color: course ? '#4a1d96' : '#999',
//                 fontWeight: course ? 600 : 400,
//                 fontSize: 14,
//                 marginBottom: course === '__custom__' ? 10 : 0,
//                 cursor: 'pointer',
//                 outline: 'none',
//               }}
//             >
//               <option value="">— Select a course —</option>
//               {courses.map((c, i) => (
//                 <option key={i} value={typeof c === 'string' ? c : c.name || c.title || JSON.stringify(c)}>
//                   {typeof c === 'string' ? c : c.name || c.title || JSON.stringify(c)}
//                 </option>
//               ))}
//               <option value="__custom__">✏️ Enter manually…</option>
//             </select>

//             {/* Show text input only when "Enter manually" is chosen */}
//             {course === '__custom__' && (
//               <input
//                 type="text"
//                 value={customCourse}
//                 onChange={e => setCustomCourse(e.target.value)}
//                 placeholder="e.g. Introduction to Computer Science"
//                 required
//                 style={{ marginTop: 0 }}
//               />
//             )}
//           </div>

//           <div className="form-group">
//             <label>Upload Course PDF</label>
//             <div
//               className="pdf-drop-zone"
//               onClick={() => fileInputRef.current?.click()}
//               onDragOver={e => e.preventDefault()}
//               onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === 'application/pdf') setPdfFile(f); }}
//             >
//               {pdfFile ? (
//                 <div className="pdf-selected">
//                   <span className="pdf-icon"></span>
//                   <span>{pdfFile.name}</span>
//                   <button type="button" className="pdf-clear-btn" onClick={e => { e.stopPropagation(); setPdfFile(null); }}>✕</button>
//                 </div>
//               ) : (
//                 <div className="pdf-placeholder">
//                   <span style={{ fontSize: 32 }}>⬆</span>
//                   <p>Click or drag & drop a PDF here</p>
//                   <span className="pdf-hint">Only PDF files are accepted</span>
//                 </div>
//               )}
//             </div>
//             <input ref={fileInputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => setPdfFile(e.target.files[0] || null)} />
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label>Number of Questions</label>
//               <select value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))}>
//                 {[3, 5, 8, 10, 15, 20].map(n => <option key={n} value={n}>{n} Questions</option>)}
//               </select>
//             </div>
//             <div className="form-group">
//               <label>Difficulty</label>
//               <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
//                 <option value="easy">Easy</option>
//                 <option value="medium">Medium</option>
//                 <option value="hard">Hard</option>
//               </select>
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label>Start Time</label>
//               <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
//             </div>
//             <div className="form-group">
//               <label>End Time</label>
//               <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
//             </div>
//           </div>

//           <button type="submit" className="ai-generate-btn" disabled={generating}>
//             {generating ? (
//               <span className="generating-state">
//                 <span className="spinner" />
//                 Generating Quiz...
//               </span>
//             ) : '✦ Generate Quiz'}
//           </button>
//         </form>

//         <style>{`
//           .ai-quiz-creator { position: relative; }
//           .ai-badge {
//             display: inline-block;
//             background: linear-gradient(135deg, #667eea, #764ba2);
//             color: #fff;
//             font-size: 12px;
//             font-weight: 700;
//             letter-spacing: 0.05em;
//             padding: 4px 12px;
//             border-radius: 999px;
//             margin-bottom: 12px;
//           }
//           .ai-subtitle { color: #666; margin: -8px 0 24px; font-size: 14px; }
//           .pdf-drop-zone {
//             border: 2px dashed #c4b5fd;
//             border-radius: 12px;
//             padding: 32px 20px;
//             text-align: center;
//             cursor: pointer;
//             background: #faf5ff;
//             transition: border-color 0.2s, background 0.2s;
//           }
//           .pdf-drop-zone:hover { border-color: #7c3aed; background: #f3e8ff; }
//           .pdf-placeholder p { margin: 8px 0 4px; font-size: 15px; color: #555; }
//           .pdf-hint { font-size: 12px; color: #999; }
//           .pdf-selected { display: flex; align-items: center; gap: 12px; justify-content: center; font-size: 15px; color: #333; }
//           .pdf-icon { font-size: 24px; }
//           .pdf-clear-btn { background: none; border: none; cursor: pointer; color: #999; font-size: 18px; padding: 0 4px; }
//           .pdf-clear-btn:hover { color: #e53e3e; }
//           .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
//           .ai-generate-btn {
//             width: 100%;
//             padding: 14px;
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             color: #fff;
//             border: none;
//             border-radius: 10px;
//             font-size: 16px;
//             font-weight: 700;
//             cursor: pointer;
//             margin-top: 8px;
//             transition: opacity 0.2s, transform 0.1s;
//           }
//           .ai-generate-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
//           .ai-generate-btn:disabled { opacity: 0.65; cursor: not-allowed; }
//           .generating-state { display: flex; align-items: center; justify-content: center; gap: 10px; }
//           .spinner {
//             width: 18px; height: 18px;
//             border: 2px solid rgba(255,255,255,0.4);
//             border-top-color: #fff;
//             border-radius: 50%;
//             animation: spin 0.8s linear infinite;
//           }
//           @keyframes spin { to { transform: rotate(360deg); } }
//         `}</style>
//       </div>
//     );
//   }

//   // ── Step 2: Edit AI-generated questions ──
//   return (
//     <div className="quiz-creator ai-quiz-editor">
//       <div className="ai-badge">✦ AI Generated — Review & Edit</div>
//       <h2>Review Generated Quiz</h2>
//       <p className="ai-subtitle">Edit questions, options, or answers before saving. You can also delete or add questions.</p>
//       <div className="form-group">
//         <label>Quiz Title</label>
//         <input type="text" value={genTitle} onChange={e => setGenTitle(e.target.value)} placeholder="Quiz title" />
//       </div>
//       <div className="form-group" style={{ display: 'flex', gap: 12, fontSize: 13, color: '#666', background: '#f8f4ff', padding: '10px 14px', borderRadius: 8, border: '1px solid #e9d5ff' }}>
//         <span>{startTime ? new Date(startTime).toLocaleString() : '—'} → {endTime ? new Date(endTime).toLocaleString() : '—'}</span>
//         <span>·</span>
//         <span> {effectiveCourse}</span>
//         <span>·</span>
//         <span>⚡ {difficulty}</span>
//       </div>
//       <h3 style={{ marginTop: 24 }}>Questions ({genQuestions.length})</h3>
//       {genQuestions.map((q, qIdx) => (
//         <div key={qIdx} className="question-block ai-question-block">
//           <div className="ai-question-header">
//             <h4 style={{ margin: 0 }}>Question {qIdx + 1}</h4>
//             <button type="button" className="delete-question-btn" onClick={() => deleteGenQuestion(qIdx)} title="Delete this question">✕ Delete</button>
//           </div>
//           {/* <input type="text" placeholder="Enter question" value={q.question} onChange={e => updateGenQuestion(qIdx, 'question', e.target.value)} /> */}
//           <textarea
//             placeholder="Enter question"
//             value={q.question}
//             onChange={e => updateGenQuestion(qIdx, 'question', e.target.value)}
//             rows={3}
//             style={{
//               width: "100%",
//               resize: "vertical",
//               padding: "10px",
//               borderRadius: "8px",
//               border: "1px solid #ddd",
//               fontSize: "14px"
//             }}
//           />
//           <div className="options">
//             {q.options.map((option, oIdx) => (
//               <div key={oIdx} className="option">
//                 <input type="text" placeholder={`Option ${oIdx + 1}`} value={option} onChange={e => updateGenOption(qIdx, oIdx, e.target.value)} />
//                 <input type="radio" name={`correct-ai-${qIdx}`} checked={q.answer === option && option !== ''} onChange={() => updateGenQuestion(qIdx, 'answer', option)} disabled={!option} />
//                 <label>Correct</label>
//               </div>
//             ))}
//           </div>
//           {q.answer && (
//             <div className="ai-answer-badge">
//               ✓ Correct answer: <strong>{q.answer}</strong>
//             </div>
//           )}
//         </div>
//       ))}
//       <button type="button" className="add-question-btn" onClick={addGenQuestion}>+ Add Question</button>
//       <div className="ai-editor-actions">
//         <button type="button" className="back-btn" onClick={() => setStep('config')}>← Back to Config</button>
//         <button type="button" className="ai-save-btn" onClick={handleSaveAIQuiz} disabled={saving}>
//           {saving ? 'Creating...' : '✓ Create Quiz'}
//         </button>
//       </div>
//       <style>{`
//         .ai-quiz-editor { position: relative; }
//         .ai-badge {
//           display: inline-block;
//           background: linear-gradient(135deg, #667eea, #764ba2);
//           color: #fff;
//           font-size: 12px;
//           font-weight: 700;
//           letter-spacing: 0.05em;
//           padding: 4px 12px;
//           border-radius: 999px;
//           margin-bottom: 12px;
//         }
//         .ai-subtitle { color: #666; margin: -8px 0 20px; font-size: 14px; }
//         .ai-question-block { position: relative; border: 1.5px solid #e9d5ff; border-radius: 10px; background: #faf5ff; }
//         .ai-question-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
//         .delete-question-btn {
//           background: #fff0f0; color: #e53e3e; border: 1px solid #fed7d7;
//           border-radius: 6px; padding: 4px 10px; font-size: 12px; font-weight: 600;
//           cursor: pointer; transition: background 0.15s;
//         }
//         .delete-question-btn:hover { background: #fed7d7; }
//         .ai-answer-badge {
//           margin-top: 10px; font-size: 13px; color: #276749;
//           background: #f0fff4; border: 1px solid #9ae6b4;
//           border-radius: 6px; padding: 6px 12px;
//         }
//         .add-question-btn {
//           width: 100%; padding: 12px; background: #fff; color: #7c3aed;
//           border: 2px dashed #c4b5fd; border-radius: 10px; font-size: 15px;
//           font-weight: 600; cursor: pointer; margin-top: 4px; transition: background 0.15s;
//         }
//         .add-question-btn:hover { background: #faf5ff; }
//         .ai-editor-actions { display: flex; gap: 12px; margin-top: 24px; }
//         .back-btn {
//           flex: 1; padding: 12px; background: #fff; color: #555;
//           border: 1.5px solid #ddd; border-radius: 10px; font-size: 15px;
//           font-weight: 600; cursor: pointer; transition: background 0.15s;
//         }
//         .back-btn:hover { background: #f5f5f5; }
//         .ai-save-btn {
//           flex: 2; padding: 12px;
//           background: linear-gradient(135deg, #38a169, #2f855a);
//           color: #fff; border: none; border-radius: 10px; font-size: 16px;
//           font-weight: 700; cursor: pointer; transition: opacity 0.2s;
//         }
//         .ai-save-btn:hover:not(:disabled) { opacity: 0.9; }
//         .ai-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
//         .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
//       `}</style>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // Manual Quiz Creator — with course dropdown
// // ─────────────────────────────────────────────
// function QuizCreator({ onQuizCreated }) {
//   const [title, setTitle] = useState('');
//   const [course, setCourse] = useState('');
//   const [customCourse, setCustomCourse] = useState('');
//   const [courses, setCourses] = useState([]);
//   const [startTime, setStartTime] = useState('');
//   const [endTime, setEndTime] = useState('');
//   const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await axios.get(`${API}/courses/`);
//         setCourses(res.data || []);
//       } catch (err) {
//         console.error('Error fetching courses:', err);
//         setCourses([]);
//       }
//     };
//     fetchCourses();
//   }, []);

//   const effectiveCourse = course === '__custom__' ? customCourse : course;

//   const addQuestion = () => {
//     setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
//   };

//   const deleteQuestion = (index) => {
//     if (questions.length === 1) {
//       Swal.fire({ title: 'Cannot Delete', text: 'A quiz must have at least one question.', icon: 'warning', confirmButtonColor: '#3085d6' });
//       return;
//     }
//     setQuestions(questions.filter((_, i) => i !== index));
//   };

//   const updateQuestion = (index, field, value) => {
//     const updated = [...questions];
//     updated[index][field] = value;
//     setQuestions(updated);
//   };

//   const updateOption = (qIdx, oIdx, value) => {
//     const updated = questions.map(q => ({ ...q, options: [...q.options] }));
//     const prevAnswer = updated[qIdx].answer;
//     const oldVal = updated[qIdx].options[oIdx];
//     updated[qIdx].options[oIdx] = value;
//     if (prevAnswer === oldVal) updated[qIdx].answer = value;
//     setQuestions(updated);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title || !startTime || !endTime) {
//       Swal.fire({ title: 'Missing Information', text: 'Please fill all required fields', icon: 'warning', confirmButtonColor: '#3085d6' });
//       return;
//     }
//     if (!effectiveCourse.trim()) {
//       Swal.fire({ title: 'Missing Course', text: 'Please select or enter a course', icon: 'warning', confirmButtonColor: '#3085d6' });
//       return;
//     }
//     if (questions.some(q => !q.question || q.options.some(opt => !opt) || !q.answer)) {
//       Swal.fire({ title: 'Incomplete Questions', text: 'Please complete all questions with options and answers', icon: 'warning', confirmButtonColor: '#3085d6' });
//       return;
//     }
//     const result = await Swal.fire({
//       title: 'Create Quiz?',
//       text: `Are you sure you want to create "${title}" with ${questions.length} question(s)?`,
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, create it!',
//     });
//     if (!result.isConfirmed) return;
//     try {
//       setLoading(true);
//       await axios.post(`${API}/quiz/admin/create`, {
//         title,
//         course: effectiveCourse,
//         questions,
//         startTime: new Date(startTime).toISOString(),
//         endTime: new Date(endTime).toISOString(),
//       });
//       Swal.fire({ title: 'Success!', text: 'Quiz has been created successfully', icon: 'success', confirmButtonColor: '#3085d6' });
//       setTitle(''); setCourse(''); setCustomCourse('');
//       setStartTime(''); setEndTime('');
//       setQuestions([{ question: '', options: ['', '', '', ''], answer: '' }]);
//       setError(null);
//       onQuizCreated();
//     } catch (err) {
//       Swal.fire({ title: 'Error!', text: 'Failed to create quiz', icon: 'error', confirmButtonColor: '#3085d6' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="quiz-creator">
//       <h2>Create New Quiz</h2>
//       {error && <div className="error">{error}</div>}
//       <form className="quiz-form" onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Quiz Title</label>
//           <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter quiz title" required />
//         </div>

//         {/* ── Course / Subject Dropdown ── */}
//         <div className="form-group">
//           <label>Course / Subject</label>
//           <select
//             value={course}
//             onChange={e => setCourse(e.target.value)}
//             required={course !== '__custom__'}
//             style={{
//               width: '100%',
//               padding: '10px 14px',
//               borderRadius: 8,
//               border: '1.5px solid #d1d5db',
//               background: '#fff',
//               color: course ? '#111' : '#999',
//               fontSize: 14,
//               marginBottom: course === '__custom__' ? 10 : 0,
//               cursor: 'pointer',
//               outline: 'none',
//             }}
//           >
//             <option value="">— Select a course —</option>
//             {courses.map((c, i) => (
//               <option key={i} value={typeof c === 'string' ? c : c.name || c.title || JSON.stringify(c)}>
//                 {typeof c === 'string' ? c : c.name || c.title || JSON.stringify(c)}
//               </option>
//             ))}
//             <option value="__custom__">✏️ Enter manually…</option>
//           </select>

//           {course === '__custom__' && (
//             <input
//               type="text"
//               value={customCourse}
//               onChange={e => setCustomCourse(e.target.value)}
//               placeholder="e.g. Introduction to Computer Science"
//               required
//               style={{ marginTop: 0 }}
//             />
//           )}
//         </div>

//         <div className="form-group">
//           <label>Start Time</label>
//           <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
//         </div>
//         <div className="form-group">
//           <label>End Time</label>
//           <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
//         </div>

//         <h3>Questions</h3>
//         {questions.map((q, qIdx) => (
//           <div key={qIdx} className="question-block">
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
//               <h4 style={{ margin: 0 }}>Question {qIdx + 1}</h4>
//               <button
//                 type="button"
//                 onClick={() => deleteQuestion(qIdx)}
//                 style={{
//                   background: '#fff0f0', color: '#e53e3e', border: '1px solid #fed7d7',
//                   borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
//                 }}
//               >✕ Delete</button>
//             </div>
//             <input type="text" placeholder="Enter question" value={q.question} onChange={e => updateQuestion(qIdx, 'question', e.target.value)} required />
//             <div className="options">
//               {q.options.map((option, oIdx) => (
//                 <div key={oIdx} className="option">
//                   <input type="text" placeholder={`Option ${oIdx + 1}`} value={option} onChange={e => updateOption(qIdx, oIdx, e.target.value)} required />
//                   <input type="radio" name={`correct-${qIdx}`} checked={q.answer === option} onChange={() => updateQuestion(qIdx, 'answer', option)} disabled={!option} />
//                   <label>Correct</label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//         <button type="button" onClick={addQuestion}>Add Question</button>
//         <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Quiz'}</button>
//       </form>
//     </div>
//   );
// }

// export default AdminDashboard;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './admin.css';

const API = 'http://localhost:8006';

function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('allQuizzes');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [studentEmail, setStudentEmail] = useState('');
  const [studentProgress, setStudentProgress] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('admin-body');
    return () => document.body.classList.remove('admin-body');
  }, []);

  useEffect(() => {
    fetchAllQuizzes();
  }, []);

  const fetchAllQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/quiz/admin/all`);
      setQuizzes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch quizzes');
      setLoading(false);
    }
  };

  // FIX: Backend route is GET /admin/submissions/:quizId — match that
  const fetchSubmissions = async (quizId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/quiz/admin/submissions/${quizId}`);
      // Backend returns { submissions: [...] } or array directly — handle both
      const data = response.data;
      setSubmissions(Array.isArray(data) ? data : (data.submissions || []));
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch submissions');
      setLoading(false);
    }
  };

  const fetchStudentProgress = async () => {
    if (!studentEmail) { setError('Please enter a student email'); return; }
    try {
      setLoading(true);
      const response = await axios.get(`${API}/quiz/admin/progress/${studentEmail}`);
      setStudentProgress(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch student progress');
      setLoading(false);
    }
  };

  const fetchLeaderboard = async (quizId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/leaderboard/quiz/${quizId}`);
      setLeaderboard(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch leaderboard');
      setLoading(false);
    }
  };

  const handleViewChange = (newView, quiz = null) => {
    setView(newView);
    setError(null);
    if (quiz) {
      setSelectedQuiz(quiz);
      // FIX: quiz.id is set to quiz.title in the backend — use that
      if (newView === 'submissions') fetchSubmissions(quiz.id);
      else if (newView === 'leaderboard') fetchLeaderboard(quiz.id);
    }
  };

  const uniqueSubjects = Array.from(
    new Set(quizzes.map(q => q.subject || '').filter(Boolean))
  ).sort();

  const filteredQuizzes = subjectFilter
    ? quizzes.filter(q => (q.subject || '') === subjectFilter)
    : quizzes;

  const renderQuizList = () => {
    if (loading) return <div className="loading">Loading quizzes...</div>;
    if (error) return <div className="error">{error}</div>;
    return (
      <div className="quiz-list">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>All Quizzes</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#555', whiteSpace: 'nowrap' }}>
              Filter by Subject:
            </label>
            <select
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
              style={{
                padding: '7px 32px 7px 12px',
                borderRadius: 8,
                border: '1.5px solid #c4b5fd',
                background: '#faf5ff',
                color: '#4a1d96',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237c3aed' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                minWidth: 180,
              }}
            >
              <option value="">All Subjects</option>
              {uniqueSubjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {subjectFilter && (
              <button
                onClick={() => setSubjectFilter('')}
                style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 4px' }}
                title="Clear filter"
              >✕</button>
            )}
          </div>
        </div>

        {filteredQuizzes.length === 0 ? (
          <div style={{ padding: '24px 0', color: '#777', textAlign: 'center' }}>
            {subjectFilter ? `No quizzes found for "${subjectFilter}".` : 'No quizzes available. Create a quiz to get started.'}
          </div>
        ) : (
          <div className="quiz-table-container">
            <table className="quiz-table">
              <thead className="quiz-table-head">
                <tr className="quiz-table-head-row">
                  <th className="quiz-table-header-cell">Title</th>
                  <th className="quiz-table-header-cell">Subject</th>
                  <th className="quiz-table-header-cell">Start Time</th>
                  <th className="quiz-table-header-cell">End Time</th>
                  <th className="quiz-table-header-cell">Questions</th>
                  <th className="quiz-table-header-cell" style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="quiz-table-body">
                {filteredQuizzes.map((quiz) => (
                  <tr key={quiz.id} className="quiz-table-row">
                    <td className="quiz-table-cell">{quiz.title}</td>
                    <td className="quiz-table-cell">
                      {quiz.subject ? (
                        <span style={{
                          display: 'inline-block',
                          background: '#f3e8ff',
                          color: '#7c3aed',
                          border: '1px solid #e9d5ff',
                          borderRadius: 6,
                          padding: '2px 10px',
                          fontSize: 12,
                          fontWeight: 600,
                        }}>
                          {quiz.subject}
                        </span>
                      ) : (
                        <span style={{ color: '#bbb', fontSize: 13 }}>—</span>
                      )}
                    </td>
                    <td className="quiz-table-cell">{new Date(quiz.startTime).toLocaleString()}</td>
                    <td className="quiz-table-cell">{new Date(quiz.endTime).toLocaleString()}</td>
                    <td className="quiz-table-cell" style={{ textAlign: 'center' }}>{quiz.questions.length}</td>
                    {/* FIX: Action buttons aligned in a flex row */}
                    <td className="quiz-table-cell">
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {/* <button
                          className="quiz-action-button"
                          style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
                          onClick={() => handleViewChange('submissions', quiz)}
                        >
                          Submissions
                        </button>
                        <button
                          className="quiz-action-button"
                          style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}
                          onClick={() => handleViewChange('leaderboard', quiz)}
                        >
                          Leaderboard
                        </button>
                        <button
                          className="quiz-action-button"
                          style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }}
                          onClick={() => handleViewChange('editQuiz', quiz)}
                        >
                          Edit
                        </button> */}
                        <button
                          className="quiz-action-button btn-blue"
                          onClick={() => handleViewChange('submissions', quiz)}
                        >
                          Submissions
                        </button>

                        <button
                          className="quiz-action-button btn-green"
                          onClick={() => handleViewChange('leaderboard', quiz)}
                        >
                          Leaderboard
                        </button>

                        <button
                          className="quiz-action-button btn-orange"
                          onClick={() => handleViewChange('editQuiz', quiz)}
                        >
                          Edit
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}


      </div>
    );
  };

  const renderSubmissions = () => {
    if (!selectedQuiz) return <div>No quiz selected</div>;
    if (loading) return <div className="loading">Loading submissions...</div>;
    return (
      <div className="submissions">
        <h2>Submissions: {selectedQuiz.title}</h2>
        {submissions.length === 0 ? <p>No submissions yet</p> : (
          <table className="progress-table">
            <thead><tr><th>Email</th><th>Username</th><th>Score</th><th>Submitted At</th></tr></thead>
            <tbody>
              {submissions.map((sub, index) => (
                <tr key={index}>
                  <td>{sub.studentId}</td>
                  <td>{sub.studentname}</td>
                  <td>{sub.score} / {selectedQuiz.questions.length}</td>
                  <td>{new Date(sub.submitted_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button onClick={() => handleViewChange('allQuizzes')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-4">Back to Quizzes</button>
      </div>
    );
  };

  const renderStudentProgress = () => (
    <div className="student-progress">
      <h2>Student Progress</h2>
      <div className="search-bar">
        <input type="email" placeholder="Enter student email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} />
        <button onClick={fetchStudentProgress}>Search</button>
      </div>
      {loading ? <div className="loading">Loading progress...</div>
        : studentProgress.length > 0 ? (
          <table className="progress-table">
            {/* FIX: Show subject column — backend now returns it */}
            <thead><tr><th>Quiz Title</th><th>Subject</th><th>Status</th><th>Score</th><th>Submitted At</th></tr></thead>
            <tbody>
              {studentProgress.map((item, index) => (
                <tr key={index} className={item.status === 'missed' ? 'missed' : ''}>
                  <td>{item.title}</td>
                  <td>{item.subject || '—'}</td>
                  <td>{item.status}</td>
                  <td>{item.status === 'submitted' ? `${item.score}` : 'N/A'}</td>
                  <td>{item.submittedAt ? new Date(item.submittedAt).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : error ? <div className="error">{error}</div>
          : <p>Enter student email to view progress</p>}
    </div>
  );

  const renderLeaderboard = () => {
    if (!selectedQuiz) return <div>No quiz selected</div>;
    if (loading) return <div className="loading">Loading leaderboard...</div>;
    return (
      <div className="leaderboard">
        <h2>Leaderboard: {selectedQuiz.title}</h2>
        {leaderboard.length === 0 ? <p>No submissions yet</p> : (
          <table className="progress-table">
            <thead><tr><th>Rank</th><th>Username</th><th>Score</th><th>Submitted At</th></tr></thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.email}>
                  <td>{entry.rank}</td>
                  <td>{entry.username}</td>
                  <td>{entry.score} / {selectedQuiz.questions.length}</td>
                  <td>{new Date(entry.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button onClick={() => handleViewChange('allQuizzes')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-4">Back to Quizzes</button>
      </div>
    );
  };

  return (
    <div className="admin-container">
      <div className="header">
        <h1 className="admin-h1">Quiz Admin Dashboard</h1>
        <nav>
          <button onClick={() => handleViewChange('allQuizzes')}>All Quizzes</button>
          <button onClick={() => handleViewChange('createQuiz')}>Create Quiz</button>
          <button
            onClick={() => handleViewChange('createQuizAI')}
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', fontWeight: 600 }}
          >
            ✦ Create Quiz with AI
          </button>
          <button onClick={() => handleViewChange('progress')}>Student Progress</button>
        </nav>
      </div>
      <main>
        {view === 'allQuizzes' && renderQuizList()}
        {view === 'createQuiz' && <QuizCreator onQuizCreated={fetchAllQuizzes} />}
        {view === 'createQuizAI' && <AIQuizCreator onQuizCreated={fetchAllQuizzes} />}
        {view === 'editQuiz' && selectedQuiz && (
          <QuizEditor
            quiz={selectedQuiz}
            onQuizUpdated={() => { fetchAllQuizzes(); handleViewChange('allQuizzes'); }}
            onCancel={() => handleViewChange('allQuizzes')}
          />
        )}
        {view === 'submissions' && renderSubmissions()}
        {view === 'progress' && renderStudentProgress()}
        {view === 'leaderboard' && renderLeaderboard()}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// Quiz Editor — Edit existing quiz via PUT /quiz/admin/edit/:quizId
// ─────────────────────────────────────────────
function QuizEditor({ quiz, onQuizUpdated, onCancel }) {
  const [title, setTitle] = useState(quiz.title || '');
  // FIX: backend uses 'subject' not 'course'
  const [subject, setSubject] = useState(quiz.subject || '');
  const [courses, setCourses] = useState([]);
  const [customCourse, setCustomCourse] = useState('');
  const [courseMode, setCourseMode] = useState('dropdown'); // 'dropdown' | 'custom'
  const [startTime, setStartTime] = useState(
    quiz.startTime ? new Date(quiz.startTime).toISOString().slice(0, 16) : ''
  );
  const [endTime, setEndTime] = useState(
    quiz.endTime ? new Date(quiz.endTime).toISOString().slice(0, 16) : ''
  );
  const [questions, setQuestions] = useState(
    (quiz.questions || []).map(q => ({
      question: q.question || '',
      options: Array.isArray(q.options) && q.options.length === 4 ? [...q.options] : ['', '', '', ''],
      answer: q.answer || '',
    }))
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API}/courses/`);
        setCourses(res.data || []);
      } catch {
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  const effectiveSubject = courseMode === 'custom' ? customCourse : subject;

  const updateQuestion = (idx, field, value) => {
    setQuestions(qs => {
      const copy = qs.map(q => ({ ...q, options: [...q.options] }));
      copy[idx][field] = value;
      return copy;
    });
  };

  const updateOption = (qIdx, oIdx, value) => {
    setQuestions(qs => {
      const copy = qs.map(q => ({ ...q, options: [...q.options] }));
      const prevAnswer = copy[qIdx].answer;
      const oldVal = copy[qIdx].options[oIdx];
      copy[qIdx].options[oIdx] = value;
      if (prevAnswer === oldVal) copy[qIdx].answer = value;
      return copy;
    });
  };

  const deleteQuestion = (idx) => {
    if (questions.length === 1) {
      Swal.fire({ title: 'Cannot Delete', text: 'A quiz must have at least one question.', icon: 'warning' });
      return;
    }
    setQuestions(qs => qs.filter((_, i) => i !== idx));
  };

  const addQuestion = () => {
    setQuestions(qs => [...qs, { question: '', options: ['', '', '', ''], answer: '' }]);
  };

  const handleSave = async () => {
    if (!title.trim()) { Swal.fire({ title: 'Missing Title', icon: 'warning', text: 'Please enter a quiz title.' }); return; }
    if (!effectiveSubject.trim()) { Swal.fire({ title: 'Missing Subject', icon: 'warning', text: 'Please select or enter a subject.' }); return; }
    if (!startTime || !endTime) { Swal.fire({ title: 'Missing Times', icon: 'warning', text: 'Please set start and end times.' }); return; }
    const incomplete = questions.some(q => !q.question.trim() || q.options.some(o => !o.trim()) || !q.answer.trim());
    if (incomplete) { Swal.fire({ title: 'Incomplete Questions', icon: 'warning', text: 'All questions need text, 4 options, and a correct answer.' }); return; }

    const result = await Swal.fire({
      title: 'Save Changes?',
      text: `Update "${title}" with ${questions.length} question(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save it!',
    });
    if (!result.isConfirmed) return;

    setSaving(true);
    try {
      // FIX: PUT /quiz/admin/edit/:quizId — backend uses quiz.id (which equals quiz.title)
      await axios.put(`${API}/quiz/admin/edit/${encodeURIComponent(quiz.id)}`, {
        title,
        subject: effectiveSubject,   // FIX: send 'subject' not 'course'
        questions,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      });
      Swal.fire({ title: 'Updated!', text: 'Quiz updated successfully.', icon: 'success', confirmButtonColor: '#3085d6' });
      onQuizUpdated();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update quiz.';
      Swal.fire({ title: 'Error!', text: msg, icon: 'error', confirmButtonColor: '#3085d6' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="quiz-creator">
      <div style={{
        display: 'inline-block',
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        color: '#fff',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.05em',
        padding: '4px 12px',
        borderRadius: 999,
        marginBottom: 12,
      }}>
        Edit Quiz
      </div>
      <h2>Edit Quiz</h2>
      <p style={{ color: '#666', marginTop: -8, marginBottom: 24, fontSize: 14 }}>
        Editing: <strong>{quiz.title}</strong>
      </p>

      <div className="form-group">
        <label>Quiz Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter quiz title" />
      </div>

      <div className="form-group">
        <label>Course / Subject</label>
        <select
          value={courseMode === 'custom' ? '__custom__' : subject}
          onChange={e => {
            if (e.target.value === '__custom__') {
              setCourseMode('custom');
              setCustomCourse('');
            } else {
              setCourseMode('dropdown');
              setSubject(e.target.value);
            }
          }}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 8,
            border: '1.5px solid #c4b5fd',
            background: '#faf5ff',
            color: '#4a1d96',
            fontWeight: 600,
            fontSize: 14,
            marginBottom: courseMode === 'custom' ? 10 : 0,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="">— Select a course —</option>
          {courses.map((c, i) => {
            const val = typeof c === 'string' ? c : c.name || c.title || JSON.stringify(c);
            return <option key={i} value={val}>{val}</option>;
          })}
          <option value="__custom__">✏️ Enter manually…</option>
        </select>
        {courseMode === 'custom' && (
          <input
            type="text"
            value={customCourse}
            onChange={e => setCustomCourse(e.target.value)}
            placeholder="e.g. Introduction to Computer Science"
            style={{ marginTop: 0 }}
          />
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label>Start Time</label>
          <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} />
        </div>
        <div className="form-group">
          <label>End Time</label>
          <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} />
        </div>
      </div>

      <h3 style={{ marginTop: 24 }}>Questions ({questions.length})</h3>
      {questions.map((q, qIdx) => (
        <div key={qIdx} className="question-block" style={{ border: '1.5px solid #fde68a', background: '#fffbeb', borderRadius: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h4 style={{ margin: 0 }}>Question {qIdx + 1}</h4>
            <button
              type="button"
              onClick={() => deleteQuestion(qIdx)}
              style={{
                background: '#fff0f0', color: '#e53e3e', border: '1px solid #fed7d7',
                borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >✕ Delete</button>
          </div>
          <textarea
            placeholder="Enter question"
            value={q.question}
            onChange={e => updateQuestion(qIdx, 'question', e.target.value)}
            rows={3}
            style={{ width: '100%', resize: 'vertical', padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' }}
          />
          <div className="options">
            {q.options.map((option, oIdx) => (
              <div key={oIdx} className="option">
                <input
                  type="text"
                  placeholder={`Option ${oIdx + 1}`}
                  value={option}
                  onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                />
                <input
                  type="radio"
                  name={`correct-edit-${qIdx}`}
                  checked={q.answer === option && option !== ''}
                  onChange={() => updateQuestion(qIdx, 'answer', option)}
                  disabled={!option}
                />
                <label>Correct</label>
              </div>
            ))}
          </div>
          {q.answer && (
            <div style={{ marginTop: 10, fontSize: 13, color: '#276749', background: '#f0fff4', border: '1px solid #9ae6b4', borderRadius: 6, padding: '6px 12px' }}>
              ✓ Correct answer: <strong>{q.answer}</strong>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        style={{
          width: '100%', padding: 12, background: '#fff', color: '#d97706',
          border: '2px dashed #fde68a', borderRadius: 10, fontSize: 15,
          fontWeight: 600, cursor: 'pointer', marginTop: 4,
        }}
      >+ Add Question</button>

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1, padding: 12, background: '#fff', color: '#555',
            border: '1.5px solid #ddd', borderRadius: 10, fontSize: 15,
            fontWeight: 600, cursor: 'pointer',
          }}
        >← Cancel</button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{
            flex: 2, padding: 12,
            background: saving ? '#ccc' : 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff', border: 'none', borderRadius: 10, fontSize: 16,
            fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >{saving ? 'Saving...' : '✓ Save Changes'}</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// AI Quiz Creator — Step 1: config → Step 2: edit → Step 3: save
// ─────────────────────────────────────────────
function AIQuizCreator({ onQuizCreated }) {
  const [step, setStep] = useState('config');
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState('');
  const [customCourse, setCustomCourse] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(null);
  const fileInputRef = useRef(null);
  const [genTitle, setGenTitle] = useState('');
  const [genQuestions, setGenQuestions] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API}/courses/`);
        setCourses(res.data || []);
      } catch {
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  const effectiveCourse = course === '__custom__' ? customCourse : course;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!effectiveCourse.trim()) { setGenError('Please select or enter a course'); return; }
    if (!pdfFile) { setGenError('Please upload a PDF file'); return; }
    if (!startTime || !endTime) { setGenError('Please set start and end times'); return; }
    setGenerating(true);
    setGenError(null);
    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('numQuestions', numQuestions);
      formData.append('difficulty', difficulty);
      formData.append('startTime', new Date(startTime).toISOString());
      formData.append('endTime', new Date(endTime).toISOString());
      const response = await axios.post(
        `${API}/ai/generate-quiz/${encodeURIComponent(effectiveCourse)}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      const quiz = response.data;
      setGenTitle(quiz.title);
      setGenQuestions(quiz.questions.map(q => ({
        question: q.question,
        options: Array.isArray(q.options) ? q.options : ['', '', '', ''],
        answer: q.answer,
      })));
      setStep('edit');
    } catch (err) {
      setGenError(err.response?.data?.error || 'Failed to generate quiz. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  const updateGenQuestion = (idx, field, value) => {
    setGenQuestions(qs => {
      const copy = qs.map(q => ({ ...q, options: [...q.options] }));
      copy[idx][field] = value;
      return copy;
    });
  };

  const updateGenOption = (qIdx, oIdx, value) => {
    setGenQuestions(qs => {
      const copy = qs.map(q => ({ ...q, options: [...q.options] }));
      const prevAnswer = copy[qIdx].answer;
      const oldOptionVal = copy[qIdx].options[oIdx];
      copy[qIdx].options[oIdx] = value;
      if (prevAnswer === oldOptionVal) copy[qIdx].answer = value;
      return copy;
    });
  };

  const deleteGenQuestion = (idx) => {
    setGenQuestions(qs => qs.filter((_, i) => i !== idx));
  };

  const addGenQuestion = () => {
    setGenQuestions(qs => [...qs, { question: '', options: ['', '', '', ''], answer: '' }]);
  };

  const handleSaveAIQuiz = async () => {
    if (!genTitle.trim()) { Swal.fire({ title: 'Missing Title', icon: 'warning', text: 'Please enter a quiz title.' }); return; }
    if (genQuestions.length === 0) { Swal.fire({ title: 'No Questions', icon: 'warning', text: 'Add at least one question.' }); return; }
    const incomplete = genQuestions.some(q => !q.question.trim() || q.options.some(o => !o.trim()) || !q.answer.trim());
    if (incomplete) { Swal.fire({ title: 'Incomplete Questions', icon: 'warning', text: 'All questions need text, 4 options, and a correct answer.' }); return; }
    const result = await Swal.fire({
      title: 'Create Quiz?',
      text: `Create "${genTitle}" with ${genQuestions.length} question(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!',
    });
    if (!result.isConfirmed) return;
    setSaving(true);
    try {
      // FIX: send 'subject' to match backend — was sending 'course'
      await axios.post(`${API}/quiz/admin/create`, {
        title: genTitle,
        subject: effectiveCourse,   // FIX: was 'course', backend expects 'subject'
        questions: genQuestions,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      });
      Swal.fire({ title: 'Success!', text: 'Quiz created successfully!', icon: 'success', confirmButtonColor: '#3085d6' });
      onQuizCreated();
      setStep('config');
      setCourse(''); setCustomCourse(''); setNumQuestions(5); setDifficulty('medium');
      setStartTime(''); setEndTime(''); setPdfFile(null);
      setGenTitle(''); setGenQuestions([]);
    } catch (err) {
      Swal.fire({ title: 'Error!', text: 'Failed to create quiz.', icon: 'error', confirmButtonColor: '#3085d6' });
    } finally {
      setSaving(false);
    }
  };

  if (step === 'config') {
    return (
      <div className="quiz-creator ai-quiz-creator">
        <div className="ai-badge">✦ AI-Powered</div>
        <h2>Generate Quiz with AI</h2>
        <p className="ai-subtitle">Upload course material and let AI craft your quiz questions.</p>
        {genError && <div className="error" style={{ marginBottom: 16 }}>{genError}</div>}
        <form className="quiz-form" onSubmit={handleGenerate}>
          <div className="form-group">
            <label>Course / Subject</label>
            <select
              value={course}
              onChange={e => setCourse(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                border: '1.5px solid #c4b5fd', background: '#faf5ff',
                color: course ? '#4a1d96' : '#999', fontWeight: course ? 600 : 400,
                fontSize: 14, marginBottom: course === '__custom__' ? 10 : 0,
                cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="">— Select a course —</option>
              {courses.map((c, i) => {
                const val = typeof c === 'string' ? c : c.name || c.title || JSON.stringify(c);
                return <option key={i} value={val}>{val}</option>;
              })}
              <option value="__custom__">✏️ Enter manually…</option>
            </select>
            {course === '__custom__' && (
              <input
                type="text" value={customCourse} onChange={e => setCustomCourse(e.target.value)}
                placeholder="e.g. Introduction to Computer Science" required style={{ marginTop: 0 }}
              />
            )}
          </div>

          <div className="form-group">
            <label>Upload Course PDF</label>
            <div
              className="pdf-drop-zone"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === 'application/pdf') setPdfFile(f); }}
            >
              {pdfFile ? (
                <div className="pdf-selected">
                  <span className="pdf-icon">📄</span>
                  <span>{pdfFile.name}</span>
                  <button type="button" className="pdf-clear-btn" onClick={e => { e.stopPropagation(); setPdfFile(null); }}>✕</button>
                </div>
              ) : (
                <div className="pdf-placeholder">
                  <span style={{ fontSize: 32 }}>⬆</span>
                  <p>Click or drag & drop a PDF here</p>
                  <span className="pdf-hint">Only PDF files are accepted</span>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => setPdfFile(e.target.files[0] || null)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Number of Questions</label>
              <select value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))}>
                {[3, 5, 8, 10, 15, 20].map(n => <option key={n} value={n}>{n} Questions</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time</label>
              <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="ai-generate-btn" disabled={generating}>
            {generating ? (
              <span className="generating-state">
                <span className="spinner" />
                Generating Quiz...
              </span>
            ) : '✦ Generate Quiz'}
          </button>
        </form>

        <style>{`
          .ai-quiz-creator { position: relative; }
          .ai-badge {
            display: inline-block;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: #fff; font-size: 12px; font-weight: 700;
            letter-spacing: 0.05em; padding: 4px 12px;
            border-radius: 999px; margin-bottom: 12px;
          }
          .ai-subtitle { color: #666; margin: -8px 0 24px; font-size: 14px; }
          .pdf-drop-zone {
            border: 2px dashed #c4b5fd; border-radius: 12px;
            padding: 32px 20px; text-align: center; cursor: pointer;
            background: #faf5ff; transition: border-color 0.2s, background 0.2s;
          }
          .pdf-drop-zone:hover { border-color: #7c3aed; background: #f3e8ff; }
          .pdf-placeholder p { margin: 8px 0 4px; font-size: 15px; color: #555; }
          .pdf-hint { font-size: 12px; color: #999; }
          .pdf-selected { display: flex; align-items: center; gap: 12px; justify-content: center; font-size: 15px; color: #333; }
          .pdf-icon { font-size: 24px; }
          .pdf-clear-btn { background: none; border: none; cursor: pointer; color: #999; font-size: 18px; padding: 0 4px; }
          .pdf-clear-btn:hover { color: #e53e3e; }
          .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .ai-generate-btn {
            width: 100%; padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff; border: none; border-radius: 10px;
            font-size: 16px; font-weight: 700; cursor: pointer;
            margin-top: 8px; transition: opacity 0.2s, transform 0.1s;
          }
          .ai-generate-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
          .ai-generate-btn:disabled { opacity: 0.65; cursor: not-allowed; }
          .generating-state { display: flex; align-items: center; justify-content: center; gap: 10px; }
          .spinner {
            width: 18px; height: 18px;
            border: 2px solid rgba(255,255,255,0.4);
            border-top-color: #fff; border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Step 2: Edit AI-generated questions
  return (
    <div className="quiz-creator ai-quiz-editor">
      <div className="ai-badge">✦ AI Generated — Review & Edit</div>
      <h2>Review Generated Quiz</h2>
      <p className="ai-subtitle">Edit questions, options, or answers before saving.</p>
      <div className="form-group">
        <label>Quiz Title</label>
        <input type="text" value={genTitle} onChange={e => setGenTitle(e.target.value)} placeholder="Quiz title" />
      </div>
      <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#666', background: '#f8f4ff', padding: '10px 14px', borderRadius: 8, border: '1px solid #e9d5ff', marginBottom: 8, flexWrap: 'wrap' }}>
        <span>{startTime ? new Date(startTime).toLocaleString() : '—'} → {endTime ? new Date(endTime).toLocaleString() : '—'}</span>
        <span>·</span>
        <span>{effectiveCourse}</span>
        <span>·</span>
        <span>⚡ {difficulty}</span>
      </div>
      <h3 style={{ marginTop: 24 }}>Questions ({genQuestions.length})</h3>
      {genQuestions.map((q, qIdx) => (
        <div key={qIdx} className="question-block ai-question-block">
          <div className="ai-question-header">
            <h4 style={{ margin: 0 }}>Question {qIdx + 1}</h4>
            <button type="button" className="delete-question-btn" onClick={() => deleteGenQuestion(qIdx)}>✕ Delete</button>
          </div>
          <textarea
            placeholder="Enter question"
            value={q.question}
            onChange={e => updateGenQuestion(qIdx, 'question', e.target.value)}
            rows={3}
            style={{ width: '100%', resize: 'vertical', padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' }}
          />
          <div className="options">
            {q.options.map((option, oIdx) => (
              <div key={oIdx} className="option">
                <input type="text" placeholder={`Option ${oIdx + 1}`} value={option} onChange={e => updateGenOption(qIdx, oIdx, e.target.value)} />
                <input type="radio" name={`correct-ai-${qIdx}`} checked={q.answer === option && option !== ''} onChange={() => updateGenQuestion(qIdx, 'answer', option)} disabled={!option} />
                <label>Correct</label>
              </div>
            ))}
          </div>
          {q.answer && (
            <div className="ai-answer-badge">✓ Correct answer: <strong>{q.answer}</strong></div>
          )}
        </div>
      ))}
      <button type="button" className="add-question-btn" onClick={addGenQuestion}>+ Add Question</button>
      <div className="ai-editor-actions">
        <button type="button" className="back-btn" onClick={() => setStep('config')}>← Back to Config</button>
        <button type="button" className="ai-save-btn" onClick={handleSaveAIQuiz} disabled={saving}>
          {saving ? 'Creating...' : '✓ Create Quiz'}
        </button>
      </div>
      <style>{`
        .ai-quiz-editor { position: relative; }
        .ai-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff; font-size: 12px; font-weight: 700;
          letter-spacing: 0.05em; padding: 4px 12px;
          border-radius: 999px; margin-bottom: 12px;
        }
        .ai-subtitle { color: #666; margin: -8px 0 20px; font-size: 14px; }
        .ai-question-block { position: relative; border: 1.5px solid #e9d5ff; border-radius: 10px; background: #faf5ff; }
        .ai-question-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .delete-question-btn {
          background: #fff0f0; color: #e53e3e; border: 1px solid #fed7d7;
          border-radius: 6px; padding: 4px 10px; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: background 0.15s;
        }
        .delete-question-btn:hover { background: #fed7d7; }
        .ai-answer-badge {
          margin-top: 10px; font-size: 13px; color: #276749;
          background: #f0fff4; border: 1px solid #9ae6b4;
          border-radius: 6px; padding: 6px 12px;
        }
        .add-question-btn {
          width: 100%; padding: 12px; background: #fff; color: #7c3aed;
          border: 2px dashed #c4b5fd; border-radius: 10px; font-size: 15px;
          font-weight: 600; cursor: pointer; margin-top: 4px; transition: background 0.15s;
        }
        .add-question-btn:hover { background: #faf5ff; }
        .ai-editor-actions { display: flex; gap: 12px; margin-top: 24px; }
        .back-btn {
          flex: 1; padding: 12px; background: #fff; color: #555;
          border: 1.5px solid #ddd; border-radius: 10px; font-size: 15px;
          font-weight: 600; cursor: pointer; transition: background 0.15s;
        }
        .back-btn:hover { background: #f5f5f5; }
        .ai-save-btn {
          flex: 2; padding: 12px;
          background: linear-gradient(135deg, #38a169, #2f855a);
          color: #fff; border: none; border-radius: 10px; font-size: 16px;
          font-weight: 700; cursor: pointer; transition: opacity 0.2s;
        }
        .ai-save-btn:hover:not(:disabled) { opacity: 0.9; }
        .ai-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// Manual Quiz Creator
// ─────────────────────────────────────────────
function QuizCreator({ onQuizCreated }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');   // FIX: renamed from 'course' to match backend
  const [customCourse, setCustomCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API}/courses/`);
        setCourses(res.data || []);
      } catch {
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  const effectiveSubject = subject === '__custom__' ? customCourse : subject;

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
  };

  const deleteQuestion = (index) => {
    if (questions.length === 1) {
      Swal.fire({ title: 'Cannot Delete', text: 'A quiz must have at least one question.', icon: 'warning', confirmButtonColor: '#3085d6' });
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIdx, oIdx, value) => {
    const updated = questions.map(q => ({ ...q, options: [...q.options] }));
    const prevAnswer = updated[qIdx].answer;
    const oldVal = updated[qIdx].options[oIdx];
    updated[qIdx].options[oIdx] = value;
    if (prevAnswer === oldVal) updated[qIdx].answer = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !startTime || !endTime) {
      Swal.fire({ title: 'Missing Information', text: 'Please fill all required fields', icon: 'warning', confirmButtonColor: '#3085d6' });
      return;
    }
    if (!effectiveSubject.trim()) {
      Swal.fire({ title: 'Missing Subject', text: 'Please select or enter a subject', icon: 'warning', confirmButtonColor: '#3085d6' });
      return;
    }
    if (questions.some(q => !q.question || q.options.some(opt => !opt) || !q.answer)) {
      Swal.fire({ title: 'Incomplete Questions', text: 'Please complete all questions with options and answers', icon: 'warning', confirmButtonColor: '#3085d6' });
      return;
    }
    const result = await Swal.fire({
      title: 'Create Quiz?',
      text: `Are you sure you want to create "${title}" with ${questions.length} question(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!',
    });
    if (!result.isConfirmed) return;
    try {
      setLoading(true);
      // FIX: send 'subject' not 'course' — backend requires subject field
      await axios.post(`${API}/quiz/admin/create`, {
        title,
        subject: effectiveSubject,   // FIX: was 'course', backend expects 'subject'
        questions,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      });
      Swal.fire({ title: 'Success!', text: 'Quiz has been created successfully', icon: 'success', confirmButtonColor: '#3085d6' });
      setTitle(''); setSubject(''); setCustomCourse('');
      setStartTime(''); setEndTime('');
      setQuestions([{ question: '', options: ['', '', '', ''], answer: '' }]);
      setError(null);
      onQuizCreated();
    } catch (err) {
      Swal.fire({ title: 'Error!', text: 'Failed to create quiz', icon: 'error', confirmButtonColor: '#3085d6' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-creator">
      <h2>Create New Quiz</h2>
      {error && <div className="error">{error}</div>}
      <form className="quiz-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Quiz Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter quiz title" required />
        </div>

        <div className="form-group">
          <label>Course / Subject</label>
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 8,
              border: '1.5px solid #d1d5db', background: '#fff',
              color: subject ? '#111' : '#999', fontSize: 14,
              marginBottom: subject === '__custom__' ? 10 : 0,
              cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="">— Select a course —</option>
            {courses.map((c, i) => {
              const val = typeof c === 'string' ? c : c.name || c.title || JSON.stringify(c);
              return <option key={i} value={val}>{val}</option>;
            })}
            <option value="__custom__">✏️ Enter manually…</option>
          </select>
          {subject === '__custom__' && (
            <input
              type="text" value={customCourse} onChange={e => setCustomCourse(e.target.value)}
              placeholder="e.g. Introduction to Computer Science" required style={{ marginTop: 0 }}
            />
          )}
        </div>

        <div className="form-group">
          <label>Start Time</label>
          <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>End Time</label>
          <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
        </div>

        <h3>Questions</h3>
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="question-block">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h4 style={{ margin: 0 }}>Question {qIdx + 1}</h4>
              <button
                type="button"
                onClick={() => deleteQuestion(qIdx)}
                style={{
                  background: '#fff0f0', color: '#e53e3e', border: '1px solid #fed7d7',
                  borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}
              >✕ Delete</button>
            </div>
            <input type="text" placeholder="Enter question" value={q.question} onChange={e => updateQuestion(qIdx, 'question', e.target.value)} required />
            <div className="options">
              {q.options.map((option, oIdx) => (
                <div key={oIdx} className="option">
                  <input type="text" placeholder={`Option ${oIdx + 1}`} value={option} onChange={e => updateOption(qIdx, oIdx, e.target.value)} required />
                  <input type="radio" name={`correct-${qIdx}`} checked={q.answer === option} onChange={() => updateQuestion(qIdx, 'answer', option)} disabled={!option} />
                  <label>Correct</label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="button" onClick={addQuestion}>Add Question</button>
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Quiz'}</button>
      </form>
    </div>
  );
}

export default AdminDashboard;