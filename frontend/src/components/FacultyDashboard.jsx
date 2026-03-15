import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const FacultyDashboard = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students");
  const [marks, setMarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Question states
  const [questions, setQuestions] = useState([]);
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    question_text: "",
    options: [
      { id: "A", text: "" },
      { id: "B", text: "" },
      { id: "C", text: "" },
      { id: "D", text: "" },
    ],
    correct_option: "A",
    subject: "",
    concept_tag: "",
    difficulty: "Medium",
  });

  // Bulk CSV Import states
  const [csvFile, setCsvFile] = useState(null);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvResult, setCsvResult] = useState(null);
  const csvInputRef = useRef(null);

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (token && user?.role === "Faculty") {
      fetchMarks();
      fetchQuestions();
    }
  }, [token, user]);

  const fetchMarks = async () => {
    try {
      const res = await axios.get("/api/faculty/students/marks", config);
      setMarks(res.data.marks);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch marks", error);
      setIsLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("/api/questions", config);
      setQuestions(res.data.questions);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "Question Text",
      "Option A",
      "Option B",
      "Option C",
      "Option D",
      "Correct Option",
      "Subject",
      "Concept Tag",
      "Difficulty",
    ];
    const exampleRow = [
      '"What is the time complexity of a binary search?"',
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)",
      "B",
      "Data Structures",
      "Searching",
      "Medium",
    ];
    const csvContent = [headers.join(","), exampleRow.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "question_import_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCsvUpload = async () => {
    if (!csvFile) return alert("Please select a CSV file first.");
    setCsvUploading(true);
    setCsvResult(null);
    const formData = new FormData();
    formData.append("file", csvFile);
    try {
      const res = await axios.post("/api/questions/bulk", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setCsvResult({
        success: true,
        message: res.data.message,
        errors: res.data.errors || [],
      });
      setCsvFile(null);
      if (csvInputRef.current) csvInputRef.current.value = "";
      fetchQuestions();
    } catch (err) {
      setCsvResult({
        success: false,
        message: err.response?.data?.message || "Upload failed.",
        errors: [],
      });
    } finally {
      setCsvUploading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (marks.length === 0) return alert("No data available to download.");

    const headers = [
      "Student Name",
      "Email",
      "Test Title",
      "Subject",
      "Score",
      "Accuracy %",
      "Date",
    ];
    const csvRows = [headers.join(",")];

    marks.forEach((mark) => {
      const date = new Date(mark.date).toLocaleDateString();
      const row = [
        `"${mark.studentName}"`,
        `"${mark.studentEmail}"`,
        `"${mark.testTitle}"`,
        `"${mark.subject}"`,
        mark.score,
        mark.accuracy,
        `"${date}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "students_marks.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      if (editQuestionId) {
        await axios.put(
          `/api/questions/${editQuestionId}`,
          questionForm,
          config,
        );
        alert("Question updated successfully!");
      } else {
        await axios.post("/api/questions", questionForm, config);
        alert("Question created successfully!");
      }
      setQuestionForm({
        question_text: "",
        options: [
          { id: "A", text: "" },
          { id: "B", text: "" },
          { id: "C", text: "" },
          { id: "D", text: "" },
        ],
        correct_option: "A",
        subject: "",
        concept_tag: "",
        difficulty: "Medium",
      });
      setEditQuestionId(null);
      fetchQuestions();
    } catch (error) {
      alert(
        "Failed to save question: " +
        (error.response?.data?.message || "Server error"),
      );
    }
  };

  const handleEditQuestion = (q) => {
    setQuestionForm({
      question_text: q.question_text,
      options: q.options,
      correct_option: q.correct_option,
      subject: q.subject,
      concept_tag: q.concept_tag,
      difficulty: q.difficulty,
    });
    setEditQuestionId(q._id);
    window.scrollTo(0, 0);
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      await axios.delete(`/api/questions/${id}`, config);
      alert("Question deleted successfully!");
      fetchQuestions();
    } catch (err) {
      alert("Failed to delete question");
    }
  };

  const handleOptionChange = (idx, value) => {
    const newOptions = [...questionForm.options];
    newOptions[idx].text = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  if (user?.role !== "Faculty") {
    return (
      <div className="p-8 text-center text-red-500 font-bold text-2xl mt-20">
        Unauthorized Access. Faculty privileges required.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white p-4 md:p-12 pb-24 md:pb-12 relative overflow-hidden noise-overlay mesh-gradient">
      {/* Animated Background */}
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-pink-900/12 rounded-full blur-[100px] float-3d pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[25rem] h-[25rem] bg-rose-900/8 rounded-full blur-[80px] float-3d-reverse pointer-events-none translate-y-1/2 -translate-x-1/4"></div>
      <div className="absolute top-1/2 left-1/2 w-[20rem] h-[20rem] bg-orange-900/5 rounded-full blur-[60px] pulse-glow pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

      {/* Floating Particles */}
      <div className="absolute top-[8%] right-[12%] w-2 h-2 bg-pink-400/25 rounded-full pointer-events-none" style={{ animation: 'particle-float-1 11s ease-in-out infinite' }}></div>
      <div className="absolute bottom-[15%] left-[8%] w-1.5 h-1.5 bg-rose-400/20 rounded-full pointer-events-none" style={{ animation: 'particle-float-2 14s ease-in-out infinite' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="hidden md:flex justify-end pt-2 mb-4" style={{ animation: 'slide-down-fade 0.5s ease-out both' }}>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn-3d flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl transition-all duration-300 text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8" style={{ animation: 'slide-up-fade 0.5s ease-out both' }}>
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-gray-400 mb-2">
              Faculty Control Center
            </h1>
            <p className="text-gray-400 text-sm">Class Performance & Question Bank</p>
          </div>
          {activeTab === "students" && (
            <div className="mt-4 md:mt-0" style={{ animation: 'slide-up-fade 0.5s ease-out 0.1s both' }}>
              <button
                onClick={handleDownloadCSV}
                className="btn-3d flex items-center space-x-2 bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 text-white px-6 py-2.5 rounded-xl font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                <span>Download Full Class Marks (CSV)</span>
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 border-b border-white/5 pb-2 overflow-x-auto" style={{ animation: 'slide-up-fade 0.5s ease-out 0.05s both' }}>
          {[
            { key: "students", label: "Class Performance" },
            { key: "questions", label: "Question Bank Manager" },
            { key: "import", label: "Bulk CSV Import" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 font-semibold transition-all duration-300 border-b-2 whitespace-nowrap flex-shrink-0 rounded-t-lg ${activeTab === tab.key ? "border-pink-500 text-pink-400 bg-pink-500/5" : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── CLASS PERFORMANCE TAB ─── */}
        {activeTab === "students" && (
          <div className="glass-card rounded-2xl shadow-xl overflow-hidden" style={{ animation: 'slide-up-fade 0.5s ease-out 0.1s both' }}>
            {isLoading ? (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                <p className="mt-4 text-gray-400 font-medium">
                  Loading class performance data...
                </p>
              </div>
            ) : marks.length === 0 ? (
              <div className="py-20 text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p className="text-lg">
                  No student assessment data available yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.03] text-gray-300 text-sm uppercase tracking-wider border-b border-white/5">
                      <th className="p-5 font-semibold">Student</th>
                      <th className="p-5 font-semibold">Assessment</th>
                      <th className="p-5 font-semibold">Subject</th>
                      <th className="p-5 font-semibold">Score</th>
                      <th className="p-5 font-semibold">Accuracy</th>
                      <th className="p-5 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {marks.map((mark, idx) => (
                      <tr
                        key={mark.attemptId}
                        className="hover:bg-white/[0.03] transition-all duration-300"
                        style={{ animation: `slide-up-fade 0.3s ease-out ${idx * 0.03}s both` }}
                      >
                        <td className="p-5">
                          <div className="font-medium text-gray-200">
                            {mark.studentName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {mark.studentEmail}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="max-w-[200px] truncate text-gray-300">
                            {mark.testTitle}
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="bg-white/5 text-gray-300 px-2.5 py-1 rounded-lg text-xs font-medium border border-white/10">
                            {mark.subject}
                          </span>
                        </td>
                        <td className="p-5 font-bold text-white">
                          {mark.score}
                        </td>
                        <td className="p-5">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-white/5 rounded-full h-1.5 overflow-hidden flex-shrink-0">
                              <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${mark.accuracy >= 70 ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]" : mark.accuracy >= 40 ? "bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.4)]" : "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]"}`}
                                style={{ width: `${mark.accuracy}%` }}
                              ></div>
                            </div>
                            <span
                              className={`text-sm font-semibold ${mark.accuracy >= 70 ? "text-green-400" : mark.accuracy >= 40 ? "text-yellow-400" : "text-red-400"}`}
                            >
                              {mark.accuracy.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="p-5 text-sm text-gray-400">
                          {new Date(mark.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── QUESTION BANK TAB ─── */}
        {activeTab === "questions" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ animation: 'slide-up-fade 0.5s ease-out 0.1s both' }}>
            <div className="glass-card p-6 rounded-2xl h-fit sticky top-6">
              <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-300">
                {editQuestionId ? "Edit Question" : "Create New Question"}
              </h2>
              <form onSubmit={handleSaveQuestion} className="space-y-4">
                <textarea
                  placeholder="Question Text"
                  required
                  value={questionForm.question_text}
                  onChange={(e) =>
                    setQuestionForm({
                      ...questionForm,
                      question_text: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 hover:bg-white/[0.07]"
                  rows="3"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Subject"
                    required
                    value={questionForm.subject}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        subject: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 hover:bg-white/[0.07]"
                  />
                  <input
                    type="text"
                    placeholder="Concept Tag (e.g., Algebra)"
                    required
                    value={questionForm.concept_tag}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        concept_tag: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 hover:bg-white/[0.07]"
                  />
                  <select
                    value={questionForm.difficulty}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        difficulty: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-pink-500/50 transition-all duration-300"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <select
                    value={questionForm.correct_option}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        correct_option: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-green-400 font-bold focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
                  >
                    <option value="A">Correct: A</option>
                    <option value="B">Correct: B</option>
                    <option value="C">Correct: C</option>
                    <option value="D">Correct: D</option>
                  </select>
                </div>

                <div className="space-y-2 mt-4">
                  <p className="text-sm text-gray-400">Options:</p>
                  {questionForm.options.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center space-x-2">
                      <span
                        className={`font-bold w-6 ${opt.id === questionForm.correct_option ? "text-green-400" : "text-gray-400"}`}
                      >
                        {opt.id}.
                      </span>
                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={(e) =>
                          handleOptionChange(idx, e.target.value)
                        }
                        className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border transition-all duration-300 hover:bg-white/[0.07] ${opt.id === questionForm.correct_option ? "border-green-500/30 focus:ring-2 focus:ring-green-500/50" : "border-white/10 focus:ring-2 focus:ring-pink-500/50"}`}
                        placeholder={`Option ${opt.id}`}
                      />
                    </div>
                  ))}
                </div>

                <button className="btn-3d w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold py-3 rounded-xl mt-6">
                  {editQuestionId ? "Update Question" : "Save New Question"}
                </button>
                {editQuestionId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditQuestionId(null);
                      setQuestionForm({
                        question_text: "",
                        options: [
                          { id: "A", text: "" },
                          { id: "B", text: "" },
                          { id: "C", text: "" },
                          { id: "D", text: "" },
                        ],
                        correct_option: "A",
                        subject: "",
                        concept_tag: "",
                        difficulty: "Medium",
                      });
                    }}
                    className="btn-3d w-full bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 rounded-xl mt-2 border border-white/10"
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            <div className="glass-card p-6 rounded-2xl max-h-[800px] overflow-y-auto custom-scrollbar">
              <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-300">
                Question Bank
              </h2>
              {questions.length === 0 ? (
                <p className="text-gray-500">No questions in bank.</p>
              ) : (
                <ul className="space-y-4">
                  {questions.map((q, idx) => (
                    <li
                      key={q._id}
                      className={`p-4 bg-white/[0.03] rounded-xl border ${q.is_active ? "border-white/5" : "border-red-900/30 opacity-60"} hover:bg-white/[0.06] transition-all duration-300`}
                      style={{ animation: `slide-up-fade 0.4s ease-out ${idx * 0.04}s both` }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-lg leading-snug">
                            {q.question_text}
                          </p>
                        </div>
                        <div className="flex space-x-2 flex-shrink-0 ml-4">
                          <button
                            onClick={() => handleEditQuestion(q)}
                            className="btn-3d text-sm bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q._id)}
                            className="btn-3d text-sm bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs text-gray-400 bg-white/[0.03] px-2 py-1 rounded-lg border border-white/5">
                          {q.subject}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-lg border ${q.difficulty === "Hard"
                            ? "text-red-400 bg-red-500/10 border-red-500/20"
                            : q.difficulty === "Easy"
                              ? "text-green-400 bg-green-500/10 border-green-500/20"
                              : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                            }`}
                        >
                          {q.difficulty === "Hard"
                            ? "🔴"
                            : q.difficulty === "Easy"
                              ? "🟢"
                              : "🟡"}{" "}
                          {q.difficulty}
                        </span>
                        <span className="text-xs text-gray-400 bg-white/[0.03] px-2 py-1 rounded-lg border border-white/5">
                          {q.concept_tag}
                        </span>
                        {q.times_attempted > 0 && (
                          <span className="text-xs text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/15">
                            📊 {q.historical_accuracy?.toFixed(0)}% success rate
                            ({q.times_attempted} attempts)
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                        {q.options.map((opt) => (
                          <div
                            key={opt.id}
                            className={`p-1 pl-2 border-l-2 ${opt.id === q.correct_option ? "border-green-500 text-green-400 font-semibold" : "border-white/10"}`}
                          >
                            {opt.id}. {opt.text}
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* ─── BULK CSV IMPORT TAB ─── */}
        {activeTab === "import" && (
          <div className="max-w-3xl mx-auto space-y-6" style={{ animation: 'slide-up-fade 0.5s ease-out 0.1s both' }}>
            {/* Info Banner */}
            <div className="glass-card rounded-2xl p-6" style={{ borderColor: 'rgba(99, 102, 241, 0.2)', animation: 'slide-up-fade 0.5s ease-out 0.15s both' }}>
              <h2 className="text-xl font-bold text-indigo-300 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                CSV Format Guide
              </h2>
              <p className="text-gray-300 text-sm mb-3">
                Your CSV must have these exact column headers (case-sensitive):
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {[
                  "Question Text",
                  "Option A",
                  "Option B",
                  "Option C",
                  "Option D",
                  "Correct Option",
                  "Subject",
                  "Concept Tag",
                  "Difficulty",
                ].map((h, i) => (
                  <span
                    key={h}
                    className="bg-white/[0.03] text-pink-300 px-2 py-1.5 rounded-lg border border-white/5"
                    style={{ animation: `slide-up-fade 0.3s ease-out ${0.2 + i * 0.03}s both` }}
                  >
                    {h}
                  </span>
                ))}
              </div>
              <p className="text-gray-400 text-xs mt-3">
                • <strong className="text-gray-200">Correct Option</strong>:
                must be A, B, C, or D &nbsp;•&nbsp;{" "}
                <strong className="text-gray-200">Difficulty</strong>: Easy /
                Medium / Hard (defaults to Medium if blank)
              </p>
            </div>

            {/* Template Download */}
            <button
              onClick={handleDownloadTemplate}
              className="btn-3d w-full flex items-center justify-center gap-3 bg-white/[0.03] hover:bg-white/[0.06] border border-dashed border-white/10 hover:border-pink-500/40 text-gray-300 hover:text-white px-6 py-4 rounded-xl font-medium"
              style={{ animation: 'slide-up-fade 0.5s ease-out 0.25s both' }}
            >
              <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download CSV Template (.csv)
            </button>

            {/* Upload Card */}
            <div className="glass-card rounded-2xl p-8 shadow-xl" style={{ animation: 'slide-up-fade 0.5s ease-out 0.3s both' }}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="bg-pink-500/15 p-2 rounded-xl border border-pink-500/25 backdrop-blur-sm">
                  <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12"></path>
                  </svg>
                </span>
                Upload Question CSV
              </h2>

              {/* File Drop Zone */}
              <label
                htmlFor="csv-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 hover:border-pink-500/40 rounded-xl cursor-pointer bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 group"
              >
                <svg className="w-12 h-12 text-gray-500 group-hover:text-pink-400 transition-all duration-300 mb-3 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="text-gray-400 group-hover:text-gray-200 font-medium transition-colors">
                  {csvFile ? (
                    <span className="text-pink-300 font-bold">
                      {csvFile.name}
                    </span>
                  ) : (
                    "Click to choose a .csv file"
                  )}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Max 5MB recommended
                </p>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  ref={csvInputRef}
                  className="hidden"
                  onChange={(e) => {
                    setCsvFile(e.target.files[0]);
                    setCsvResult(null);
                  }}
                />
              </label>

              <button
                onClick={handleCsvUpload}
                disabled={!csvFile || csvUploading}
                className="btn-3d mt-6 w-full py-3.5 bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none text-white font-bold rounded-xl flex items-center justify-center gap-2"
              >
                {csvUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>{" "}
                    Importing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12"></path>
                    </svg>{" "}
                    Import Questions
                  </>
                )}
              </button>

              {/* Result Banner */}
              {csvResult && (
                <div
                  className={`mt-5 rounded-xl p-5 border backdrop-blur-sm ${csvResult.success ? "bg-green-900/15 border-green-500/20" : "bg-red-900/15 border-red-500/20"}`}
                  style={{ animation: 'slide-up-fade 0.3s ease-out' }}
                >
                  <p
                    className={`font-bold mb-2 ${csvResult.success ? "text-green-400" : "text-red-400"}`}
                  >
                    {csvResult.success ? "✅" : "❌"} {csvResult.message}
                  </p>
                  {csvResult.errors?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-yellow-400 text-sm font-semibold mb-2">
                        ⚠️ Row Errors ({csvResult.errors.length}):
                      </p>
                      <ul className="space-y-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                        {csvResult.errors.map((err, i) => (
                          <li
                            key={i}
                            className="text-xs text-gray-400 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5"
                          >
                            {err}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
