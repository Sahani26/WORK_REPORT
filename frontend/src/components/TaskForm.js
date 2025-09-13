import React, { useState } from 'react';
import api from '../utils/api';
import '../styles/task-form.css';

const TaskForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedBy: '',
    remarks: '',
    status: 'pending'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert('Title is required');

    try {
      const res = await api.post('/tasks', form);
      onAdd(res.data);
      setForm({ title: '', description: '', assignedBy: '', remarks: '', status: 'pending' });
    } catch (err) {
      console.error(err);
      alert('Failed to create task');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Task title" />
      <input name="assignedBy" value={form.assignedBy} onChange={handleChange} placeholder="Assigned by" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      <input name="remarks" value={form.remarks} onChange={handleChange} placeholder="Remarks" />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="pending">Pending</option>
        <option value="in-progress">In-progress</option>
        <option value="completed">Completed</option>
      </select>
      <button type="submit">Add  Task</button>
    </form>
  );
};

export default TaskForm;
