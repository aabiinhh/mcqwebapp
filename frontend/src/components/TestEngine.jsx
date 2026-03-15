import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useServerTimer from "../hooks/useServerTimer";
import { useAuth } from "../context/AuthContext";

const TestEngine = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  // UI State
  const [testStarted, setTestStarted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Core Logic State
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // Server Sync States
  const [serverStartTime, setServerStartTime] = useState(null);
  const [totalDurationMinutes, setTotalDurationMinutes] = useState(60);

  const { formattedTime, isExpired } = useServerTimer(
    serverStartTime,
    totalDurationMinutes,
  );
  const config = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token],
  );

  useEffect(() => {
    setTestStarted(false);
    setAttemptId(null);
    setTestCompleted(false);
    setIsLocked(false);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers({});
    setServerStartTime(null);
    setTestResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  const handleFinishTest = useCallback(async () => {
    setIsLocked(true);
    try {
      await axios.post(
        `/api/tests/attempt/${attemptId}/sync`,
        { answers },
        config,
      );
      const res = await axios.post(
        `/api/tests/attempt/${attemptId}/finish`,
        {},
        config,
      );

      localStorage.removeItem(`test_attempt_${attemptId}`);
      setTestResult(res.data);
      setTestCompleted(true);
    } catch (err) {
      console.error("Finish error", err);
      setTestCompleted(true);
    }
  }, [attemptId, answers, config]);

  const handleFinishClick = () => {
    if (
      window.confirm(
        "Are you sure you want to finish the test? You cannot change your answers after this.",
      )
    ) {
      handleFinishTest();
    }
  };

  useEffect(() => {
    if (isExpired && testStarted && !testCompleted) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      handleFinishTest();
    }
  }, [isExpired, testStarted, testCompleted, handleFinishTest]);

  const initializeTest = async () => {
    try {
      setIsLocked(true);
      const res = await axios.post(`/api/tests/${testId}/start`, {}, config);
      const aid = res.data.attempt_id;
      setAttemptId(aid);
      setServerStartTime(res.data.start_time);
      setTotalDurationMinutes(res.data.duration || 60);

      const qRes = await axios.get(
        `/api/tests/attempt/${aid}/questions`,
        config,
      );
      setQuestions(qRes.data.questions);

      const savedState = localStorage.getItem(`test_attempt_${aid}`);
      if (savedState) setAnswers(JSON.parse(savedState));
      else setAnswers({});

      setTestStarted(true);
      setIsLocked(false);
    } catch (err) {
      console.error("Initialization error", err);
      if (err.response?.data?.message?.includes("completed")) {
        setTestCompleted(true);
        setTestStarted(true);
        if (err.response.data.analytics) setTestResult(err.response.data);
      }
      setIsLocked(false);
    }
  };

  // Track Time Spent per question logically
  useEffect(() => {
    if (!testStarted || testCompleted || questions.length === 0) return;

    const qId = questions[currentIndex]?.id || questions[currentIndex]?._id;

    const interval = setInterval(() => {
      setAnswers((prev) => {
        const current = prev[qId] || { selectedOption: null, timeSpent: 0 };
        const updated = {
          ...prev,
          [qId]: { ...current, timeSpent: (current.timeSpent || 0) + 1 },
        };
        localStorage.setItem(
          `test_attempt_${attemptId}`,
          JSON.stringify(updated),
        );
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, testStarted, testCompleted, questions, attemptId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "hidden" &&
        !testCompleted &&
        attemptId
      ) {
        alert(
          "WARNING: Tab switching detected. This incident has been logged.",
        );
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [attemptId, testCompleted]);

  const handleOptionSelect = (qId, optionId) => {
    setAnswers((prev) => {
      const current = prev[qId] || { timeSpent: 0 };
      const updated = {
        ...prev,
        [qId]: { ...current, selectedOption: optionId },
      };
      localStorage.setItem(
        `test_attempt_${attemptId}`,
        JSON.stringify(updated),
      );
      return updated;
    });
  };

  const handleClearChoice = (qId) => {
    setAnswers((prev) => {
      const current = prev[qId] || { timeSpent: 0 };
      const updated = { ...prev, [qId]: { ...current, selectedOption: null } };
      localStorage.setItem(
        `test_attempt_${attemptId}`,
        JSON.stringify(updated),
      );
      return updated;
    });
  };

  // ─── INSTRUCTION SCREEN ───
  if (!testStarted && !testCompleted) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-6 pb-28 md:pb-6 relative overflow-hidden noise-overlay mesh-gradient">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-900/20 rounded-full blur-[80px] float-3d -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/15 rounded-full blur-[80px] float-3d-reverse translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/8 rounded-full blur-[60px] pulse-glow -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        {/* Floating Particles */}
        <div className="absolute top-[15%] left-[20%] w-2 h-2 bg-indigo-400/30 rounded-full pointer-events-none" style={{ animation: 'particle-float-1 10s ease-in-out infinite' }}></div>
        <div className="absolute bottom-[25%] right-[15%] w-1.5 h-1.5 bg-purple-400/25 rounded-full pointer-events-none" style={{ animation: 'particle-float-2 13s ease-in-out infinite' }}></div>

        <div className="perspective-container max-w-2xl w-full">
          <div className="glass-card gradient-border rounded-3xl shadow-2xl p-10 text-center relative z-10" style={{ animation: 'card-entrance 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
            <div style={{ animation: 'slide-up-fade 0.5s ease-out 0.2s both' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30" style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 mb-6 tracking-tight">
                Assessment Instructions
              </h1>
            </div>
            <div className="text-left space-y-4 text-gray-300 mb-10 glass-card p-6 rounded-xl" style={{ animation: 'slide-up-fade 0.5s ease-out 0.3s both' }}>
              <p className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-3 shadow-[0_0_6px_rgba(99,102,241,0.5)]"></span>
                <strong>Duration:</strong>&nbsp;Exactly 60 Minutes.
              </p>
              <p className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-3 shadow-[0_0_6px_rgba(99,102,241,0.5)]"></span>
                <strong>Auto-Submit:</strong>&nbsp;When the timer expires, the exam
                will automatically submit.
              </p>
              <p className="flex items-center text-green-400 font-medium mt-4">
                You can now freely navigate between questions, change your
                answers, and save your progress locally!
              </p>
            </div>

            <div style={{ animation: 'slide-up-fade 0.5s ease-out 0.4s both' }}>
              <button
                onClick={initializeTest}
                disabled={isLocked}
                className="btn-3d w-full py-4 px-8 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-xl disabled:opacity-50 disabled:transform-none"
              >
                {isLocked ? "Preparing Environment..." : "START ASSESSMENT NOW"}
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="mt-4 text-gray-400 hover:text-white transition-all duration-300 text-sm hover:underline decoration-gray-400/50 underline-offset-4"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS SCREEN ───
  if (testCompleted) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-6 pb-28 md:pb-6 noise-overlay mesh-gradient">
        <div className="glass-card gradient-border p-6 md:p-12 rounded-3xl shadow-2xl max-w-4xl w-full text-center relative" style={{ animation: 'scale-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
          <div className="w-20 h-20 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/25" style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}>
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight" style={{ animation: 'slide-up-fade 0.5s ease-out 0.2s both' }}>
            Exam Concluded
          </h2>
          {testResult?.analytics && (
            <div className="mt-6 mb-8 glass-card p-6 rounded-2xl text-left space-y-4" style={{ animation: 'slide-up-fade 0.5s ease-out 0.3s both' }}>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-gray-400 font-medium tracking-wide uppercase text-sm">
                  Exam Score
                </span>
                <div className="text-right">
                  <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    {testResult.analytics.score}
                  </span>
                  <span className="text-2xl font-bold text-gray-500">
                    {" "}
                    / {testResult.analytics.total_questions}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-gray-400 font-medium">Accuracy</span>
                <span className="text-xl font-bold text-green-400">
                  {testResult.analytics.accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
                    Mastery
                  </p>
                  <p
                    className={`font-bold ${testResult.analytics.readiness.includes("Exam-Ready") ? "text-green-400" : testResult.analytics.readiness.includes("Near") ? "text-yellow-400" : "text-red-400"}`}
                  >
                    {testResult.analytics.readiness}
                  </p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
                    Avg Time
                  </p>
                  <p className="font-bold text-indigo-400">
                    {testResult.analytics.breakdown?.avg_time?.toFixed(1) || 0}s{" "}
                    <span className="text-xs font-normal">/ Q</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          {testResult?.detailedResults &&
            testResult.detailedResults.length > 0 && (
              <div className="mt-12 text-left" style={{ animation: 'slide-up-fade 0.5s ease-out 0.4s both' }}>
                <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">
                  Detailed Review
                </h3>
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {testResult.detailedResults.map((result, idx) => {
                    const selectedText =
                      result.options.find(
                        (o) =>
                          o.id === result.selected_option ||
                          o._id === result.selected_option,
                      )?.text || "None / Not Answered";
                    const correctText =
                      result.options.find(
                        (o) =>
                          o.id === result.correct_option ||
                          o._id === result.correct_option,
                      )?.text || "Unknown";
                    return (
                      <div
                        key={idx}
                        className={`p-6 rounded-2xl border backdrop-blur-sm ${result.is_correct ? "bg-green-900/10 border-green-500/20" : "bg-red-900/10 border-red-500/20"}`}
                        style={{ animation: `slide-up-fade 0.4s ease-out ${0.5 + idx * 0.05}s both` }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-semibold text-gray-200">
                            <span className="text-gray-500 mr-2">
                              Q{idx + 1}.
                            </span>{" "}
                            {result.question_text}
                          </h4>
                          <span
                            className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${result.is_correct ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-red-500/15 text-red-400 border border-red-500/20"}`}
                          >
                            {result.is_correct ? "Correct" : "Incorrect"}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-6">
                          <div className="glass-card p-3 rounded-lg">
                            <p className="text-xs text-gray-500 font-semibold mb-1">
                              Your Answer
                            </p>
                            <p className={`font-medium ${result.is_correct ? "text-green-400" : "text-red-400"}`}>
                              {selectedText}
                            </p>
                          </div>
                          <div className="glass-card p-3 rounded-lg">
                            <p className="text-xs text-gray-500 font-semibold mb-1">
                              Correct Answer
                            </p>
                            <p className="font-medium text-green-400">
                              {correctText}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 bg-indigo-900/15 p-4 rounded-xl border border-indigo-500/15">
                          <p className="text-xs text-indigo-400 font-semibold mb-1 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Explanation
                          </p>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {result.explanation}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 mt-10 justify-center" style={{ animation: 'slide-up-fade 0.5s ease-out 0.5s both' }}>
            <button
              onClick={() => {
                setTestStarted(false);
                setTestCompleted(false);
                setAttemptId(null);
                setQuestions([]);
                setAnswers({});
                setIsLocked(false);
                setServerStartTime(null);
                setTestResult(null);
              }}
              disabled={isLocked}
              className="btn-3d w-full md:w-auto px-8 py-3.5 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl"
            >
              Retake Assessment
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-3d w-full md:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold border border-white/10"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── LOADING QUESTIONS ───
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center noise-overlay">
        <div className="text-center" style={{ animation: 'scale-in 0.5s ease-out forwards' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium tracking-wider">
            Fetching secure questions...
          </p>
        </div>
      </div>
    );
  }

  // ─── ACTIVE TEST ───
  const currentQuestion = questions[currentIndex];
  const qId = currentQuestion._id || currentQuestion.id;
  const answeredCount = Object.values(answers).filter(
    (a) => a && a.selectedOption,
  ).length;

  return (
    <div className="min-h-screen bg-transparent text-gray-100 p-2 md:p-10 pb-24 md:pb-10 font-sans selection:bg-indigo-500/30 flex flex-col lg:flex-row justify-center items-start noise-overlay mesh-gradient">
      <div className="w-full max-w-4xl glass-card rounded-2xl shadow-2xl overflow-hidden relative flex flex-col" style={{ animation: 'card-entrance 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
        {/* Progress Bar */}
        <div className="h-1 bg-white/5 w-full absolute top-0 left-0">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 transition-all duration-500 ease-out"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-8 md:p-10 flex-1 flex flex-col">
          {/* Test Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-white/5 gap-4">
            <div className="flex items-center space-x-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
              </span>
              <div className="text-2xl font-mono text-white font-bold tracking-wider">
                {formattedTime}
              </div>
            </div>

            <div className="flex space-x-4 items-center">
              <div className="glass-card px-4 py-2 rounded-lg text-sm font-medium">
                <span className="text-indigo-400 font-bold">
                  {answeredCount}
                </span>{" "}
                / {questions.length} Answered
              </div>
              <button
                onClick={handleFinishTest}
                disabled={isLocked}
                className="btn-3d px-5 py-2.5 bg-white/5 hover:bg-red-600/80 text-red-400 hover:text-white border border-white/10 hover:border-red-500 rounded-lg font-semibold text-sm"
              >
                END EXAM EARLY
              </button>
            </div>
          </div>

          {/* Question Content */}
          <div
            className={`transition-all duration-300 flex-1 flex flex-col ${isLocked ? "opacity-40 pointer-events-none" : "opacity-100"}`}
          >
            <div className="mb-4 flex justify-between items-center text-gray-400 text-sm font-bold tracking-widest uppercase glass-card p-2 rounded-lg inline-block self-start">
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            <h2 className="text-xl md:text-3xl font-semibold mb-6 md:mb-8 text-white leading-relaxed tracking-tight" style={{ animation: 'slide-up-fade 0.3s ease-out' }}>
              {currentQuestion.text || currentQuestion.question_text}
            </h2>

            <div className="space-y-4 mb-8">
              {currentQuestion.options.map((opt, index) => {
                const optId = opt.id || opt._id;
                const isSelected = answers[qId]?.selectedOption === optId;
                const optionLetters = ["A", "B", "C", "D", "E"];
                return (
                  <div
                    key={optId}
                    onClick={() => handleOptionSelect(qId, optId)}
                    className={`group flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform ${isSelected ? "glass-card border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.01]" : "bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]"}`}
                    style={isSelected ? { animation: 'option-select 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)' } : {}}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm mr-4 transition-all duration-300 ${isSelected ? "bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]" : "bg-white/5 text-gray-400 group-hover:bg-white/10"}`}
                    >
                      {optionLetters[index]}
                    </div>
                    <span
                      className={`text-base md:text-lg transition-colors duration-300 ${isSelected ? "text-white font-medium" : "text-gray-300"}`}
                    >
                      {opt.text}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-auto"></div>

            {/* Navigation */}
            <div className="mt-8 flex flex-col md:flex-row justify-between items-center glass-card p-5 rounded-xl gap-4">
              <button
                onClick={() => handleClearChoice(qId)}
                disabled={!answers[qId]?.selectedOption}
                className="text-gray-400 hover:text-red-400 font-medium text-sm transition-all duration-300 disabled:opacity-30 flex items-center cursor-pointer"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Clear Choice
              </button>

              <div className="flex space-x-3 w-full md:w-auto">
                <button
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="btn-3d flex-1 md:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 disabled:bg-white/[0.02] disabled:text-gray-600 text-white rounded-lg font-bold border border-white/10 disabled:border-white/5 disabled:transform-none"
                >
                  Previous
                </button>
                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex(currentIndex + 1)}
                    className="btn-3d flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleFinishTest}
                    className="btn-3d flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold"
                  >
                    Complete Exam
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side Question Map Navigation Grid */}
      <div className="hidden lg:block w-72 ml-8">
        <div className="glass-card rounded-2xl shadow-2xl p-6 sticky top-10" style={{ animation: 'card-entrance-right 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both' }}>
          <h3 className="text-white font-bold mb-4 tracking-wide uppercase text-sm border-b border-white/10 pb-2">
            Question Map
          </h3>
          <div className="grid grid-cols-5 gap-2 custom-scrollbar max-h-[60vh] overflow-y-auto pr-2">
            {questions.map((q, i) => {
              const qId = q.id || q._id;
              const isAnswered = answers[qId]?.selectedOption;
              const isCurrent = i === currentIndex;

              let mapClass =
                "h-10 w-10 flex items-center justify-center rounded-lg text-sm font-bold cursor-pointer transition-all duration-300 ";

              if (isCurrent) {
                mapClass +=
                  "bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#0f111a] shadow-[0_0_15px_rgba(99,102,241,0.4)]";
              } else if (isAnswered) {
                mapClass +=
                  "bg-indigo-900/60 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-800/60";
              } else {
                mapClass +=
                  "bg-white/[0.03] border border-white/10 text-gray-400 hover:bg-white/[0.06] hover:border-white/20";
              }

              return (
                <div
                  key={qId}
                  onClick={() => setCurrentIndex(i)}
                  className={mapClass}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center text-xs text-gray-400 mb-2">
              <span className="w-3 h-3 rounded-full bg-indigo-900/60 border border-indigo-500/40 mr-2"></span>{" "}
              Answered
            </div>
            <div className="flex items-center text-xs text-gray-400 mb-2">
              <span className="w-3 h-3 rounded-full bg-white/[0.03] border border-white/10 mr-2"></span>{" "}
              Not Answered
            </div>
            <div className="flex items-center text-xs text-indigo-300">
              <span className="w-3 h-3 rounded-full bg-indigo-600 mr-2 shadow-[0_0_6px_rgba(99,102,241,0.4)]"></span>{" "}
              Current
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestEngine;
