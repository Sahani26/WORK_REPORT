import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "../styles/task-list.css";

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("today");
  const [customDates, setCustomDates] = useState({ start: "", end: "" });
  const [mode, setMode] = useState("work");
  const [editMode, setEditMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskData, setEditedTaskData] = useState({ title: "", description: "", status: "" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const filterTasks = () => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    return tasks.filter((task) => {
      if (task.mode !== mode) return false;
      const createdDate = task.createdAt?.split("T")[0];

      if (filter === "today") return createdDate === today;
      if (filter === "yesterday") return createdDate === yesterday;
      if (filter === "custom") {
        return createdDate >= customDates.start && createdDate <= customDates.end;
      }
      return true;
    });
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditedTaskData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditedTaskData({ title: "", description: "", status: "" });
  };

  const saveEditedTask = async () => {
    try {
      const res = await api.put(`/tasks/${editingTaskId}`, editedTaskData);
      setTasks(tasks.map((task) => (task._id === editingTaskId ? res.data : task)));
      cancelEditing();
    } catch (err) {
      console.error("Error updating task", err);
      alert("Failed to update task.");
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/tasks/${taskId}`);
        setTasks(tasks.filter((t) => t._id !== taskId));
      } catch (err) {
        console.error("Error deleting task", err);
        alert("Failed to delete task. Please try again.");
      }
    }
  };

  return (
    <div className="task-list">
      <div className="task-list-header">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>

        <div className={`header-menus ${menuOpen ? "open" : ""}`}>
          <div className="mode-toggle">
            <button className={mode === "work" ? "active" : ""} onClick={() => setMode("work")}>
              🏢 Work
            </button>
            <button className={mode === "personal" ? "active" : ""} onClick={() => setMode("personal")}>
              🏠 Personal
            </button>
          </div>

          <button className="toggle-actions-btn" onClick={() => setEditMode(!editMode)}>
            {editMode ? "Disable Edit" : "Enable Edit"}
          </button>

          <div className="quick-filter">
            <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
            <button className={filter === "today" ? "active" : ""} onClick={() => setFilter("today")}>Today</button>
            <button className={filter === "yesterday" ? "active" : ""} onClick={() => setFilter("yesterday")}>Yesterday</button>
            <button className={filter === "custom" ? "active" : ""} onClick={() => setFilter("custom")}>Date Range</button>
          </div>

          {filter === "custom" && (
            <div className="date-picker">
              <label>From:</label>
              <input type="date" value={customDates.start} onChange={(e) => setCustomDates({ ...customDates, start: e.target.value })} />
              <label>To:</label>
              <input type="date" value={customDates.end} onChange={(e) => setCustomDates({ ...customDates, end: e.target.value })} />
            </div>
          )}
        </div>
      </div>

      {/* Render task cards */}
      {filterTasks().map((task) => (
        <div key={task._id} className="task-item">
          {editingTaskId === task._id ? (
            <>
              <input
                type="text"
                value={editedTaskData.title}
                onChange={(e) => setEditedTaskData({ ...editedTaskData, title: e.target.value })}
              />
              <textarea
                value={editedTaskData.description}
                onChange={(e) => setEditedTaskData({ ...editedTaskData, description: e.target.value })}
              />
              <select
                value={editedTaskData.status}
                onChange={(e) => setEditedTaskData({ ...editedTaskData, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <div className="task-actions">
                <button onClick={saveEditedTask}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p><span className={`status-badge ${task.status}`}>{task.status}</span></p>
              <p><strong>Created:</strong> {new Date(task.createdAt).toLocaleDateString()}</p>
              {task.completionDate && (
                <p><strong>Completion:</strong> {new Date(task.completionDate).toLocaleDateString()}</p>
              )}

              {editMode && (
                <div className="task-actions">
                  <button onClick={() => startEditing(task)}>Edit</button>
                  <button onClick={() => handleDelete(task._id)}>Delete</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}

      {filterTasks().length === 0 && (
        <p className="task-summary">No {mode} tasks found for this filter.</p>
      )}
    </div>
  );
};

export default TaskListPage;
