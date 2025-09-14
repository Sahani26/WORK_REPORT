import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import '../styles/task-form.css';

const TaskForm = ({ onAdd, defaultMode = 'work' }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedBy: '',
    remarks: '',
    status: 'pending',
    mode: defaultMode
  });

  // Reset mode when page changes
  useEffect(() => {
    setForm((prev) => ({ ...prev, mode: defaultMode }));
  }, [defaultMode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert('Title is required');

    try {
      const res = await api.post('/tasks', form);
      onAdd(res.data);

      // Reset form
      setForm({
        title: '',
        description: '',
        assignedBy: '',
        remarks: '',
        status: 'pending',
        mode: defaultMode
      });
    } catch (err) {
      console.error(err);
      alert('Failed to create task');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2 className="form-title">➕ Add New Task ({defaultMode})</h2>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Task title"
        required
      />
      <input
        name="assignedBy"
        value={form.assignedBy}
        onChange={handleChange}
        placeholder="Assigned by"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        name="remarks"
        value={form.remarks}
        onChange={handleChange}
        placeholder="Remarks"
      />

      {/* Status dropdown */}
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="pending">🕒 Pending</option>
        <option value="in-progress">⚡ In-progress</option>
        <option value="completed">✅ Completed</option>
      </select>

      <button type="submit" className="submit-btn">Add Task</button>
    </form>
  );
};

export default TaskForm;
