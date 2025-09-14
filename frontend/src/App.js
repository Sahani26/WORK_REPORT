import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskListPage from "./pages/TaskListPage"; // 👈 New page
import api from "./utils/api";
import "./styles/app.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [pageMode, setPageMode] = useState("work"); // work | personal

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("❌ Error fetching tasks:", err);
    }
  };

  const addTask = (task) => setTasks([task, ...tasks]);
  const updateTask = (updated) =>
    setTasks(tasks.map((t) => (t._id === updated._id ? updated : t)));
  const deleteTask = (id) => setTasks(tasks.filter((t) => t._id !== id));

  return (
    <Router>
      <div className="app-container">
        <h1>📊 Work Report</h1>

        {/* 🔗 Navigation */}
        <nav className="nav-links">
          <Link to="/">➕ Add Task</Link>
          <Link to="/tasks">📋 Task List</Link>
        </nav>

        <Routes>
          {/* ➕ Add Task Page */}
          <Route
            path="/"
            element={
              <>
                {/* Work / Personal Toggle */}
                <div className="page-mode-toggle">
                  <button
                    onClick={() => setPageMode("work")}
                    className={pageMode === "work" ? "active" : ""}
                  >
                    🏢 Work
                  </button>
                  <button
                    onClick={() => setPageMode("personal")}
                    className={pageMode === "personal" ? "active" : ""}
                  >
                    🏠 Personal
                  </button>
                </div>

                {/* Task Form (auto-assigns mode) */}
                <TaskForm onAdd={addTask} defaultMode={pageMode} />

                {/* Task List (filtered by mode) */}
                <TaskList
                  tasks={tasks.filter((t) => t.mode === pageMode)}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                />
              </>
            }
          />

          {/* 📋 Task List Page with filters */}
          <Route
            path="/tasks"
            element={<TaskListPage />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
