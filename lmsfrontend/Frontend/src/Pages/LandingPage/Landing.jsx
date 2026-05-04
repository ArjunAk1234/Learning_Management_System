
import React, { useState, useEffect } from "react";

// Data extracted directly from your SRS Document
const FEATURES = [
  {
    title: "AI Quiz Generation (FR15)",
    desc: "Teachers upload PDFs/Notes. Our LLM-powered pipeline (LangChain) automatically generates MCQs and short-answers with difficulty levels.",
  },
  {
    title: "24/7 AI Tutor (FR16)",
    desc: "A personalized chatbot for students using a RAG pipeline. It summarizes lectures and explains concepts based on course materials.",
  },
  {
    title: "Role-Based Access (RBAC)",
    desc: "Secure, purpose-built dashboards for Teachers and Students. Restrict access to grading and course management endpoints.",
  },
  {
    title: "Performance Analytics",
    desc: "Track student progress with grade trends, leaderboards, and per-assignment breakdowns using Chart.js/Recharts.",
  },
  {
    title: "Task Management (FR3)",
    desc: "Complete workflow: Create courses, upload resources (max 20MB), set deadlines, and manage student enrollments.",
  },
  {
    title: "Secure JWT Auth (FR2)",
    desc: "Stateless session management with signed JSON Web Tokens and Bcrypt password hashing for maximum security.",
  }
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: "#1a1a1a",
      backgroundColor: "#ffffff",
      margin: 0,
      padding: 0,
      lineHeight: "1.6"
    }}>

      {/* NAVIGATION */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "70px",
        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.9)" : "transparent",
        backdropFilter: isScrolled ? "blur(10px)" : "none",
        borderBottom: isScrolled ? "1px solid #eee" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 5%",
        zIndex: 1000,
        transition: "all 0.3s ease"
      }}>
        <div style={{ fontSize: "22px", fontWeight: "800", color: "#2563eb", letterSpacing: "-1px" }}>
          LMS<span style={{ color: "#1a1a1a" }}></span>
        </div>
        <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
          <a href="/login" style={{ textDecoration: "none", color: "#4b5563", fontWeight: "500", fontSize: "15px" }}>Login</a>
          <a href="/signup" style={{
            textDecoration: "none",
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "15px",
            boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)"
          }}>Get Started</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{
        padding: "180px 5% 100px",
        textAlign: "center",
        background: "linear-gradient(to bottom, #f8faff, #ffffff)"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: "900",
            lineHeight: "1.1",
            letterSpacing: "-0.04em",
            marginBottom: "25px",
            color: "#111827"
          }}>
            The AI-First Learning <br />
            <span style={{ color: "#2563eb" }}>Management System.</span>
          </h1>
          <p style={{
            fontSize: "20px",
            color: "#4b5563",
            maxWidth: "700px",
            margin: "0 auto 40px",
            lineHeight: "1.6"
          }}>
            Automate quiz generation, provide 24/7 AI tutoring, and manage courses with a modern, role-based MERN platform built for Amrita Computing.
          </p>
          <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
            <a href="/signup" style={{
              backgroundColor: "#111827", color: "#fff", padding: "16px 35px",
              borderRadius: "10px", textDecoration: "none", fontWeight: "600", fontSize: "16px"
            }}>Create Free Account</a>
            <a href="/login" style={{
              backgroundColor: "#fff", color: "#111827", padding: "16px 35px",
              borderRadius: "10px", textDecoration: "none", fontWeight: "600", fontSize: "16px",
              border: "1px solid #d1d5db"
            }}>Login Now</a>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION (Visible on Scroll) */}
      <section style={{ padding: "100px 5%", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "left", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "15px" }}>System Capabilities</h2>
            <p style={{ color: "#6b7280", fontSize: "18px" }}>Full-stack features designed for teachers and students.</p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px"
          }}>
            {FEATURES.map((feature, idx) => (
              <div key={idx} style={{
                padding: "40px",
                borderRadius: "20px",
                backgroundColor: "#f9fafb",
                border: "1px solid #f3f4f6",
                transition: "all 0.3s ease"
              }}>
                <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "15px", color: "#111827" }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: "16px", color: "#4b5563", lineHeight: "1.7" }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK SECTION */}
      <section style={{ padding: "80px 5%", backgroundColor: "#111827", color: "#fff" }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "40px"
        }}>
          <div style={{ flex: "1 1 500px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "20px" }}>Technical Architecture</h2>
            <p style={{ fontSize: "18px", color: "#9ca3af", marginBottom: "30px" }}>
              A robust 3-tier system: React (Frontend), Node/Express (API), and MongoDB (Database).
            </p>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {['MERN Stack', 'LangChain', 'OpenAI GPT-4', 'FAISS Vector Store'].map((tech) => (
                <span key={tech} style={{
                  backgroundColor: "#1f2937", padding: "8px 16px", borderRadius: "5px",
                  fontSize: "14px", border: "1px solid #374151"
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div style={{
            flex: "1 1 300px",
            borderLeft: "4px solid #2563eb",
            paddingLeft: "30px",
            fontFamily: "monospace",
            color: "#60a5fa"
          }}>
            <p>// SRS Specification v1.0</p>
            <p>Authentication: JWT + Bcrypt</p>
            <p>FileUpload: Multer (20MB Limit)</p>
            <p>API: RESTful Routes</p>
            <p>UI: Responsive React SPA</p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section style={{ padding: "120px 5%", textAlign: "center" }}>
        <h2 style={{ fontSize: "42px", fontWeight: "800", marginBottom: "20px" }}>Ready to Start Learning?</h2>
        <p style={{ fontSize: "19px", color: "#4b5563", marginBottom: "40px" }}>Join the next generation of AI-enabled education platforms.</p>
        <a href="/signup" style={{
          backgroundColor: "#2563eb", color: "#fff", padding: "20px 50px",
          borderRadius: "12px", textDecoration: "none", fontWeight: "700", fontSize: "18px",
          display: "inline-block"
        }}>Get Started for Free</a>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "60px 5%",
        borderTop: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <div>
          <div style={{ fontSize: "20px", fontWeight: "800", color: "#2563eb" }}>LMS</div>
          <div style={{ fontSize: "14px", color: "#9ca3af", marginTop: "5px" }}>© 2026 Amrita School of Computing</div>
        </div>
        <div style={{ display: "flex", gap: "30px" }}>
          <a href="/login" style={{ color: "#6b7280", textDecoration: "none", fontSize: "14px" }}>Login</a>
          <a href="/signup" style={{ color: "#6b7280", textDecoration: "none", fontSize: "14px" }}>Sign Up</a>
          <a href="#" style={{ color: "#6b7280", textDecoration: "none", fontSize: "14px" }}>Privacy</a>
        </div>
      </footer>

    </div>
  );
}