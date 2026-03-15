import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const ktuSubjects = [
  {
    name: "Discrete Mathematical Structures",
    code: "MAT203",
    color: "from-blue-500 to-cyan-400",
    accent: "blue",
    weight: "15%",
  },
  {
    name: "Data Structures",
    code: "CST201",
    color: "from-purple-500 to-indigo-500",
    accent: "purple",
    weight: "20%",
  },
  {
    name: "Operating Systems",
    code: "CST206",
    color: "from-green-400 to-emerald-600",
    accent: "green",
    weight: "15%",
  },
  {
    name: "Computer Organization and Architecture",
    code: "CST202",
    color: "from-orange-400 to-red-500",
    accent: "orange",
    weight: "15%",
  },
  {
    name: "Database Management Systems",
    code: "CST204",
    color: "from-pink-500 to-rose-400",
    accent: "pink",
    weight: "15%",
  },
  {
    name: "Formal Languages and Automata Theory",
    code: "CST301",
    color: "from-yellow-400 to-amber-600",
    accent: "yellow",
    weight: "20%",
  },
];

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("/api/student/dashboard", config);
        if (res.data.success) {
          setDashboardData(res.data.dashboard);
        }
        const leadRes = await axios.get("/api/student/leaderboard", config);
        if (leadRes.data.success) {
          setLeaderboard(leadRes.data.leaderboard);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const startTest = (testId) => {
    navigate(`/test/${testId}`);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return alert("Image size must be less than 2MB");
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const base64Image = reader.result;
        const res = await axios.put(
          "/api/student/profile",
          { profile_picture: base64Image },
          config,
        );
        if (res.data.success) {
          setDashboardData((prev) => ({
            ...prev,
            userProfile: {
              ...prev.userProfile,
              profile_picture: res.data.user.profile_picture,
            },
          }));
        }
      } catch (error) {
        console.error("Failed to upload image", error);
        alert("Failed to update profile picture");
      } finally {
        setUploadingImage(false);
      }
    };
  };

  const profilePicUrl =
    dashboardData?.userProfile?.profile_picture ||
    user?.profile_picture ||
    null;

  return (
    <div className="min-h-screen bg-transparent text-gray-100 p-4 md:p-12 pb-24 md:pb-12 relative overflow-hidden font-sans noise-overlay mesh-gradient">
      {/* Animated 3D Background Orbs */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-900/10 rounded-full blur-[120px] float-3d pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-purple-900/10 rounded-full blur-[100px] float-3d-reverse pointer-events-none translate-y-1/2 -translate-x-1/4"></div>
      <div className="absolute top-1/2 left-1/2 w-[25rem] h-[25rem] bg-cyan-900/5 rounded-full blur-[80px] pulse-glow pointer-events-none"></div>

      {/* Floating Particles */}
      <div className="absolute top-[10%] left-[10%] w-1.5 h-1.5 bg-indigo-400/30 rounded-full pointer-events-none" style={{ animation: 'particle-float-1 12s ease-in-out infinite' }}></div>
      <div className="absolute top-[30%] right-[5%] w-2 h-2 bg-purple-400/20 rounded-full pointer-events-none" style={{ animation: 'particle-float-2 15s ease-in-out infinite' }}></div>
      <div className="absolute bottom-[20%] left-[30%] w-1 h-1 bg-cyan-400/40 rounded-full pointer-events-none" style={{ animation: 'particle-float-3 10s ease-in-out infinite' }}></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Top bar for desktop logout */}
        <div className="hidden md:flex justify-end pt-4" style={{ animation: 'slide-down-fade 0.5s ease-out both' }}>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn-3d flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl transition-all duration-300 text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5" style={{ animation: 'slide-up-fade 0.6s ease-out both' }}>
          <div className="flex items-center gap-4">
            {/* Profile Picture Area */}
            <div className="relative group flex-shrink-0">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.15)] transition-all duration-500 group-hover:border-indigo-400 group-hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] bg-gray-800/80 flex items-center justify-center backdrop-blur-sm">
                {uploadingImage ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                ) : profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-gray-500">
                    {dashboardData?.userProfile?.name?.charAt(0) ||
                      user?.name?.charAt(0) ||
                      "S"}
                  </span>
                )}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-2xl cursor-pointer backdrop-blur-sm"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white mb-1 truncate">
                Hello,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                  {dashboardData?.userProfile?.name?.split(" ")[0] ||
                    user?.name?.split(" ")[0] ||
                    "Student"}
                </span>
                !
              </h1>
              <p className="text-indigo-200/60 font-medium tracking-wide text-xs truncate">
                {dashboardData?.userProfile?.email || user?.email}
              </p>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 backdrop-blur-sm">
                KTU S6 CST 308
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 flex gap-6 md:gap-8 w-full md:w-auto overflow-x-auto" style={{ animation: 'card-entrance-right 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both' }}>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Total Assessments
              </p>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {isLoading ? "-" : dashboardData?.totalTestsTaken || 0}
              </p>
            </div>
            <div className="w-px bg-gray-700/50"></div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Avg. Accuracy
              </p>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                {isLoading
                  ? "-"
                  : `${dashboardData?.overallAccuracy || "0.00"}%`}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: KTU Subjects */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between" style={{ animation: 'slide-up-fade 0.5s ease-out 0.2s both' }}>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Syllabus Matrix
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {ktuSubjects.map((subject, idx) => {
                const subjectObj = dashboardData?.subjectMastery || {};
                const masteryScore = subjectObj[subject.name] || 0;
                return (
                  <div
                    key={idx}
                    className="glass-card glass-card-hover rounded-2xl p-6 cursor-pointer group shadow-lg"
                    style={{ animation: `slide-up-fade 0.5s ease-out ${0.1 + idx * 0.08}s both` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`px-3 py-1 rounded-lg bg-gradient-to-br ${subject.color} shadow-lg transition-transform duration-300 group-hover:scale-105`}
                      >
                        <span className="text-xs font-bold text-white tracking-wider">
                          {subject.code}
                        </span>
                      </div>
                      <span className="text-xs font-medium bg-white/5 text-gray-400 px-2.5 py-1 rounded-full border border-white/10">
                        Wt: {subject.weight}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300 mb-4">
                      {subject.name}
                    </h3>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${subject.color} opacity-80 group-hover:opacity-100 transition-all duration-1000`}
                        style={{ width: `${masteryScore}%` }}
                      ></div>
                    </div>
                    <p className="text-xs font-medium text-gray-500 mt-3 text-right group-hover:text-indigo-300/70 transition-colors duration-300">
                      {masteryScore.toFixed(0)} mastery points
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Exams & Actions */}
          <div className="space-y-6">
            {/* Primary Action Card */}
            <div className="relative glass-card rounded-3xl p-7 shadow-2xl overflow-hidden group border-indigo-500/20" style={{ animation: 'card-entrance-right 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/25 transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 group-hover:bg-purple-500/15 transition-colors duration-500"></div>

              <h2 className="text-xl font-bold mb-6 text-white flex items-center relative z-10">
                <span className="bg-indigo-500/15 p-2 rounded-xl mr-3 border border-indigo-500/25 backdrop-blur-sm">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </span>
                Next Assessments
              </h2>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
              ) : dashboardData?.availableTests?.length > 0 ? (
                <div className="space-y-4 relative z-10">
                  {dashboardData.availableTests.map((test, testIdx) => (
                    <div
                      key={test._id}
                      className="glass-card rounded-2xl p-5 border-indigo-500/15 hover:border-indigo-400/40 transition-all duration-300 shadow-lg"
                      style={{ animation: `slide-up-fade 0.4s ease-out ${0.4 + testIdx * 0.1}s both`, borderColor: 'rgba(99, 102, 241, 0.15)' }}
                    >
                      <h3 className="font-bold text-gray-100 mb-1">
                        {test.title}
                      </h3>
                      <div className="flex items-center text-xs font-medium text-indigo-300 mb-5 space-x-3">
                        <span className="flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>{" "}
                          {test.total_duration_minutes} Min
                        </span>
                        <span className="flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                          </svg>{" "}
                          {test.subject}
                        </span>
                      </div>
                      <button
                        onClick={() => startTest(test._id)}
                        className="btn-3d w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl transition-all"
                      >
                        Start Assessment
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-6 text-center">
                  <p className="text-sm font-medium text-gray-400">
                    No mock tests available currently. Stay tuned.
                  </p>
                </div>
              )}
            </div>

            {/* Recent Activity Card */}
            <div className="glass-card rounded-3xl p-7" style={{ animation: 'card-entrance-right 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both' }}>
              <h2 className="text-lg font-bold mb-5 text-gray-200 flex items-center">
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Recent Activity
              </h2>

              {isLoading ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                </div>
              ) : dashboardData?.recentActivity?.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 bg-white/[0.03] rounded-xl border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300"
                      style={{ animation: `slide-up-fade 0.4s ease-out ${0.5 + index * 0.08}s both` }}
                    >
                      <div>
                        <p className="font-semibold text-gray-200 text-sm truncate max-w-[180px]">
                          {activity.testTitle}
                        </p>
                        <p className="text-xs font-medium text-gray-500 mt-1">
                          {new Date(activity.date).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                          {activity.score} pts
                        </p>
                        <div className="flex items-center justify-end mt-1">
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${activity.accuracy > 70 ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]" : activity.accuracy > 40 ? "bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.5)]" : "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.5)]"}`}
                          ></span>
                          <p className="text-xs font-medium text-gray-400">
                            {activity.accuracy.toFixed(0)}% var
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
                  <svg className="w-12 h-12 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                  </svg>
                  <p className="text-sm font-medium text-gray-500">
                    History is clean.
                  </p>
                </div>
              )}
            </div>

            {/* Leaderboard Card */}
            <div className="glass-card rounded-3xl p-7 mt-6" style={{ animation: 'card-entrance-right 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both' }}>
              <h2 className="text-lg font-bold mb-5 text-gray-200 flex items-center">
                <span className="bg-yellow-500/15 p-2 rounded-xl mr-3 border border-yellow-500/25 backdrop-blur-sm">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                  </svg>
                </span>
                Global Leaderboard
              </h2>

              {isLoading ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                </div>
              ) : leaderboard?.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                  {leaderboard.map((student, index) => (
                    <div
                      key={student._id || index}
                      className={`flex items-center p-3 rounded-xl border transition-all duration-300 ${index === 0 ? "bg-yellow-900/20 border-yellow-500/30 hover:bg-yellow-900/35 shadow-[0_0_15px_rgba(234,179,8,0.08)]" : index === 1 ? "bg-gray-400/5 border-gray-400/20 hover:bg-gray-400/10" : index === 2 ? "bg-orange-900/15 border-orange-700/20 hover:bg-orange-900/25" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"}`}
                      style={{ animation: `slide-up-fade 0.4s ease-out ${0.6 + index * 0.06}s both` }}
                    >
                      <div className="w-6 font-bold text-gray-500 text-center mr-3">
                        {index === 0
                          ? "🥇"
                          : index === 1
                            ? "🥈"
                            : index === 2
                              ? "🥉"
                              : `#${index + 1}`}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-bold text-sm truncate max-w-[150px] ${index === 0 ? "text-yellow-400" : "text-gray-200"}`}
                        >
                          {student.name}
                          {student.name ===
                            (dashboardData?.userProfile?.name || user?.name) &&
                            " (You)"}
                        </p>
                        <p className="text-xs font-medium text-gray-500">
                          {student.tests_taken} Tests Taken
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">
                          {student.overall_accuracy?.toFixed(1) || "0.0"}%
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                          Accuracy
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm font-medium text-gray-500">
                    No data available yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
