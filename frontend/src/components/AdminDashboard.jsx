import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tests");

  // Test states
  const [tests, setTests] = useState([]);
  const [testForm, setTestForm] = useState({
    title: "",
    description: "",
    total_duration_minutes: 60,
    subject: "",
  });

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

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (token && user?.role === "Admin") {
      fetchTests();
      fetchQuestions();
    }
  }, [token, user]);

  const fetchTests = async () => {
    try {
      const res = await axios.get("/api/tests", config);
      setTests(res.data.tests);
    } catch (error) {
      console.error("Failed to fetch tests", error);
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

  const handleCreateTest = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/tests", testForm, config);
      alert("Test created successfully!");
      setTestForm({
        title: "",
        description: "",
        total_duration_minutes: 60,
        subject: "",
      });
      fetchTests();
    } catch (error) {
      alert(
        "Failed to create test: " +
        (error.response?.data?.message || "Server error"),
      );
    }
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

  if (user?.role !== "Admin") {
    return (
      <div className="p-8 text-center text-red-500 font-bold text-2xl mt-20">
        Unauthorized Access. Admin privileges required.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white p-4 md:p-8 pb-24 md:pb-8 noise-overlay mesh-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-purple-900/10 rounded-full blur-[100px] float-3d pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[25rem] h-[25rem] bg-pink-900/8 rounded-full blur-[80px] float-3d-reverse pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="hidden md:flex justify-end pt-2 mb-4" style={{ animation: 'slide-down-fade 0.5s ease-out both' }}>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn-3d flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl transition-all duration-300 text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>
        <div style={{ animation: 'slide-up-fade 0.5s ease-out both' }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
            Admin Control Panel
          </h1>
          <p className="text-gray-500 text-sm mb-6">Manage tests, questions, and platform settings</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-1" style={{ animation: 'slide-up-fade 0.5s ease-out 0.1s both' }}>
          <button
            onClick={() => setActiveTab("tests")}
            className={`btn-3d flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold transition-all text-sm ${activeTab === "tests" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"}`}
          >
            {" "}
            Manage Tests{" "}
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`btn-3d flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold transition-all text-sm ${activeTab === "questions" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"}`}
          >
            {" "}
            Manage Questions{" "}
          </button>
        </div>

        {activeTab === "tests" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ animation: 'slide-up-fade 0.5s ease-out 0.15s both' }}>
            <div className="glass-card p-5 rounded-2xl">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
                Create New Test
              </h2>
              <form onSubmit={handleCreateTest} className="space-y-4">
                <input
                  type="text"
                  placeholder="Test Title"
                  required
                  value={testForm.title}
                  onChange={(e) =>
                    setTestForm({ ...testForm, title: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:bg-white/[0.07]"
                />
                <input
                  type="text"
                  placeholder="Subject (e.g., Mathematics)"
                  required
                  value={testForm.subject}
                  onChange={(e) =>
                    setTestForm({ ...testForm, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:bg-white/[0.07]"
                />
                <textarea
                  placeholder="Description"
                  value={testForm.description}
                  onChange={(e) =>
                    setTestForm({ ...testForm, description: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:bg-white/[0.07]"
                  rows="3"
                />
                <div className="flex items-center space-x-3">
                  <label className="text-gray-400 text-sm flex-shrink-0">
                    Duration (mins):
                  </label>
                  <input
                    type="number"
                    required
                    value={testForm.total_duration_minutes}
                    onChange={(e) =>
                      setTestForm({
                        ...testForm,
                        total_duration_minutes: parseInt(e.target.value),
                      })
                    }
                    className="w-28 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 hover:bg-white/[0.07]"
                  />
                </div>
                <button className="btn-3d w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-xl transition-colors">
                  Create Test
                </button>
              </form>
            </div>

            <div className="glass-card p-5 rounded-2xl max-h-[500px] overflow-y-auto custom-scrollbar">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
                Existing Tests
              </h2>
              {tests.length === 0 ? (
                <p className="text-gray-500 text-sm">No tests created yet.</p>
              ) : (
                <ul className="space-y-3">
                  {tests.map((test, idx) => (
                    <li
                      key={test._id}
                      className="p-4 bg-white/[0.03] rounded-xl border border-white/5 flex justify-between items-center gap-3 hover:bg-white/[0.06] transition-all duration-300"
                      style={{ animation: `slide-up-fade 0.4s ease-out ${idx * 0.05}s both` }}
                    >
                      <div className="min-w-0">
                        <p className="font-bold truncate">{test.title}</p>
                        <p className="text-sm text-gray-400 truncate">
                          {test.subject} | {test.total_duration_minutes} mins
                        </p>
                      </div>
                      <span
                        className={`flex-shrink-0 px-3 py-1 text-xs font-bold rounded-full border ${test.is_active ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}`}
                      >
                        {test.is_active ? "Active" : "Draft"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {activeTab === "questions" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ animation: 'slide-up-fade 0.5s ease-out 0.15s both' }}>
            <div className="glass-card p-5 rounded-2xl">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-300">
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
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 hover:bg-white/[0.07]"
                  rows="3"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 hover:bg-white/[0.07]"
                  />
                  <input
                    type="text"
                    placeholder="Concept Tag"
                    required
                    value={questionForm.concept_tag}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        concept_tag: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 hover:bg-white/[0.07]"
                  />
                  <select
                    value={questionForm.difficulty}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        difficulty: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:ring-2 focus:ring-pink-500/50 transition-all duration-300"
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
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-green-400 font-bold focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
                  >
                    <option value="A">Correct: A</option>
                    <option value="B">Correct: B</option>
                    <option value="C">Correct: C</option>
                    <option value="D">Correct: D</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Options:</p>
                  {questionForm.options.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center space-x-2">
                      <span
                        className={`font-bold w-6 flex-shrink-0 ${opt.id === questionForm.correct_option ? "text-green-400" : "text-gray-400"}`}
                      >
                        {opt.id}.
                      </span>
                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-sm text-white transition-all duration-300 hover:bg-white/[0.07] ${opt.id === questionForm.correct_option ? "border-green-500/30 focus:ring-2 focus:ring-green-500/50" : "border-white/10 focus:ring-2 focus:ring-pink-500/50"}`}
                        placeholder={`Option ${opt.id}`}
                      />
                    </div>
                  ))}
                </div>

                <button className="btn-3d w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold py-3 rounded-xl mt-2">
                  {editQuestionId ? "Update Question" : "Create Question"}
                </button>
              </form>
            </div>

            <div className="glass-card p-5 rounded-2xl max-h-[700px] overflow-y-auto custom-scrollbar">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-300">
                Question Bank
              </h2>
              {questions.length === 0 ? (
                <p className="text-gray-500 text-sm">No questions in bank.</p>
              ) : (
                <ul className="space-y-4">
                  {questions.map((q, idx) => (
                    <li
                      key={q._id}
                      className={`p-4 bg-white/[0.03] rounded-xl border ${q.is_active ? "border-white/5" : "border-red-900/30 opacity-60"} hover:bg-white/[0.06] transition-all duration-300`}
                      style={{ animation: `slide-up-fade 0.4s ease-out ${idx * 0.04}s both` }}
                    >
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <p className="font-medium leading-snug text-sm">
                          {q.question_text}
                        </p>
                        <div className="flex space-x-1.5 flex-shrink-0">
                          <button
                            onClick={() => handleEditQuestion(q)}
                            className="btn-3d text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1.5 rounded-lg hover:bg-blue-500/20 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q._id)}
                            className="btn-3d text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1.5 rounded-lg hover:bg-red-500/20 transition"
                          >
                            Del
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 bg-white/[0.03] inline-block px-2 py-1 rounded mb-3 border border-white/5">
                        {q.subject} •{" "}
                        <span
                          className={
                            q.difficulty === "Hard"
                              ? "text-red-400"
                              : q.difficulty === "Medium"
                                ? "text-yellow-400"
                                : "text-green-400"
                          }
                        >
                          {q.difficulty}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-300">
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
      </div>
    </div>
  );
};

export default AdminDashboard;
