"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting until component is mounted on client
  useEffect(() => {
    setMounted(true);
    const savedTasks = localStorage.getItem("today_tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Failed to parse tasks from localStorage", e);
      }
    }
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("today_tasks", JSON.stringify(tasks));
    }
  }, [tasks, mounted]);

  // Date Formatting for Subtitle
  const getFormattedDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    return today.toLocaleDateString("ko-KR", options);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const newTask: Task = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      createdAt: timeString,
    };

    setTasks((prev) => [newTask, ...prev]);
    setInputText("");
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const totalCount = tasks.length;
  const completedCount = tasks.filter((task) => task.completed).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Encouraging Message
  const getEncouragement = () => {
    if (totalCount === 0) return "오늘의 할 일을 등록해 보세요! ✨";
    if (progressPercent === 0) return "오늘 하루도 화이팅해요! 💪";
    if (progressPercent < 50) return "차근차근 하나씩 해봐요! 😊";
    if (progressPercent < 100) return "거의 다 왔어요! 조금만 더! 🔥";
    return "오늘의 할 일을 모두 완료했어요! 🎉";
  };

  if (!mounted) {
    // Return a blank skeleton with the same background to prevent flash
    return (
      <div className="bg-wrapper">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="app-container">
          <div className="todo-card" style={{ height: "400px", justifyContent: "center", alignItems: "center" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-wrapper">
      {/* Background Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <div className="app-container">
        <div className="todo-card">
          
          {/* Header */}
          <header className="card-header">
            <div className="header-title-row">
              <h1 className="card-title">오늘 할 일</h1>
              <span className="date-subtitle">{getFormattedDate()}</span>
            </div>
            
            {/* Progress Section */}
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="progress-stats">
              <span className="progress-encouragement">{getEncouragement()}</span>
            </div>
          </header>

          {/* Input Form */}
          <form className="todo-form" onSubmit={handleAddTask}>
            <div className="todo-input-wrapper">
              <input
                type="text"
                className="todo-input"
                placeholder="새로운 할 일을 입력하세요..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                maxLength={80}
              />
            </div>
            <Button type="submit" className="h-[46px] px-6 rounded-[14px] font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_12px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_18px_rgba(255,255,255,0.25)]">
              추가
            </Button>
          </form>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              전체
            </button>
            <button
              className={`filter-tab ${filter === "active" ? "active" : ""}`}
              onClick={() => setFilter("active")}
            >
              진행중
            </button>
            <button
              className={`filter-tab ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              완료
            </button>
          </div>

          {/* Task List container */}
          <div className="task-list-container">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon-wrapper">
                  <svg
                    className="empty-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h3 className="empty-title">
                  {filter === "all"
                    ? "등록된 할 일이 없습니다"
                    : filter === "active"
                    ? "진행 중인 할 일이 없습니다"
                    : "완료된 할 일이 없습니다"}
                </h3>
                <p className="empty-desc">
                  {filter === "all"
                    ? "아래의 입력창에 오늘 해야 할 중요한 일을 추가해보세요."
                    : filter === "active"
                    ? "오늘 계획한 일을 모두 마쳤거나 새로운 일을 추가해보세요."
                    : "오늘 완료한 일이 아직 없습니다. 화이팅!"}
                </p>
              </div>
            ) : (
              <ul className="task-list">
                {filteredTasks.map((task) => (
                  <li
                    key={task.id}
                    className={`task-item ${task.completed ? "completed" : ""}`}
                  >
                    <div className="task-item-left">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          className="checkbox-input"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task.id)}
                        />
                        <span className="checkbox-custom">
                          <svg
                            className="checkmark-svg"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      </label>
                      <div className="task-content">
                        <span className="task-text">{task.text}</span>
                        <span className="task-time">{task.createdAt} 작성</span>
                      </div>
                    </div>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteTask(task.id)}
                      title="삭제"
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Bottom Stats Counter */}
          <div className="bottom-stats-counter">
            총 {totalCount}개 중 {completedCount}개 완료
          </div>

          <footer className="footer-info">
            <p>© {new Date().getFullYear()} 오늘 할 일 • All Rights Reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
