import { useState, useRef, useEffect } from "react";
import './chat.css';
const API_BASE = "http://localhost:8006";

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(date) {
    return new Date(date).toLocaleString("en-US", {
        month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function fmtTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit",
    });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Spinner({ size = 16 }) {
    return (
        <span style={{
            display: "inline-block", width: size, height: size,
            border: `2px solid rgba(255,255,255,0.3)`,
            borderTop: `2px solid #fff`,
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
        }} />
    );
}

function TypingDots() {
    return (
        <div style={{ display: "flex", gap: 4, padding: "12px 16px", alignItems: "center" }}>
            {[0, 1, 2].map(i => (
                <span key={i} style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "#f59e0b",
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
            ))}
        </div>
    );
}

function Message({ msg }) {
    const isUser = msg.role === "user";
    return (
        <div style={{
            display: "flex",
            justifyContent: isUser ? "flex-end" : "flex-start",
            marginBottom: 16,
            animation: "fadeSlideUp 0.3s ease",
        }}>
            {!isUser && (
                <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "linear-gradient(135deg, #1e3a5f 0%, #f59e0b 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, marginRight: 10, flexShrink: 0, marginTop: 2,
                    boxShadow: "0 2px 8px rgba(245,158,11,0.3)",
                }}>🤖</div>
            )}
            <div style={{ maxWidth: "72%" }}>
                <div style={{
                    padding: "11px 16px",
                    borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: isUser
                        ? "linear-gradient(135deg, #1e3a5f 0%, #2d4f7a 100%)"
                        : "#ffffff",
                    color: isUser ? "#fff" : "#1a2a3a",
                    fontSize: 14,
                    lineHeight: 1.6,
                    boxShadow: isUser
                        ? "0 3px 12px rgba(30,58,95,0.25)"
                        : "0 3px 12px rgba(0,0,0,0.07)",
                    border: isUser ? "none" : "1px solid #e8edf3",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                }}>
                    {msg.content}
                </div>
                <div style={{
                    fontSize: 11, color: "#9ca3af", marginTop: 4,
                    textAlign: isUser ? "right" : "left",
                    paddingLeft: isUser ? 0 : 4,
                }}>
                    {msg.timestamp ? fmtTime(msg.timestamp) : ""}
                </div>
            </div>
            {isUser && (
                <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, marginLeft: 10, flexShrink: 0, marginTop: 2,
                    boxShadow: "0 2px 8px rgba(245,158,11,0.3)",
                }}>👤</div>
            )}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Chat({ studentId }) {
    // State
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [chatList, setChatList] = useState([]);
    const [activeChat, setActiveChat] = useState(null);   // { chatId, messages[] }
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [sideLoading, setSideLoading] = useState(false);

    // PDF / resource panel
    const [showUploadPanel, setShowUploadPanel] = useState(false);
    const [courseResources, setCourseResources] = useState([]);
    const [selectedResource, setSelectedResource] = useState(null); // filename string
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(""); // "uploading" | "done" | "error"
    const [resourcesLoading, setResourcesLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeChat?.messages, loading]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
        }
    }, [question]);

    // Load courses on mount
    useEffect(() => {
        fetch(`${API_BASE}/courses/`)
            .then(r => r.json())
            .then(data => setCourses(Array.isArray(data) ? data : []))
            .catch(() => setCourses([]));
    }, []);

    // Load chats when course changes
    useEffect(() => {
        if (!selectedCourse) return;
        setSideLoading(true);
        setActiveChat(null);
        fetch(`${API_BASE}/ai/chats/${studentId}/${encodeURIComponent(selectedCourse.name)}`)
            .then(r => r.json())
            .then(data => setChatList(Array.isArray(data) ? data : []))
            .catch(() => setChatList([]))
            .finally(() => setSideLoading(false));
    }, [selectedCourse]);

    async function loadChat(chatId) {
        const res = await fetch(`${API_BASE}/ai/chat/${chatId}`);
        const data = await res.json();
        setActiveChat({ chatId, messages: data.messages || [] });
    }

    async function startNewChat() {
        setActiveChat({ chatId: null, messages: [] });
        setShowUploadPanel(false);
        setSelectedResource(null);
        setUploadFile(null);
        setUploadStatus("");
    }

    async function loadCourseResources() {
        if (!selectedCourse) return;
        setResourcesLoading(true);
        try {
            const res = await fetch(`${API_BASE}/courses/${encodeURIComponent(selectedCourse.name)}/resources`);
            const data = await res.json();
            setCourseResources(data.resources || []);
        } catch {
            setCourseResources([]);
        } finally {
            setResourcesLoading(false);
        }
    }

    function openUploadPanel() {
        setShowUploadPanel(true);
        loadCourseResources();
    }

    // async function embedSelectedResource() {
    //     if (!selectedResource || !selectedCourse) return;
    //     setUploadStatus("uploading");
    //     try {
    //         // Fetch the resource file from the server, then re-upload to /ai/upload
    //         const fileRes = await fetch(`${API_BASE}/courses/${encodeURIComponent(selectedCourse.name)}/resource/${encodeURIComponent(selectedResource)}`);
    //         const blob = await fileRes.blob();
    //         const fd = new FormData();
    //         fd.append("pdf", blob, selectedResource);
    //         await fetch(`${API_BASE}/ai/upload/${encodeURIComponent(selectedCourse.name)}`, {
    //             method: "POST", body: fd,
    //         });
    //         setUploadStatus("done");
    //     } catch {
    //         setUploadStatus("error");
    //     }
    // }
    async function embedSelectedResource() {
        if (!selectedResource || !selectedCourse) return;
        setUploadStatus("uploading");
        try {
            const fileRes = await fetch(
                `${API_BASE}/uploads/courses/${encodeURIComponent(selectedCourse.name)}/resources/${encodeURIComponent(selectedResource)}`
            );
            const blob = await fileRes.blob();
            const fd = new FormData();
            fd.append("pdf", blob, selectedResource);
            await fetch(`${API_BASE}/ai/upload/${encodeURIComponent(selectedCourse.name)}`, {
                method: "POST", body: fd,
            });
            setUploadStatus("done");
        } catch {
            setUploadStatus("error");
        }
    }

    async function uploadLocalPdf() {
        if (!uploadFile || !selectedCourse) return;
        setUploadStatus("uploading");
        const fd = new FormData();
        fd.append("pdf", uploadFile);
        try {
            await fetch(`${API_BASE}/ai/upload/${encodeURIComponent(selectedCourse.name)}`, {
                method: "POST", body: fd,
            });
            setUploadStatus("done");
        } catch {
            setUploadStatus("error");
        }
    }

    async function sendMessage() {
        if (!question.trim() || !selectedCourse) return;
        const q = question.trim();
        setQuestion("");
        setLoading(true);

        const newMsg = { role: "user", content: q, timestamp: new Date() };
        setActiveChat(prev => ({
            chatId: prev?.chatId || null,
            messages: [...(prev?.messages || []), newMsg],
        }));

        try {
            const res = await fetch(
                `${API_BASE}/ai/chat/${encodeURIComponent(selectedCourse.name)}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        question: q,
                        studentId,
                        chatId: activeChat?.chatId || undefined,
                    }),
                }
            );
            const data = await res.json();
            const aiMsg = { role: "ai", content: data.answer, timestamp: new Date() };

            setActiveChat(prev => ({
                chatId: data.chatId,
                messages: [...(prev?.messages || []), aiMsg],
            }));

            // Refresh sidebar list
            const chatsRes = await fetch(`${API_BASE}/ai/chats/${studentId}/${encodeURIComponent(selectedCourse.name)}`);
            const chats = await chatsRes.json();
            setChatList(Array.isArray(chats) ? chats : []);
        } catch {
            setActiveChat(prev => ({
                ...prev,
                messages: [...(prev?.messages || []), {
                    role: "ai",
                    content: "⚠️ Something went wrong. Please try again.",
                    timestamp: new Date(),
                }],
            }));
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    // ── Render ──────────────────────────────────────────────────────────────────

    // const styles = {
    //     wrapper: {
    //         fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    //         height: "100%",
    //         display: "flex",
    //         flexDirection: "column",
    //         background: "transparent",
    //         color: "#1a2a3a",
    //     },
    // };

    const styles = {

        wrapper: {
            fontFamily: "'Nunito', 'Segoe UI', sans-serif",

            width: "80vw",              // same as admin
            margin: "2rem auto",        // center horizontally
            minHeight: "90vh",

            display: "flex",
            flexDirection: "column",

            backgroundColor: "rgba(255,255,255,0.95)",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.85)",

            padding: "0px",             // important
            overflow: "hidden",
        },
    };
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce {
          0%,80%,100% { transform: translateY(0); opacity:0.4; }
          40% { transform: translateY(-6px); opacity:1; }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity:0; transform:translateX(20px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes pulse {
          0%,100% { opacity:1; } 50% { opacity:0.5; }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

        .chat-item:hover { background: rgba(30,58,95,0.06) !important; }
        .course-opt:hover { background: rgba(245,158,11,0.08) !important; }
        .send-btn:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 4px 16px rgba(245,158,11,0.45) !important; }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .attach-btn:hover { background: rgba(30,58,95,0.08) !important; }
        .new-chat-btn:hover { background: linear-gradient(135deg, #1e3a5f 0%, #2d5f8a 100%) !important; }
        .resource-item:hover { border-color: #f59e0b !important; background: rgba(245,158,11,0.04) !important; }
        .resource-item.selected { border-color: #f59e0b !important; background: rgba(245,158,11,0.08) !important; }
        .close-panel:hover { background: rgba(0,0,0,0.08) !important; }
        textarea:focus { outline: none; }
      `}</style>

            <div style={styles.wrapper}>
                {/* ── Top bar: course selector ── */}
                <div style={{
                    padding: "14px 20px",
                    borderBottom: "1px solid #e8edf3",
                    background: "#fff",
                    display: "flex", alignItems: "center", gap: 12,
                    boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: "linear-gradient(135deg, #1e3a5f 0%, #f59e0b 100%)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, flexShrink: 0,
                    }}>🎓</div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: 17, color: "#1e3a5f", lineHeight: 1 }}>
                            AI Tutor
                        </div>
                        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                            Powered by course materials
                        </div>
                    </div>

                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Course:</label>
                        <select
                            value={selectedCourse?.name || ""}
                            onChange={e => {
                                const c = courses.find(c => c.name === e.target.value) || null;
                                setSelectedCourse(c);
                            }}
                            style={{
                                padding: "7px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                                border: "1.5px solid #e8edf3", background: "#f9fafb", color: "#1e3a5f",
                                cursor: "pointer", outline: "none", fontFamily: "inherit",
                            }}
                        >
                            <option value="">— Select a course —</option>
                            {courses.map(c => (
                                <option key={c._id || c.name} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ── Body ── */}
                <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

                    {/* ── Sidebar: chat history ── */}
                    <div style={{
                        width: 240, flexShrink: 0,
                        borderRight: "1px solid #e8edf3",
                        background: "#f8fafc",
                        display: "flex", flexDirection: "column",
                        overflow: "hidden",
                    }}>
                        <div style={{ padding: "14px 12px 10px" }}>
                            <button
                                className="new-chat-btn"
                                onClick={startNewChat}
                                disabled={!selectedCourse}
                                style={{
                                    width: "100%", padding: "9px 0",
                                    background: selectedCourse
                                        ? "linear-gradient(135deg, #1e3a5f 0%, #2d4f7a 100%)"
                                        : "#e5e7eb",
                                    color: selectedCourse ? "#fff" : "#9ca3af",
                                    border: "none", borderRadius: 10, fontSize: 13,
                                    fontWeight: 700, cursor: selectedCourse ? "pointer" : "not-allowed",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                    transition: "all 0.2s", fontFamily: "inherit",
                                    boxShadow: selectedCourse ? "0 3px 10px rgba(30,58,95,0.2)" : "none",
                                }}
                            >
                                <span style={{ fontSize: 16 }}>✦</span> New Chat
                            </button>
                        </div>

                        <div style={{
                            padding: "4px 12px 6px",
                            fontSize: 10, fontWeight: 800, color: "#9ca3af",
                            textTransform: "uppercase", letterSpacing: "0.08em",
                        }}>
                            Recent Conversations
                        </div>

                        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 12px" }}>
                            {sideLoading ? (
                                <div style={{ padding: 16, textAlign: "center" }}>
                                    <div style={{ fontSize: 12, color: "#9ca3af", animation: "pulse 1.5s infinite" }}>
                                        Loading chats…
                                    </div>
                                </div>
                            ) : !selectedCourse ? (
                                <div style={{
                                    padding: "24px 12px", textAlign: "center",
                                    fontSize: 12, color: "#c0c9d4", lineHeight: 1.6,
                                }}>
                                    Select a course to see your chat history
                                </div>
                            ) : chatList.length === 0 ? (
                                <div style={{
                                    padding: "24px 12px", textAlign: "center",
                                    fontSize: 12, color: "#c0c9d4", lineHeight: 1.6,
                                }}>
                                    No previous chats.<br />Start a new conversation!
                                </div>
                            ) : (
                                chatList.map(chat => {
                                    const preview = chat.messages?.[0]?.content || "Chat session";
                                    const isActive = activeChat?.chatId === chat.chatId;
                                    return (
                                        <div
                                            key={chat.chatId}
                                            className="chat-item"
                                            onClick={() => loadChat(chat.chatId)}
                                            style={{
                                                padding: "9px 10px", borderRadius: 9, cursor: "pointer",
                                                marginBottom: 4,
                                                background: isActive ? "rgba(30,58,95,0.09)" : "transparent",
                                                border: isActive ? "1.5px solid rgba(30,58,95,0.15)" : "1.5px solid transparent",
                                                transition: "all 0.15s",
                                            }}
                                        >
                                            <div style={{
                                                fontSize: 12, fontWeight: 600, color: "#1e3a5f",
                                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                            }}>
                                                💬 {preview.slice(0, 32)}{preview.length > 32 ? "…" : ""}
                                            </div>
                                            <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>
                                                {fmt(chat.updatedAt)}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* ── Main chat area ── */}
                    <div style={{
                        flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
                        background: "#f4f7fb",
                        backgroundImage: `
              radial-gradient(circle at 15% 20%, rgba(245,158,11,0.04) 0%, transparent 50%),
              radial-gradient(circle at 85% 80%, rgba(30,58,95,0.04) 0%, transparent 50%)
            `,
                    }}>

                        {/* Messages area */}
                        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px" }}>
                            {!selectedCourse ? (
                                <div style={{
                                    height: "100%", display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center", gap: 14,
                                }}>
                                    <div style={{ fontSize: 56 }}>🎓</div>
                                    <div style={{ fontWeight: 800, fontSize: 20, color: "#1e3a5f" }}>
                                        Welcome to AI Tutor
                                    </div>
                                    <div style={{ fontSize: 14, color: "#9ca3af", textAlign: "center", maxWidth: 300 }}>
                                        Select a course from the top to start chatting with your AI tutor.
                                    </div>
                                </div>
                            ) : !activeChat ? (
                                <div style={{
                                    height: "100%", display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center", gap: 14,
                                }}>
                                    <div style={{
                                        width: 70, height: 70, borderRadius: "50%",
                                        background: "linear-gradient(135deg, #1e3a5f 0%, #f59e0b 100%)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 30, boxShadow: "0 8px 24px rgba(245,158,11,0.25)",
                                    }}>🤖</div>
                                    <div style={{ fontWeight: 800, fontSize: 20, color: "#1e3a5f" }}>
                                        {selectedCourse.name}
                                    </div>
                                    <div style={{ fontSize: 14, color: "#9ca3af", textAlign: "center", maxWidth: 320, lineHeight: 1.6 }}>
                                        Ask anything about your course material. You can also upload a PDF to add more context.
                                    </div>
                                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 4 }}>
                                        {["Explain key concepts", "Summarize this topic", "Quiz me!", "Give me examples"].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => {
                                                    setActiveChat({ chatId: null, messages: [] });
                                                    setQuestion(s);
                                                }}
                                                style={{
                                                    padding: "7px 14px", borderRadius: 20,
                                                    border: "1.5px solid #e8edf3", background: "#fff",
                                                    fontSize: 12, fontWeight: 600, color: "#1e3a5f",
                                                    cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                                                }}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {activeChat.messages.length === 0 && (
                                        <div style={{ textAlign: "center", color: "#c0c9d4", fontSize: 13, padding: "40px 0" }}>
                                            Start the conversation below ↓
                                        </div>
                                    )}
                                    {activeChat.messages.map((msg, i) => (
                                        <Message key={i} msg={msg} />
                                    ))}
                                    {loading && (
                                        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
                                            <div style={{
                                                width: 34, height: 34, borderRadius: "50%",
                                                background: "linear-gradient(135deg, #1e3a5f 0%, #f59e0b 100%)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 14, marginRight: 10, flexShrink: 0,
                                            }}>🤖</div>
                                            <div style={{
                                                background: "#fff", borderRadius: "18px 18px 18px 4px",
                                                border: "1px solid #e8edf3", boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
                                                animation: "fadeSlideUp 0.3s ease",
                                            }}>
                                                <TypingDots />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Upload panel */}
                        {showUploadPanel && selectedCourse && (
                            <div style={{
                                margin: "0 20px 0",
                                background: "#fff",
                                borderRadius: "12px 12px 0 0",
                                border: "1.5px solid #e8edf3",
                                borderBottom: "none",
                                padding: "16px 18px",
                                animation: "slideInRight 0.25s ease",
                                boxShadow: "0 -4px 16px rgba(0,0,0,0.05)",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                                    <div style={{ fontWeight: 800, fontSize: 14, color: "#1e3a5f" }}>
                                        📎 Add Context to Chat
                                    </div>
                                    <button
                                        className="close-panel"
                                        onClick={() => { setShowUploadPanel(false); setUploadStatus(""); setSelectedResource(null); setUploadFile(null); }}
                                        style={{
                                            width: 26, height: 26, borderRadius: 6, border: "none",
                                            background: "transparent", cursor: "pointer", fontSize: 15,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            color: "#9ca3af", transition: "background 0.15s",
                                        }}
                                    >✕</button>
                                </div>

                                <div style={{ display: "flex", gap: 16 }}>
                                    {/* Course resources */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                                            From Course Resources
                                        </div>
                                        <div style={{ maxHeight: 130, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5 }}>
                                            {resourcesLoading ? (
                                                <div style={{ fontSize: 12, color: "#9ca3af", padding: "8px 0", animation: "pulse 1.5s infinite" }}>Loading…</div>
                                            ) : courseResources.filter(r => r.endsWith(".pdf")).length === 0 ? (
                                                <div style={{ fontSize: 12, color: "#c0c9d4", padding: "8px 0" }}>No PDFs in course resources</div>
                                            ) : (
                                                courseResources.filter(r => r.endsWith(".pdf")).map(r => (
                                                    <div
                                                        key={r}
                                                        className={`resource-item${selectedResource === r ? " selected" : ""}`}
                                                        onClick={() => setSelectedResource(r === selectedResource ? null : r)}
                                                        style={{
                                                            padding: "7px 10px", borderRadius: 8, cursor: "pointer",
                                                            border: "1.5px solid #e8edf3", fontSize: 12, fontWeight: 600,
                                                            color: "#1e3a5f", transition: "all 0.15s", background: "#f9fafb",
                                                            display: "flex", alignItems: "center", gap: 6,
                                                        }}
                                                    >
                                                        <span>📄</span>
                                                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        {selectedResource && (
                                            <button
                                                onClick={embedSelectedResource}
                                                disabled={uploadStatus === "uploading"}
                                                style={{
                                                    marginTop: 8, padding: "7px 14px",
                                                    background: "linear-gradient(135deg, #1e3a5f 0%, #2d4f7a 100%)",
                                                    color: "#fff", border: "none", borderRadius: 8, fontSize: 12,
                                                    fontWeight: 700, cursor: "pointer", display: "flex",
                                                    alignItems: "center", gap: 6, fontFamily: "inherit",
                                                }}
                                            >
                                                {uploadStatus === "uploading" ? <><Spinner size={12} /> Embedding…</> : "Embed Selected"}
                                            </button>
                                        )}
                                    </div>

                                    <div style={{ width: 1, background: "#e8edf3", alignSelf: "stretch" }} />

                                    {/* Local PDF upload */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                                            Upload from Device
                                        </div>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            style={{
                                                border: "2px dashed #d1d5db", borderRadius: 10,
                                                padding: "18px", textAlign: "center", cursor: "pointer",
                                                background: "#f9fafb", transition: "border-color 0.15s",
                                            }}
                                        >
                                            <div style={{ fontSize: 22, marginBottom: 4 }}>📁</div>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>
                                                {uploadFile ? uploadFile.name : "Click to browse PDF"}
                                            </div>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf"
                                            style={{ display: "none" }}
                                            onChange={e => { setUploadFile(e.target.files[0] || null); setUploadStatus(""); }}
                                        />
                                        {uploadFile && (
                                            <button
                                                onClick={uploadLocalPdf}
                                                disabled={uploadStatus === "uploading"}
                                                style={{
                                                    marginTop: 8, padding: "7px 14px",
                                                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                                    color: "#fff", border: "none", borderRadius: 8, fontSize: 12,
                                                    fontWeight: 700, cursor: "pointer", display: "flex",
                                                    alignItems: "center", gap: 6, fontFamily: "inherit",
                                                }}
                                            >
                                                {uploadStatus === "uploading" ? <><Spinner size={12} /> Uploading…</> : "Upload & Embed"}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Status messages */}
                                {uploadStatus === "done" && (
                                    <div style={{
                                        marginTop: 10, padding: "8px 12px", borderRadius: 8,
                                        background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
                                        fontSize: 12, color: "#059669", fontWeight: 600,
                                    }}>
                                        ✓ Embedded successfully! The AI can now use this material.
                                    </div>
                                )}
                                {uploadStatus === "error" && (
                                    <div style={{
                                        marginTop: 10, padding: "8px 12px", borderRadius: 8,
                                        background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                                        fontSize: 12, color: "#dc2626", fontWeight: 600,
                                    }}>
                                        ✗ Failed to embed. Please try again.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Input bar ── */}
                        <div style={{
                            padding: "12px 20px 16px",
                            background: "#fff",
                            borderTop: "1px solid #e8edf3",
                            boxShadow: "0 -2px 12px rgba(0,0,0,0.04)",
                        }}>
                            <div style={{
                                display: "flex", alignItems: "flex-end", gap: 8,
                                background: "#f4f7fb",
                                border: "1.5px solid #e2e8f0",
                                borderRadius: 16, padding: "6px 6px 6px 14px",
                                transition: "border-color 0.2s",
                            }}>
                                {/* Attach PDF button */}
                                <button
                                    className="attach-btn"
                                    onClick={() => selectedCourse && openUploadPanel()}
                                    title="Add PDF context"
                                    style={{
                                        width: 36, height: 36, borderRadius: 10, border: "none",
                                        background: showUploadPanel ? "rgba(245,158,11,0.12)" : "transparent",
                                        cursor: selectedCourse ? "pointer" : "not-allowed",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 18, flexShrink: 0, transition: "background 0.15s",
                                        color: showUploadPanel ? "#f59e0b" : "#9ca3af",
                                    }}
                                >
                                    📎
                                </button>

                                <textarea
                                    ref={textareaRef}
                                    value={question}
                                    onChange={e => setQuestion(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={
                                        !selectedCourse
                                            ? "Select a course to start chatting…"
                                            : !activeChat
                                                ? "Start a new chat or pick a previous one…"
                                                : "Ask your AI tutor anything… (Enter to send)"
                                    }
                                    disabled={!selectedCourse || !activeChat}
                                    rows={1}
                                    style={{
                                        flex: 1, border: "none", background: "transparent",
                                        fontSize: 14, color: "#1a2a3a", resize: "none",
                                        lineHeight: 1.5, padding: "7px 0",
                                        fontFamily: "inherit", minHeight: 36, maxHeight: 120,
                                    }}
                                />

                                <button
                                    className="send-btn"
                                    onClick={sendMessage}
                                    disabled={!question.trim() || !selectedCourse || !activeChat || loading}
                                    style={{
                                        width: 40, height: 40, borderRadius: 12,
                                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                        border: "none", cursor: "pointer", flexShrink: 0,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        boxShadow: "0 3px 10px rgba(245,158,11,0.35)",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    {loading ? <Spinner size={16} /> : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="22" y1="2" x2="11" y2="13" />
                                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <div style={{ textAlign: "center", marginTop: 7, fontSize: 10, color: "#c0c9d4" }}>
                                Answers are based on course materials · Shift+Enter for new line
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}