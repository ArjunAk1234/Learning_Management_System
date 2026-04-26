import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function StudentTutor() {
  const { studentId } = useAuth();
  const [course, setCourse] = useState('Javascript');
  const [sessions, setSessions] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (studentId) {
      loadSessions();
    }
  }, [studentId, course]);

  const loadSessions = async () => {
    try {
      const res = await api.get(`/ai/chats/${studentId}/${course}`);
      setSessions(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadChat = async (id) => {
    try {
      const res = await api.get(`/ai/chat/${id}`);
      setChatId(res.data.chatId);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/ai/chat/${course}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ question: userMsg, studentId, chatId })
      });
      
      const isSSE = res.headers.get('content-type')?.includes('text/event-stream');
      
      if (isSSE) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let aiMsg = '';
        setMessages(prev => [...prev, { role: 'ai', content: '' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (let line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr.trim() === '[DONE]') break;
              try {
                const data = JSON.parse(dataStr);
                if (data.token) aiMsg += data.token;
                if (data.chatId && !chatId) setChatId(data.chatId);
                setMessages(prev => {
                  const arr = [...prev];
                  arr[arr.length - 1] = { role: 'ai', content: aiMsg };
                  return arr;
                });
              } catch (e) {}
            }
          }
        }
      } else {
        const data = await res.json();
        setChatId(data.chatId);
        setMessages(prev => [...prev, { role: 'ai', content: data.answer }]);
      }
      loadSessions();
    } catch (err) {
      alert("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/4 p-4 overflow-y-auto border-r bg-white">
        <Link to="/student/dashboard" className="mb-4 text-blue-500 block">&larr; Dashboard</Link>
        <h2 className="mb-4 text-xl font-bold">Chat Sessions</h2>
        <div className="mb-4">
          <label className="text-sm font-semibold">Course:</label>
          <input type="text" className="w-full p-2 border rounded" value={course} onChange={e => {setCourse(e.target.value); setChatId(null); setMessages([]);}} />
        </div>
        <button onClick={() => {setChatId(null); setMessages([]);}} className="w-full p-2 mb-4 text-sm bg-gray-200 rounded hover:bg-gray-300">New Chat</button>
        <ul>
          {sessions.map(s => (
            <li key={s.chatId} className={`p-2 mb-2 cursor-pointer border rounded ${chatId === s.chatId ? 'bg-blue-100' : 'bg-gray-50'}`} onClick={() => loadChat(s.chatId)}>
              <span className="text-sm truncate block">{s.chatId.substring(0, 8)}...</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col w-3/4 bg-white">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">AI Tutor - {course}</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
          {messages.map((m, i) => (
            <div key={i} className={`mb-4 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded max-w-lg ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white border'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-gray-500 italic">AI is typing...</div>}
        </div>
        <form onSubmit={handleSend} className="p-4 border-t flex">
          <input type="text" className="flex-1 p-2 border rounded-l" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask a question..." disabled={loading} />
          <button type="submit" className="p-2 text-white bg-blue-600 rounded-r hover:bg-blue-700" disabled={loading}>Send</button>
        </form>
      </div>
    </div>
  );
}
